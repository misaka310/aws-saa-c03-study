# Repository instructions

## 仕様と公開文書

- 利用者向けの入口と学習方針は `README.md`。
- 構成の責務は `docs/ARCHITECTURE.md`、品質基準は `docs/QUALITY.md`、変更手順は `CONTRIBUTING.md`。
- 仕様や利用者向け挙動を変える場合は、実装・README・関連文書・検証を同じ変更で整合させる。

## Repository boundaries

- このリポジトリの責務はSAA-C03の日本語教材、105問演習、65問模試、弱点復習、ローカル学習状態の提供。
- AWS仕様や試験情報はAWS公式資料を優先し、外部教材は補助参照として扱う。
- 特定受験者の予定日、模試結果、個人学習履歴を公開教材へ入れない。
- 公開問題・外部教材・第三者画像を出典不明のまま複製しない。
- 個人PCの絶対パス、credential、token、Cookie、個人専用の運用メモを公開リポジトリへ残さない。
- デプロイ固有ツールは引数または環境変数から与え、ローカル検証をデプロイ環境へ依存させない。

## Verification

- 通常の完了確認は次を使用する。
  - `node scripts/build-sites.mjs`
  - `node --test quiz/test_quiz.mjs quiz/test_backup.mjs scripts/test-sites.mjs scripts/test-public-ux.mjs`
- build/test成功だけでなく、教材・問題・公開導線・文書が一致していることを確認する。
- 公開品質を変更した場合は、端末固有情報や個人履歴が再混入していないこともテストで固定する。
