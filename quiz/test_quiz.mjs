import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

const indexPath = new URL("./index.html", import.meta.url);
const glossaryPath = new URL("./glossary.js", import.meta.url);
const questionsPath = new URL("./questions.js", import.meta.url);
const reasonsPath = new URL("./choice-reasons.js", import.meta.url);
const learningPath = new URL("./learning-state.js", import.meta.url);
const readmePath = new URL("../README.md", import.meta.url);
const launcherPath = new URL("../START.bat", import.meta.url);
const projectRoot = new URL("../", import.meta.url);

const indexHtml = fs.readFileSync(indexPath, "utf8");
const glossarySource = fs.readFileSync(glossaryPath, "utf8");
const questionsSource = fs.readFileSync(questionsPath, "utf8");
const reasonsSource = fs.readFileSync(reasonsPath, "utf8");
const learningSource = fs.readFileSync(learningPath, "utf8");
const readme = fs.readFileSync(readmePath, "utf8");
const launcher = fs.readFileSync(launcherPath, "utf8");
const sandbox = { window: {} };
vm.runInNewContext(glossarySource, sandbox);
vm.runInNewContext(questionsSource, sandbox);
vm.runInNewContext(reasonsSource, sandbox);
vm.runInNewContext(learningSource, sandbox);

const glossary = sandbox.window.SAA_GLOSSARY;
const boundary = sandbox.window.SAA_GLOSSARY_BOUNDARY;
const questions = sandbox.window.SAA_QUESTIONS;
const learning = sandbox.window.SAA_LEARNING;
const plain = value => JSON.parse(JSON.stringify(value));

const normalize = text => text.replace(/[\s、。・/＋+()（）「」]/g, "").toLowerCase();
const bigrams = text => {
  const value = normalize(text);
  return new Set([...Array(Math.max(value.length - 1, 0))].map((_, index) => value.slice(index, index + 2)));
};
const similarity = (left, right) => {
  const a = bigrams(left);
  const b = bigrams(right);
  const intersection = [...a].filter(token => b.has(token)).length;
  const union = new Set([...a, ...b]).size;
  return union ? intersection / union : 0;
};

test("公開問題バンクは再利用可能な105問だけを公開する", () => {
  assert.equal(questions.length, 105);
  assert.equal(new Set(questions.map(question => question.id)).size, 105);
  assert.ok(questions.every(question => question.kind !== "foundation"));
  assert.ok(questions.every(question => !question.source));
  for (const question of questions) {
    assert.ok(["secure", "resilient", "performance", "cost"].includes(question.domain), `${question.id}: domainが不正`);
    assert.ok(typeof question.q === "string" && question.q.length >= 12, `${question.id}: 問題文が短すぎる`);
    assert.ok(Array.isArray(question.c) && question.c.length >= 4, `${question.id}: 選択肢が4件未満`);
    assert.ok(Array.isArray(question.a) && question.a.length >= 1, `${question.id}: 正解が未設定`);
    assert.ok(question.a.every(index => Number.isInteger(index) && index >= 0 && index < question.c.length), `${question.id}: 正解indexが不正`);
  }
});

test("65問模試は公式分野比率へ近い19/17/16/13で構成する", () => {
  assert.deepEqual(plain(sandbox.window.SAA_EXAM_BLUEPRINT), { secure: 19, resilient: 17, performance: 16, cost: 13 });
  assert.equal(Object.values(sandbox.window.SAA_EXAM_BLUEPRINT).reduce((sum, value) => sum + value, 0), 65);
  for (const [domain, count] of Object.entries(sandbox.window.SAA_EXAM_BLUEPRINT)) {
    assert.ok(questions.filter(question => question.domain === domain).length >= count, `${domain}: 模試必要数を満たさない`);
  }
});

test("全105問に選択肢ごとの具体的な理由がある", () => {
  for (const question of questions) {
    assert.ok(Array.isArray(question.r), `${question.id}: rがない`);
    assert.equal(question.r.length, question.c.length, `${question.id}: 選択肢と理由の件数が一致しない`);
    for (let index = 0; index < question.r.length; index += 1) {
      const reason = question.r[index];
      assert.ok(typeof reason === "string" && reason.trim().length >= 12, `${question.id}: 理由が短すぎる`);
      assert.doesNotMatch(reason, /主要要件とは異なる機能・構成/, `${question.id}: 理由が具体化されていない`);
      if (!question.a.includes(index)) assert.ok(!reason.includes(question.e), `${question.id}: 不正解理由が総合解説の再掲`);
    }
  }
});

test("全公開問題の問題文に近すぎる重複がない", () => {
  for (let left = 0; left < questions.length; left += 1) {
    for (let right = left + 1; right < questions.length; right += 1) {
      const score = similarity(questions[left].q, questions[right].q);
      assert.ok(score < 0.55, `${questions[left].id} と ${questions[right].id} の類似度が高すぎる (${score.toFixed(2)})`);
    }
  }
});

test("OUなど短い用語は長い英単語の部分一致でツールチップ化しない", () => {
  assert.ok(Array.isArray(glossary));
  assert.equal(typeof boundary.canWrap, "function");
  assert.equal(boundary.canWrap("OU", 0, "OU"), true);
  assert.equal(boundary.canWrap("OUを", 0, "OU"), true);
  assert.equal(boundary.canWrap("AWS OrganizationsのOU", 18, "OU"), true);
  assert.equal(boundary.canWrap("account", 3, "ou"), false);
  assert.equal(boundary.canWrap("throughput", 3, "ou"), false);
  assert.match(indexHtml, /GLOSSARY_BOUNDARY\.canWrap\(source, offset, match\)/);
});

test("再挑戦では過去回答と正解を回答前に表示しない", () => {
  assert.doesNotMatch(indexHtml, /showAnswer\(prior\.pick,\s*false\)/);
  assert.doesNotMatch(indexHtml, /const prior = results\[q\.id\]/);
  assert.match(indexHtml, /el\.answerBox\.classList\.remove\("visible"\)/);
  assert.match(indexHtml, /function showAnswer\(pick, save = true\)/);
  assert.match(indexHtml, /if \(save\) \{ results = LEARNING\.recordAttempt/);
});

test("公開UIに個人用基礎モードや固定試験日を残さない", () => {
  assert.doesNotMatch(indexHtml, /data-mode="foundation/);
  assert.doesNotMatch(indexHtml, /SAA_FOUNDATION_BATCH|FOUNDATION2_BATCH|FOUNDATION3_BATCH|FOUNDATION4_BATCH/);
  assert.doesNotMatch(indexHtml, /2026年8月14日|Date\.UTC\(2026,\s*7,\s*14\)/);
  assert.match(indexHtml, /PUBLIC_MODES/);
});

test("クイズUIは新しい教材導線と一般向け文言だけを使う", () => {
  assert.match(indexHtml, /index\.html\?doc=01-start-here/);
  assert.match(indexHtml, /index\.html\?doc=08-final-review/);
  assert.match(indexHtml, /data-mode="new">新着問題<\/button>/);
  assert.doesNotMatch(indexHtml, /doc=00-plan|doc=07-final-checklist|今回の追加問題/);
  assert.doesNotMatch(indexHtml, /初見の65問模試で2回連続75|60%台なら/);
  assert.match(indexHtml, /<title>AWS SAA-C03 問題演習<\/title>/);
  assert.match(indexHtml, /<h1>AWS SAA-C03 問題演習<\/h1>/);
  assert.doesNotMatch(indexHtml, /<title>AWS SAA-C03 65問模試<\/title>|<h1>AWS SAA-C03 65問模試<\/h1>/);
});

test("quiz/index.htmlのinline JavaScriptが構文として成立する", () => {
  const inlineScripts = [...indexHtml.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
    .map(match => match[1])
    .filter(source => source.trim());
  const appScript = inlineScripts.find(source => source.includes("const LABELS"));
  assert.ok(appScript, "quiz application scriptが見つからない");
  assert.doesNotThrow(() => new vm.Script(appScript));
});

test("旧形式の正誤結果を回答履歴へ移行できる", () => {
  const migrated = learning.normalizeResults({
    "secure-01": { pick: [0], ok: false, at: "2026-07-20T00:00:00.000Z" },
  });
  assert.deepEqual(plain(migrated["secure-01"].attempts), [
    { pick: [0], ok: false, at: "2026-07-20T00:00:00.000Z" },
  ]);
});

test("解き直して正解しても過去の誤答履歴を保持する", () => {
  let results = learning.normalizeResults({});
  results = learning.recordAttempt(results, "secure-01", [0], false, "2026-07-20T00:00:00.000Z");
  results = learning.recordAttempt(results, "secure-01", [1], true, "2026-07-20T01:00:00.000Z");
  const record = results["secure-01"];
  assert.equal(record.ok, true);
  assert.deepEqual(plain(record.attempts.map(attempt => attempt.ok)), [false, true]);
  assert.equal(learning.questionStats(record).wrong, 1);
  assert.equal(learning.questionStats(record).correct, 1);
});

test("累積履歴から弱点を集計し補強問題を作れる", () => {
  let results = learning.normalizeResults({});
  results = learning.recordAttempt(results, "secure-01", [0], false, "2026-07-20T00:00:00.000Z");
  const summary = plain(learning.buildWeaknessSummary(questions, results));
  assert.ok(summary.some(topic => topic.id === "iam" && topic.wrong >= 1));
  const reinforcement = plain(learning.buildReinforcementSet(questions, results, 20));
  assert.equal(reinforcement[0], "secure-01");
  assert.ok(reinforcement.length > 1);
});

test("標準UIの各学習モードを利用できる", () => {
  for (const mode of ["exam", "all", "new", "unanswered", "wrong", "weakness"]) {
    assert.match(indexHtml, new RegExp(`data-mode="${mode}"`));
  }
  assert.match(indexHtml, /buildReinforcementSet/);
  assert.match(indexHtml, /buildWeaknessSummary/);
  assert.match(indexHtml, /data-domain="secure"/);
});

test("選択肢に露骨な誤答ヒントを入れない", () => {
  const banned = [/だけ/, /のみ/, /常に/, /絶対/, /全て/, /すべて/, /必ず/, /root user/i, /root access key/i, /public write/i, /IAM認可を省略/, /Lambdaタイムアウトを24時間/];
  for (const question of questions) {
    for (const choice of question.c) {
      for (const pattern of banned) assert.doesNotMatch(choice, pattern, `${question.id}: 露骨な誤答ヒント「${choice}」`);
    }
  }
});

test("READMEは利用者向けの入口に限定する", () => {
  assert.match(readme, /105問/);
  assert.match(readme, /Secure 19 \/ Resilient 17 \/ Performance 16 \/ Cost 13/);
  assert.match(readme, /01-start-here\.md/);
  assert.match(readme, /弱点補強/);
  assert.match(readme, /頻出用語の説明/);
  assert.match(readme, /重複・類似/);
  assert.match(readme, /aws-saa-c03-study\.misaka310\.chatgpt\.site/);
  assert.doesNotMatch(readme, /ASCII|単語境界|localStorage|SAA_GLOSSARY_BOUNDARY|CHATGPT_SITES_DEPLOY_SCRIPT|build-sites\.mjs/);
  assert.doesNotMatch(readme, /00-plan|05a-|05b-|09-mock-results|659\/1000|2026年8月14日/);
});

test("START.batからリポジトリ相対パスでクイズを起動できる", () => {
  assert.match(launcher, /%~dp0quiz\\index\.html/i);
  assert.match(launcher, /if not exist "%QUIZ_FILE%"/i);
  assert.match(launcher, /start "" "%QUIZ_FILE%"/i);
  assert.doesNotMatch(launcher, /C:\\00_dev/i);
});

test("4分野の日本語画像が新しい章へ組み込まれている", () => {
  const assets = [
    ["03-secure-architectures.md", "images/domain-secure-ja.png"],
    ["04-resilient-architectures.md", "images/domain-resilient-ja.png"],
    ["05-high-performing-architectures.md", "images/domain-performance-ja.png"],
    ["06-cost-optimized-architectures.md", "images/domain-cost-ja.png"],
  ];
  for (const [docName, imagePath] of assets) {
    const doc = fs.readFileSync(new URL(docName, projectRoot), "utf8");
    const image = fs.readFileSync(new URL(imagePath, projectRoot));
    assert.ok(doc.includes(imagePath), `${docName}: ${imagePath} の参照がない`);
    assert.deepEqual([...image.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], `${imagePath}: PNGではない`);
  }
});
