# Contributing

変更時は、教材・問題・公開サイト・検証が同じ内容を示す状態を維持してください。

## 必要環境

- Node.js 22以上
- 追加npmパッケージは不要

## 変更前後の検証

```bash
node scripts/build-sites.mjs
node --test quiz/test_quiz.mjs quiz/test_backup.mjs scripts/test-sites.mjs scripts/test-public-ux.mjs
```

Windowsでは、デプロイせずbuildとtestだけ行う場合に次も利用できます。

```powershell
./scripts/update-site.ps1 -VerifyOnly
```

## コンテンツルール

- AWSサービス仕様や試験情報はAWS公式資料を優先します。
- 問題は独自作成とし、外部問題集や試験問題をそのまま転載しません。
- 正解理由だけでなく、誤答を外せる理由も維持します。
- 問題数、模試比率、学習状態の互換性を既存テストで守ります。
- 特定受験者の予定日・模試結果・個人学習履歴を公開教材へ入れません。
- 外部図解は権利・ライセンス・出典を確認し、元資料への参照を基本にします。

## 公開リポジトリとしてのルール

- 個人PCの絶対パス、credential、token、Cookie、個人専用の運用メモをコミットしません。
- デプロイ環境固有のツールは環境変数または明示引数から渡します。
- READMEは公開サイトが利用できない場合でも、第三者がローカルでbuild・testできる内容を保ちます。
- 一時生成物は `.gitignore` の対象にし、公開成果物の正本と混在させません。

## デプロイ

`scripts/update-site.ps1` のデプロイ機能は任意です。公開リポジトリだけで完結する検証は `-VerifyOnly` で実行できます。デプロイ用adapterや補助ツールの場所はリポジトリへ固定せず、引数または環境変数で指定してください。
