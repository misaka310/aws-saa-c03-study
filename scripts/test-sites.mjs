import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const client = path.join(root, 'dist', 'client');
const content = JSON.parse(fs.readFileSync(path.join(client, 'content.json'), 'utf8'));
const indexHtml = fs.readFileSync(path.join(client, 'index.html'), 'utf8');
const portalApp = fs.readFileSync(path.join(root, 'sites', 'portal', 'app.js'), 'utf8');
const quizHtml = fs.readFileSync(path.join(client, 'quiz', 'index.html'), 'utf8');
const sourceQuestions = fs.readFileSync(path.join(root, 'quiz', 'questions.js'), 'utf8');
const builtQuestions = fs.readFileSync(path.join(client, 'quiz', 'questions.js'), 'utf8');
const sourceGlossary = fs.readFileSync(path.join(root, 'quiz', 'glossary.js'), 'utf8');
const builtGlossary = fs.readFileSync(path.join(client, 'quiz', 'glossary.js'), 'utf8');
const styles = fs.readFileSync(path.join(client, 'styles.css'), 'utf8');

const expectedLearnerDocs = [
  '01-start-here',
  '02-service-selection',
  '03-secure-architectures',
  '04-resilient-architectures',
  '05-high-performing-architectures',
  '06-cost-optimized-architectures',
  '07-exam-strategy',
  '08-final-review',
  '09-visual-review',
  'references',
];

const removedLearnerFiles = [
  '00-plan.md',
  '01-secure-architectures.md',
  '02-resilient-architectures.md',
  '03-performance.md',
  '04-cost-optimized-architectures.md',
  '05-service-selection.md',
  '05a-compute-storage.md',
  '05b-db-integration-network-cost.md',
  '06-exam-traps.md',
  '07-final-checklist.md',
  '08-practice-strategy.md',
  '09-mock-results.md',
  '10-cantrill-visual-review.md',
  '11-mock2-mistake-visual-review.md',
  '12-mock3-mistake-visual-review.md',
  '12-mock3-mistake-visual-review.html',
  'INDEX.md',
];

const privateQuestionMarkers = /SAA_LEGACY_PERSONALIZED_DRILLS|historical mock results|kind:\s*["']foundation["']|source:\s*["'][^"']*(?:mock|result)[^"']*["']/i;

test('公開教材は01から09の学習順とreferencesだけを収録する', () => {
  assert.deepEqual(content.documents.map((doc) => doc.id), expectedLearnerDocs);
  for (const doc of content.documents) {
    assert.match(doc.html, /<(h1|h2|p|ul|ol|table|pre)\b/);
    assert.doesNotMatch(doc.html, /^#\s/m);
  }
});

test('ポータルは学習の一本道を最初に示す', () => {
  const orderedCards = [
    '<strong>1. はじめる</strong>',
    '<strong>2. サービスを選び分ける</strong>',
    '<strong>3. 4分野を学ぶ</strong>',
    '<strong>4. 問題で判断力を付ける</strong>',
    '<strong>5. 弱点を補強する</strong>',
    '<strong>6. 最終確認</strong>',
  ];
  let previous = -1;
  for (const card of orderedCards) {
    const current = indexHtml.indexOf(card);
    assert.ok(current > previous, `${card}: 学習順が崩れている`);
    previous = current;
  }
  assert.match(portalApp, /: '01-start-here'\);/);
  assert.match(indexHtml, /\.\/quiz\/\?mode=exam/);
  assert.match(indexHtml, /\.\/quiz\/\?mode=all/);
  assert.match(indexHtml, /\.\/quiz\/\?mode=weakness/);
  assert.match(quizHtml, /AWS SAA 学習ポータル/);
});

test('公開文書とSitesに個人履歴や内部実装説明を出さない', () => {
  const publicText = indexHtml + JSON.stringify(content);
  assert.doesNotMatch(publicText, /受験予定日|模擬試験結果|特定受験者|本人限定/);
  assert.doesNotMatch(publicText, /ASCII|単語境界|SAA_GLOSSARY_BOUNDARY|saa-c03-study-results-v2|saa-c03-study-state-v3/);
  assert.doesNotMatch(publicText, /00-plan|05a-|05b-|06-exam-traps|07-final-checklist|08-practice-strategy|10-cantrill-visual-review/);
});

test('旧番号文書と個人模試素材をリポジトリから除去する', () => {
  for (const file of removedLearnerFiles) {
    assert.ok(!fs.existsSync(path.join(root, file)), `${file}: 旧文書が残っている`);
  }
  const sourceImages = fs.readdirSync(path.join(root, 'images'));
  assert.ok(sourceImages.every((file) => !/^mock[23]-/i.test(file)), '個人模試由来画像が残っている');
});

test('個人学習由来の固定問題データをソースにもSites成果物にも残さない', () => {
  assert.doesNotMatch(sourceQuestions, privateQuestionMarkers);
  assert.doesNotMatch(builtQuestions, privateQuestionMarkers);
  assert.ok(content.images.every((image) => !/^mock[23]-/i.test(image.file)));
  const builtImages = fs.readdirSync(path.join(client, 'images'));
  assert.ok(builtImages.every((file) => !/^mock[23]-/i.test(file)));
});

test('一般向け図解教材はCantrill外部画像URLを維持する', () => {
  const visualReview = content.documents.find((doc) => doc.id === '09-visual-review');
  assert.ok(visualReview);
  assert.match(visualReview.html, /raw\.githubusercontent\.com\/acantril\/aws-sa-associate-saac03/);
});

test('固定試験日を持たずバックアップ復元導線を維持する', () => {
  assert.doesNotMatch(indexHtml + quizHtml + JSON.stringify(content), /受験予定日|Date\.UTC\(\d{4}/);
  assert.match(quizHtml, /exportBackupBtn/);
  assert.match(quizHtml, /importBackupInput/);
});

test('スマホ幅では一列化し画像と表が固定幅で飛び出さない', () => {
  assert.match(styles, /@media\(max-width:560px\)/);
  assert.match(styles, /grid-template-columns:1fr/);
  assert.match(styles, /max-width:100%/);
  assert.match(styles, /overflow-x:auto/);
});

test('Sites配布物は静的クライアントと最小Workerだけで構成される', () => {
  assert.ok(fs.existsSync(path.join(root, 'dist', '.openai', 'hosting.json')));
  assert.ok(fs.existsSync(path.join(root, 'dist', 'server', 'index.js')));
  assert.ok(fs.existsSync(path.join(root, 'dist', 'server', 'wrangler.json')));
  assert.ok(fs.existsSync(path.join(client, 'quiz', 'questions.js')));
  assert.equal(builtGlossary, sourceGlossary);
  assert.match(quizHtml, /<script src="\.\/glossary\.js"><\/script>/);
  assert.match(builtGlossary, /SAA_GLOSSARY_BOUNDARY/);
});

test('検証と補助教材の手順は個人PCの絶対パスに依存しない', () => {
  const updateScript = fs.readFileSync(path.join(root, 'scripts', 'update-site.ps1'), 'utf8');
  const cantrillPlan = fs.readFileSync(path.join(root, 'docs', 'cantrill-integration-plan.md'), 'utf8');
  assert.doesNotMatch(updateScript + cantrillPlan, /C:\\00_dev/i);
  assert.match(updateScript, /CHATGPT_SITES_DEPLOY_SCRIPT/);
  assert.match(updateScript, /VerifyOnly/);
});
