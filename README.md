# AWS SAA-C03 Study

[![Repository validation](https://github.com/misaka310/aws-saa-c03-study/actions/workflows/quiz-validation.yml/badge.svg)](https://github.com/misaka310/aws-saa-c03-study/actions/workflows/quiz-validation.yml)
![Node.js](https://img.shields.io/badge/Node.js-22%2B-339933?logo=nodedotjs&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

AWS Certified Solutions Architect - Associate（SAA-C03）を日本語で学ぶための教材・問題演習です。**まずは公開サイトを開けば、教材・105問練習・65問模試・弱点補強をブラウザだけで使えます。**

## ▶ 公開サイトを開く

### [AWS SAA-C03 Study Site →](https://aws-saa-c03-study.misaka310.chatgpt.site)

- [教材から始める](https://aws-saa-c03-study.misaka310.chatgpt.site/?doc=01-start-here)
- [105問の問題演習を始める](https://aws-saa-c03-study.misaka310.chatgpt.site/quiz/?mode=all)
- [65問模試を始める](https://aws-saa-c03-study.misaka310.chatgpt.site/quiz/?mode=exam)
- [弱点補強を開く](https://aws-saa-c03-study.misaka310.chatgpt.site/quiz/?mode=weakness)

## プロジェクトの特徴

- **要件からサービスを選び分ける学習** — サービス名の暗記より、問題文の条件から候補を絞ることを重視します。
- **105問の独自問題** — 4ドメインを横断して練習し、65問模試にも切り替えられます。
- **誤答理由まで確認** — 正解理由だけでなく、他の選択肢を外す理由も学べます。
- **弱点復習** — 回答履歴から未回答・誤答・弱点優先の練習セットを作ります。
- **local-first** — 学習結果はブラウザへ保存し、JSONで書き出し・復元できます。
- **公式資料を優先** — AWS仕様や試験情報はAWS公式資料を基準にし、外部補助教材は補助として扱います。
- **静的構成と自動検証** — Node.jsだけで公開サイトをbuildし、問題データ・公開UX・配布物をCIで検証します。

## この教材でできること

- 標準問題バンク: **105問**
- 65問模試: **Secure 19 / Resilient 17 / Performance 16 / Cost 13**
- 全105問練習・分野別練習・未回答だけ・間違いだけ
- 回答履歴からの弱点補強
- 正解理由と、各選択肢を外す理由の確認
- 頻出用語の説明
- 学習結果のJSON書き出し・復元

問題はサービス名を暗記するのではなく、**問題文の要件から正解を選び、他の選択肢を外せるようになること**を目的にしています。

## 技術構成

| 領域 | 構成 |
| --- | --- |
| 教材 | Markdown 01〜09 + references |
| 問題演習 | HTML / CSS / Vanilla JavaScript |
| Build | Node.js ESM scripts |
| 学習状態 | Web Storage (`localStorage`) |
| Tests | Node.js built-in test runner |
| CI | GitHub Actions |
| Hosting | 静的クライアント + 最小Worker |

詳しい構成は [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)、品質基準は [docs/QUALITY.md](./docs/QUALITY.md) を参照してください。

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

教材本文は上の01〜09からそのまま読めます。ローカルの学習ポータルはNode.js 22以上だけで起動できます。

```bash
git clone https://github.com/misaka310/aws-saa-c03-study.git
cd aws-saa-c03-study
node scripts/build-sites.mjs
node scripts/serve-local.mjs
```

Windowsでは `START.bat` から同じbuildとローカルサーバーを起動できます。問題演習だけなら `quiz/index.html` を直接開くこともできます。

## 品質確認

公開前の基準は、CIと同じ次の2段階です。

```bash
node scripts/build-sites.mjs
node --test quiz/test_quiz.mjs quiz/test_backup.mjs scripts/test-sites.mjs scripts/test-public-ux.mjs
```

問題数・模試比率・バックアップ・公開文書・配布物・主要UXを自動検査します。詳細は [docs/QUALITY.md](./docs/QUALITY.md) にまとめています。

## リポジトリ構成

- `01-start-here.md` 〜 `09-visual-review.md` — 学習教材
- `references.md` — AWS公式資料と補助資料
- `quiz/` — 105問の問題演習・学習状態・バックアップ
- `sites/portal/` — 公開ポータルUI
- `scripts/build-sites.mjs` — 静的配布物のbuild
- `scripts/test-sites.mjs` / `scripts/test-public-ux.mjs` — 公開品質テスト
- `docs/ARCHITECTURE.md` — 構成と責務
- `docs/QUALITY.md` — 品質基準
- `CONTRIBUTING.md` — 変更・検証ルール

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
