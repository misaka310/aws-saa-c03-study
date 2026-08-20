# 08 最終確認

受験前の仕上げでは、新しい知識を増やすより、**混同しやすい違いを短時間で確認する**ことを優先します。

## 即答できるか確認する

- IAM user / IAM role / IAM Identity Center / SCP の違い。
- Security Group / NACL の違い。
- Gateway VPC Endpoint / Interface VPC Endpoint の違い。
- RDS Multi-AZ / Read Replica の違い。
- RDS / Aurora / DynamoDB / ElastiCache / Redshift / Athena の違い。
- SQS / SNS / EventBridge / Step Functions / Kinesis の違い。
- S3 Standard / Intelligent-Tiering / IA / Glacier系の違い。
- EBS / EFS / S3 / FSx の違い。
- CloudFront / Global Accelerator / Route 53 の違い。
- VPC Peering / Transit Gateway / Direct Connect / Site-to-Site VPN の違い。
- KMS / Secrets Manager / Parameter Store の違い。
- On-Demand / Savings Plans / Reserved Instances / Spot の違い。

## 要件から反応する候補

| 要件 | 確認する候補 |
|---|---|
| 運用負荷を最小化 | managed service / serverless |
| 高可用性 | Multi-AZ / ELB / Auto Scaling / failover |
| リージョン障害 | Multi-Region構成とコスト |
| 読み取り負荷 | Read Replica / cache / CDN |
| 非同期化 | SQS |
| 複数へ通知 | SNS |
| イベントを振り分ける | EventBridge |
| 処理手順を管理 | Step Functions |
| リアルタイムストリーム | Kinesis |
| S3の機密データ検出 | Macie |
| 脅威検出 | GuardDuty |
| Web攻撃対策 | WAF |
| API操作履歴 | CloudTrail |

## 模試結果の見方

点数だけで受験準備の完了を決めず、次を確認します。

- 同じ論点を繰り返し間違えていないか。
- 正解した問題でも理由を説明できるか。
- 複数選択の選び忘れが多くないか。
- 時間不足で未回答が増えていないか。
- Secure / Resilient / Performance / Costのどこに誤答が偏っているか。

弱点がはっきりしている場合は、該当分野だけ戻ってからもう一度問題演習を行います。

## 最後に使うもの

1. [02 サービス選択](./02-service-selection.md) で迷いやすい組み合わせを確認する。
2. [07 試験戦略](./07-exam-strategy.md) で問題文の読み方を確認する。
3. 「間違いだけ」「弱点補強」で未解決の論点を確認する。
4. 図で整理したい論点だけ [09 図解復習](./09-visual-review.md) を見る。

## 試験中の確認

- 問われているのはSecurity / Resilience / Performance / Costのどれか。
- 「最も」「最小」「運用負荷」「コスト」「低レイテンシ」など優先順位を示す条件を見落としていないか。
- 複数選択の必要数を確認したか。
- 一部の条件だけを満たす選択肢を残していないか。
- 必要以上に複雑な構成を選んでいないか。

迷ったときは、サービス名を思い出すより**問題文の条件へ戻る**のが基本です。
