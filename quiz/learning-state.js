(function (root) {
  "use strict";

  const TOPICS = [
    { id: "iam", label: "IAM・権限管理", aliases: ["iam", "identity center", "permission", "permissions boundary", "scp", "sts", "cognito", "認証", "認可", "権限", "アクセスキー", "role", "policy"] },
    { id: "vpc", label: "VPC・ネットワーク", aliases: ["vpc", "subnet", "security group", "nacl", "nat gateway", "internet gateway", "private link", "privatelink", "transit gateway", "direct connect", "vpn", "route 53", "cloudfront", "global accelerator", "alb", "nlb", "endpoint", "cidr", "ネットワーク", "ルーティング"] },
    { id: "s3", label: "S3・オブジェクトストレージ", aliases: ["s3", "object lock", "glacier", "bucket", "オブジェクト", "ストレージクラス", "versioning"] },
    { id: "rds", label: "RDS・Aurora", aliases: ["rds", "aurora", "read replica", "multi-az", "point-in-time", "relational", "mysql", "postgresql", "db instance", "データベース"] },
    { id: "messaging", label: "SQS・イベント連携", aliases: ["sqs", "sns", "eventbridge", "step functions", "kinesis", "queue", "topic", "fanout", "dead-letter", "dlq", "redrive", "疎結合", "非同期", "イベント"] },
    { id: "dr", label: "可用性・DR", aliases: ["rpo", "rto", "disaster recovery", "elastic disaster recovery", "aws drs", "backup and restore", "pilot light", "warm standby", "active-active", "failover", "フェイルオーバー", "バックアップ", "障害", "可用性", "冗長", "復旧", "複数az", "複数リージョン"] },
    { id: "compute", label: "コンピュート・サーバーレス", aliases: ["ec2", "lambda", "fargate", "ecs", "eks", "auto scaling", "api gateway", "placement group", "provisioned concurrency", "container", "kubernetes", "コンテナ", "サーバーレス", "インスタンス"] },
    { id: "storage", label: "ブロック・ファイルストレージ", aliases: ["ebs", "efs", "fsx", "storage gateway", "datasync", "block storage", "file system", "ファイル共有", "ブロックストレージ"] },
    { id: "database", label: "NoSQL・分析DB", aliases: ["dynamodb", "dax", "elasticache", "redshift", "athena", "opensearch", "neptune", "timestream", "nosql", "dwh", "グラフdb", "時系列db"] },
    { id: "security", label: "暗号化・セキュリティ", aliases: ["kms", "acm", "waf", "shield", "guardduty", "macie", "inspector", "cloudtrail", "cloudhsm", "network firewall", "firewall manager", "aws config", "secrets manager", "parameter store", "暗号", "脅威", "脆弱性", "証明書", "機密"] },
    { id: "cost", label: "コスト最適化", aliases: ["cost", "budget", "anomaly detection", "storage lens", "savings plans", "reserved instances", "spot", "compute optimizer", "trusted advisor", "料金", "予算", "低コスト", "コスト", "割引", "購入オプション", "rightsizing"] },
  ];

  const DOMAIN_FALLBACK = {
    secure: { id: "security", label: "暗号化・セキュリティ" },
    resilient: { id: "dr", label: "可用性・DR" },
    performance: { id: "compute", label: "コンピュート・サーバーレス" },
    cost: { id: "cost", label: "コスト最適化" },
  };

  function clonePick(pick) {
    return Array.isArray(pick) ? pick.map(Number).filter(Number.isInteger) : [];
  }

  function normalizeAttempt(attempt) {
    if (!attempt || !Array.isArray(attempt.pick) || typeof attempt.ok !== "boolean") return null;
    return {
      pick: clonePick(attempt.pick),
      ok: attempt.ok,
      at: typeof attempt.at === "string" ? attempt.at : "",
    };
  }

  function normalizeRecord(record) {
    if (!record || typeof record !== "object") return null;
    let attempts = Array.isArray(record.attempts)
      ? record.attempts.map(normalizeAttempt).filter(Boolean)
      : [];
    if (!attempts.length && Array.isArray(record.pick) && typeof record.ok === "boolean") {
      attempts = [{
        pick: clonePick(record.pick),
        ok: record.ok,
        at: typeof record.at === "string" ? record.at : "",
      }];
    }
    if (!attempts.length) return null;
    const last = attempts[attempts.length - 1];
    return { pick: clonePick(last.pick), ok: last.ok, at: last.at, attempts };
  }

  function normalizeResults(rawResults) {
    const normalized = {};
    if (!rawResults || typeof rawResults !== "object") return normalized;
    for (const [questionId, record] of Object.entries(rawResults)) {
      const value = normalizeRecord(record);
      if (value) normalized[questionId] = value;
    }
    return normalized;
  }

  function recordAttempt(rawResults, questionId, pick, ok, at) {
    const results = normalizeResults(rawResults);
    const previous = results[questionId];
    const attempt = {
      pick: clonePick(pick),
      ok: Boolean(ok),
      at: typeof at === "string" ? at : new Date().toISOString(),
    };
    const attempts = previous ? [...previous.attempts, attempt] : [attempt];
    return {
      ...results,
      [questionId]: { pick: clonePick(attempt.pick), ok: attempt.ok, at: attempt.at, attempts },
    };
  }

  function attemptsFor(record) {
    const normalized = normalizeRecord(record);
    return normalized ? normalized.attempts : [];
  }

  function questionStats(record) {
    const attempts = attemptsFor(record);
    return {
      attempts: attempts.length,
      wrong: attempts.filter(attempt => !attempt.ok).length,
      correct: attempts.filter(attempt => attempt.ok).length,
      unresolved: Boolean(attempts.length && !attempts[attempts.length - 1].ok),
    };
  }

  function matchTopics(text) {
    const value = String(text || "").toLowerCase();
    return TOPICS
      .filter(topic => topic.aliases.some(alias => value.includes(alias.toLowerCase())))
      .map(topic => topic.id);
  }

  function topicsForQuestion(question) {
    if (!question) return [];
    const correctChoices = (question.a || [])
      .map(index => (question.c || [])[index])
      .filter(Boolean)
      .join(" ");
    const correctTopics = matchTopics(correctChoices);
    if (correctTopics.length) return [...new Set(correctTopics)];
    const questionTopics = matchTopics(question.q);
    if (questionTopics.length) return [...new Set(questionTopics)];
    const explanationTopics = matchTopics(question.e);
    if (explanationTopics.length) return [...new Set(explanationTopics)];
    const fallback = DOMAIN_FALLBACK[question.domain];
    return fallback ? [fallback.id] : [];
  }

  function topicMeta(topicId) {
    return TOPICS.find(topic => topic.id === topicId) ||
      Object.values(DOMAIN_FALLBACK).find(topic => topic.id === topicId) ||
      { id: topicId, label: topicId };
  }

  function buildWeaknessSummary(questions, rawResults) {
    const results = normalizeResults(rawResults);
    const summary = new Map();
    for (const question of questions || []) {
      const record = results[question.id];
      if (!record) continue;
      const stats = questionStats(record);
      for (const topicId of topicsForQuestion(question)) {
        const meta = topicMeta(topicId);
        const current = summary.get(topicId) || {
          id: topicId,
          label: meta.label,
          wrong: 0,
          correct: 0,
          unresolved: 0,
          questions: 0,
          score: 0,
        };
        current.wrong += stats.wrong;
        current.correct += stats.correct;
        current.unresolved += stats.unresolved ? 1 : 0;
        current.questions += 1;
        summary.set(topicId, current);
      }
    }
    return [...summary.values()]
      .map(item => ({
        ...item,
        score: Math.max(0, item.wrong * 2 + item.unresolved * 2 - item.correct * 0.5),
      }))
      .filter(item => item.wrong > 0 && item.score > 0)
      .sort((a, b) => b.score - a.score || b.unresolved - a.unresolved || b.wrong - a.wrong || a.label.localeCompare(b.label, "ja"));
  }

  function buildReinforcementSet(questions, rawResults, limit = 20) {
    const results = normalizeResults(rawResults);
    const weaknesses = buildWeaknessSummary(questions, results);
    if (!weaknesses.length) return [];
    const topicScores = new Map(weaknesses.map(item => [item.id, item.score]));
    const topTopics = new Set(weaknesses.slice(0, 5).map(item => item.id));
    const ranked = (questions || [])
      .map((question, index) => {
        const topics = topicsForQuestion(question);
        const relevant = topics.some(topic => topTopics.has(topic));
        const stats = questionStats(results[question.id]);
        const topicScore = topics.reduce((sum, topic) => sum + (topicScores.get(topic) || 0), 0);
        return { id: question.id, index, relevant, stats, topicScore };
      })
      .filter(item => item.stats.unresolved || item.relevant)
      .sort((a, b) =>
        Number(b.stats.unresolved) - Number(a.stats.unresolved) ||
        b.stats.wrong - a.stats.wrong ||
        b.topicScore - a.topicScore ||
        a.stats.attempts - b.stats.attempts ||
        a.index - b.index
      );
    return ranked.slice(0, Math.max(1, Number(limit) || 20)).map(item => item.id);
  }

  root.SAA_LEARNING = {
    TOPICS: TOPICS.map(topic => ({ id: topic.id, label: topic.label })),
    normalizeResults,
    recordAttempt,
    attemptsFor,
    questionStats,
    topicsForQuestion,
    buildWeaknessSummary,
    buildReinforcementSet,
  };
})(typeof window !== "undefined" ? window : globalThis);
