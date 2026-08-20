import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), 'utf8');

const readme = read('README.md');
const portal = read('sites', 'portal', 'index.html');
const quiz = read('quiz', 'index.html');
const updateSite = read('scripts', 'update-site.ps1');
const siteUrl = 'https://aws-saa-c03-study.misaka310.chatgpt.site';

test('READMEは公開サイトを最優先の入口として示す', () => {
  const siteIndex = readme.indexOf(siteUrl);
  const learningIndex = readme.indexOf('## 学習順');
  const noticeIndex = readme.indexOf('## 利用上の注意');
  assert.ok(siteIndex >= 0, '公開Site URLがない');
  assert.ok(siteIndex < learningIndex, '公開Siteが学習説明より後ろに埋もれている');
  assert.ok(noticeIndex > learningIndex, '免責・注意事項は主要導線より後ろに置く');
  assert.match(readme, /aws-saa-c03-study\.misaka310\.chatgpt\.site\/quiz\/\?mode=all/);
  assert.doesNotMatch(readme, /問題を解く[^\n]*\(\.\/quiz\/\)/);
});

test('公開ポータルはファーストビューから教材と問題演習へ進める', () => {
  assert.match(portal, /class="hero-actions"/);
  assert.match(portal, /href="\.\/quiz\/\?mode=all"/);
  assert.match(portal, /href="\?doc=01-start-here"/);
  assert.match(portal, /非公式教材/);
});

test('公開HTMLのソースに配信基盤の一時コードを混入させない', () => {
  assert.doesNotMatch(portal + quiz, /cdn-cgi|__CF\$cv\$params|challenge-platform/i);
});

test('初回の問題演習は全問題モードから始める', () => {
  assert.match(quiz, /let state = \{ mode: "all"/);
  assert.ok(quiz.indexOf('data-mode="all">全問題') < quiz.indexOf('data-mode="exam">65問模試'));
});

test('Site更新スクリプトは公開状態とCIの検証内容に整合する', () => {
  assert.doesNotMatch(updateSite, /Private Site deployment/);
  assert.match(updateSite, /Site deployment/);
  assert.match(updateSite, /scripts\/test-public-ux\.mjs/);
});
