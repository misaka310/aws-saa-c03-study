from pathlib import Path
import re

root = Path('.')
site = 'https://aws-saa-c03-study.misaka310.chatgpt.site'

readme = f'''# AWS SAA-C03 Study

AWS Certified Solutions Architect - Associate（SAA-C03）を日本語で学ぶための教材・問題演習です。**まずは公開サイトを開けば、教材・105問練習・65問模試・弱点補強をブラウザだけで使えます。**

## ▶ 公開サイトを開く

### [AWS SAA-C03 Study Site →]({site})

- [教材から始める]({site}/?doc=01-start-here)
- [105問の問題演習を始める]({site}/quiz/?mode=all)
- [65問模試を始める]({site}/quiz/?mode=exam)
- [弱点補強を開く]({site}/quiz/?mode=weakness)

## この教材でできること

- 標準問題バンク: **105問**
- 65問模試: **Secure 19 / Resilient 17 / Performance 16 / Cost 13**
- 全105問練習・分野別練習・未回答だけ・間違いだけ
- 回答履歴からの弱点補強
- 正解理由と、各選択肢を外す理由の確認
- 頻出用語の説明
- 学習結果のJSON書き出し・復元

問題はサービス名を暗記するのではなく、**問題文の要件から正解を選び、他の選択肢を外せるようになること**を目的にしています。

## 学習順

1. [01 はじめに](./01-start-here.md) — 全体の進め方
2. [02 サービス選択](./02-service-selection.md) — 似たAWSサービスの使い分け
3. [03 Secure Architectures](./03-secure-architectures.md)
4. [04 Resilient Architectures](./04-resilient-architectures.md)
5. [05 High-Performing Architectures](./05-high-performing-architectures.md)
6. [06 Cost-Optimized Architectures](./06-cost-optimized-architectures.md)
7. [07 試験戦略](./07-exam-strategy.md) — 問題文の読み方と復習方法
8. [08 最終確認](./08-final-review.md)
9. [09 図解復習](./09-visual-review.md)

## GitHubで読む・ローカルで使う

教材本文は上の01〜09からそのまま読めます。クローン後は追加パッケージ不要で、Windowsでは `START.bat`、それ以外では `quiz/index.html` をブラウザで開いて問題演習を利用できます。

## 教材の方針

- 固定の受験日や特定の利用者の模試結果に依存しません。
- AWSサービスは「何ができるか」だけでなく「似たサービスと何が違うか」を重視します。
- 変更され得るAWS仕様は公式資料を優先します。
- 問題の正解だけでなく、誤答選択肢が要件に合わない理由も確認します。
- 問題追加時は既存105問との重複・類似も確認します。

公式資料と補助教材は [references.md](./references.md) にまとめています。

## 利用上の注意

> **非公式教材です。** このプロジェクトは独立して作成されたもので、Amazon Web Services, Inc.（AWS）その他の第三者と提携・承認・後援関係にはありません。AWSおよび各サービス名・商標、外部参照先の名称・画像・教材は、それぞれの権利者と利用条件に従います。

## ライセンス

このリポジトリで独自に作成したコードと文書は [MIT License](./LICENSE) で提供します。外部リンク先や第三者に帰属する名称・商標・画像・教材は、このライセンスの対象外です。
'''
(root / 'README.md').write_text(readme, encoding='utf-8')

portal_path = root / 'sites/portal/index.html'
portal = portal_path.read_text(encoding='utf-8')
portal = re.sub(r'<script>\(function\(\)\{function c\(\).*?</script>', '', portal, flags=re.S)
old_header = '<div><p class="eyebrow">AWS SAA-C03</p><h1>AWS SAA-C03 学習ポータル</h1><p>基礎整理から問題演習、弱点補強、最終確認まで順番に進められます。</p></div>'
new_header = '<div class="hero-copy"><p class="eyebrow">AWS SAA-C03</p><h1>AWS SAA-C03 学習ポータル</h1><p>基礎整理から問題演習、弱点補強、最終確認まで順番に進められます。</p><div class="hero-actions"><a class="hero-primary" href="./quiz/?mode=all">問題演習を始める</a><a class="hero-secondary" href="?doc=01-start-here">教材から始める</a></div></div>'
if old_header not in portal:
    raise SystemExit('portal header pattern not found')
portal = portal.replace(old_header, new_header, 1)
footer = '<footer class="site-footer"><strong>非公式教材</strong><span>このサイトはAWSその他の第三者と提携・承認・後援関係にありません。</span><a href="https://github.com/misaka310/saa-c03-study">GitHub repository</a></footer>'
if 'class="site-footer"' not in portal:
    portal = portal.replace('</main>', '</main>\n' + footer, 1)
portal_path.write_text(portal, encoding='utf-8')

styles_path = root / 'sites/portal/styles.css'
styles = styles_path.read_text(encoding='utf-8')
addition = '\n.hero-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}.hero-actions a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 16px;border-radius:999px;font-weight:900;text-decoration:none}.hero-primary{background:#fff;color:#1d5225}.hero-secondary{border:1px solid rgba(255,255,255,.65);background:rgba(255,255,255,.08);color:#fff}.hero-actions a:hover{transform:translateY(-1px)}.site-footer{display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap;padding:24px clamp(16px,4vw,56px);border-top:1px solid var(--line);background:#fff;color:var(--muted);font-size:.86rem}.site-footer strong{color:var(--ink)}.site-footer a{color:var(--green);font-weight:800}\n'
if '.hero-actions{' not in styles:
    styles += addition
styles_path.write_text(styles, encoding='utf-8')

quiz_path = root / 'quiz/index.html'
quiz = quiz_path.read_text(encoding='utf-8')
quiz = re.sub(r'<script>\(function\(\)\{function c\(\).*?</script>', '', quiz, flags=re.S)
old_modes = '    <button class="nav-button active" data-mode="exam">65問模試</button>\n    <button class="nav-button" data-mode="all">全問題</button>'
new_modes = '    <button class="nav-button active" data-mode="all">全問題</button>\n    <button class="nav-button" data-mode="exam">65問模試</button>'
if old_modes not in quiz:
    raise SystemExit('quiz mode pattern not found')
quiz = quiz.replace(old_modes, new_modes, 1)
quiz = quiz.replace('<div class="orange-title" id="quizTitle">65問模試</div>', '<div class="orange-title" id="quizTitle">全問題</div>', 1)
quiz = quiz.replace('<span class="pill" id="domainPill">Exam</span>', '<span class="pill" id="domainPill">Practice</span>', 1)
quiz = quiz.replace('<span class="pill" id="counterPill">1 / 65</span>', '<span class="pill" id="counterPill">1 / 105</span>', 1)
quiz = quiz.replace('<span class="pill" id="timerPill">130:00</span>', '<span class="pill" id="timerPill">練習</span>', 1)
quiz = quiz.replace('let state = { mode: "exam", order: [], index: 0, domain: null, start: Date.now(), duration: 130 * 60 * 1000 };', 'let state = { mode: "all", order: [], index: 0, domain: null, start: Date.now(), duration: 130 * 60 * 1000 };', 1)
quiz = quiz.replace('      setMode("exam");\n    }\n    function render()', '      setMode("all");\n    }\n    function render()', 1)
quiz = quiz.replace('resetBtn.onclick = () => { if (confirm("成績をリセットしますか？")) { results = {}; localStorage.removeItem(storeKey); localStorage.removeItem(stateKey); setMode("exam"); } };', 'resetBtn.onclick = () => { if (confirm("成績をリセットしますか？")) { results = {}; localStorage.removeItem(storeKey); localStorage.removeItem(stateKey); setMode("all"); } };', 1)
quiz_path.write_text(quiz, encoding='utf-8')

update_path = root / 'scripts/update-site.ps1'
update = update_path.read_text(encoding='utf-8')
update = update.replace('"scripts/test-sites.mjs") -Label "Repository verification"', '"scripts/test-sites.mjs", "scripts/test-public-ux.mjs") -Label "Repository verification"')
update = update.replace('-Label "Private Site deployment"', '-Label "Site deployment"')
update_path.write_text(update, encoding='utf-8')
