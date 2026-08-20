# Adrian Cantrill SAA-C03 補助教材の取り込み方針

## 目的

Adrian Cantrill の公開 `aws-sa-associate-saac03` learning aids を、SAA-C03学習の補助図解として迷わず参照できるようにする。

## 公開教材での扱い

- 通常の学習入口はこのリポジトリと公開Sitesにする。
- Cantrill側のフォルダ番号を利用者にたどらせず、[09 図解復習](../09-visual-review.md) から論点別に案内する。
- 図には「何を確認するか」を日本語で添える。
- 第三者画像を大量に複製せず、公開されている元画像を参照する。
- MITライセンスと著作権表示を残す。
- AWSサービスの現行仕様や正答判断はAWS公式資料を優先する。

## 主な対象

SAA-C03で混同しやすい次の論点を優先する。

- IAM / Roles / SCP
- KMS / S3 Security
- Security Group / NACL / VPC
- GuardDuty / AWS Config / WAF
- Route 53 / CloudFront / Global Accelerator
- EBS / Instance Store / Placement Groups
- RDS / Aurora
- EFS / AWS Backup
- SQS / SNS / EventBridge
- VPC Endpoint / Peering / Transit Gateway
- Direct Connect / Site-to-Site VPN
- DynamoDB Global Tables

## 元リポジトリを手元で確認する場合

元画像や周辺資料まで確認したい場合だけ、任意の作業ディレクトリへcloneする。

```powershell
$CantrillRepo = Join-Path $HOME "src\aws-sa-associate-saac03"
git clone --filter=blob:none --sparse https://github.com/acantril/aws-sa-associate-saac03.git $CantrillRepo
```

学習リポジトリ自体は、このcloneの有無に依存しない。

## 注意点

Cantrillの図は理解を補う参照資料として扱う。サービス仕様、推奨構成、試験範囲が変わる可能性があるため、疑問がある場合は [references.md](../references.md) にあるAWS公式資料で確認する。

## 対象外

- 有料講座本体を取得・複製すること。
- SAA-C02教材を混在させること。
- Cantrillリポジトリ全体をこの学習リポジトリへコピーすること。
- Cantrillの図だけで正答判定を行うこと。
