# 07 試験戦略

SAA-C03は、サービス名を知っているだけではなく、**問題文の要件・制約・優先順位から最適な選択肢を決める**試験です。

## 1問を解く順番

1. 何の分野を問われているか整理する。
2. 問題文の要件と制約を拾う。
3. 条件に合わない選択肢を先に外す。
4. 残った候補を、運用負荷・コスト・可用性・性能の優先順位で比較する。

## 重要な条件語

| 問題文の表現 | 考えること |
|---|---|
| least operational overhead | managed / serverlessで運用を減らせるか |
| most cost-effective | 過剰な常時稼働・Multi-Region・専有構成ではないか |
| highly available | Multi-AZ、ELB、Auto Scaling、フェイルオーバー |
| low latency globally | CloudFront、Global Accelerator、Route 53などの役割を比較 |
| decouple | SQS、SNS、EventBridgeなどで結合を弱められるか |
| real-time streaming | Kinesisなどのストリーミングサービス |
| private access | VPC Endpoint / PrivateLinkなどを検討 |
| long-term archival | S3 Glacier系と取り出し要件を確認 |

条件語だけで即決せず、問題文全体の要件と合わせて判断します。

## 似た選択肢を外す

本番の誤答は、完全に無関係とは限りません。**一部の要件は満たすが、最重要条件に合わない**選択肢を見抜くことが重要です。

例:

- RDS Read Replicaは読み取り性能には有効だが、AZ障害時の自動フェイルオーバーが主目的ならMulti-AZを優先する。
- Active-Activeは強力だが、低コストが最優先なら過剰な場合がある。
- NAT Gatewayはprivate subnetから外部へ出られるが、S3 / DynamoDBだけが宛先ならVPC Endpointの方が要件に合う場合がある。
- Access keyでも認証はできるが、長期認証情報を避ける要件ならIAM roleなどを検討する。

## 65問模試の使い方

1. 最初から最後まで通して解く。
2. 迷った問題も一度回答し、後で見直す。
3. 終了後は点数だけでなく、誤答した論点を分類する。
4. 「間違いだけ」で再挑戦する。
5. 同じ論点の誤答が続く場合は「弱点補強」から関連問題へ広げる。

模試は**受験可否を一つの点数で決めるものではなく、どこで判断を誤るかを見つけるため**に使います。

## 復習するときに見る4点

正解した問題でも、次を説明できなければ教材へ戻ります。

- なぜ正解なのか。
- なぜ最も迷った誤答は違うのか。
- 問題文のどの条件が決め手だったのか。
- 条件が変わったら、どのサービスが候補になるのか。

## 弱点ごとの戻り先

| 弱点 | 戻る教材 |
|---|---|
| IAM / KMS / Security Group / NACL | [03 Secure](./03-secure-architectures.md) |
| Multi-AZ / DR / SQS | [04 Resilient](./04-resilient-architectures.md) |
| Storage / Database / Global delivery | [05 High-Performing](./05-high-performing-architectures.md) |
| S3階層 / 購入オプション / NAT料金 | [06 Cost-Optimized](./06-cost-optimized-architectures.md) |
| 似たサービスを選び分けられない | [02 サービス選択](./02-service-selection.md) |

## 外部問題集の使い方

外部問題集は初見問題を増やすために使えます。ただし、解説をそのまま暗記せず、疑問がある仕様はAWS公式資料で確認します。

- 点数だけを追わない。
- 誤答をサービス名ではなく論点で分類する。
- 同じ問題を繰り返して答えを覚えるだけの学習にしない。
- 外部問題の採点とAWS公式仕様が食い違う場合は公式資料を優先する。

## 試験中

- 分からない問題に時間を使いすぎず、後で戻れるようにする。
- 複数選択は必要な選択数を確認する。
- 「最小運用」「最小コスト」「低レイテンシ」「高可用性」などの優先条件を最後まで確認する。
- 高機能な選択肢より、**必要条件を最も素直に満たす選択肢**を選ぶ。

仕上げは [08 最終確認](./08-final-review.md) を使います。
