# 09 図解復習

文章だけで混同しやすい論点を、図で整理するためのページです。最初から全部見るのではなく、**問題演習で迷ったテーマだけ確認する**使い方がおすすめです。

## このリポジトリの図解

### IAM policy評価

![IAM policy評価](./images/iam-policy-evaluation.jpg)

見るポイント: 明示Deny、権限上限、identity policy、resource policyの順に整理する。

### Security GroupとNACL

![Security Group と NACL](./images/sg-vs-nacl-ja.png)

見るポイント: 適用単位、ステートフル / ステートレス、Denyの有無。

### 3層VPC

![3層VPC構成](./images/three-tier-vpc.jpg)

見るポイント: 外部公開が必要な層と、private subnetへ置く層を分ける。

### RDS Multi-AZとRead Replica

![RDS Multi-AZ と Read Replica](./images/multi-az-vs-read-replica-ja.png)

見るポイント: 可用性か、読み取り性能か。

### DR戦略

![DR戦略比較](./images/dr-strategy.jpg)

見るポイント: RTO / RPOとコストのバランス。

### Storage

![Storage選択](./images/storage-selection.jpg)

見るポイント: オブジェクト、ブロック、共有ファイル、Windows / HPC要件。

### Database

![Database選択](./images/database-selection.jpg)

見るポイント: RDB、NoSQL、キャッシュ、分析、検索を分ける。

### Global Delivery

![CloudFront / Global Accelerator / Route 53](./images/global-delivery-selection-ja.png)

見るポイント: キャッシュ、通信経路最適化、DNSの違い。

### VPC Connectivity

![VPC 接続方式の選び方](./images/vpc-connectivity-selection-ja.png)

見るポイント: 1対1接続、ハブ接続、AWSサービスへのprivate接続、オンプレ接続。

### Cost

![Cost最適化の選択](./images/cost-optimization.jpg)

見るポイント: 購入オプション、S3階層、通信コスト、過剰構成。

## Adrian Cantrill の補助図解

Adrian Cantrill の公開 learning aids は、AWSサービス同士の関係を図で理解する補助教材として参照しています。本リポジトリは Adrian Cantrill 氏または同氏のプロジェクトと提携・承認・後援関係にはありません。外部画像は元リポジトリのURLを直接参照し、権利と利用条件は元リポジトリに従います。正答判断や最新仕様はAWS公式資料を優先します。

### IAM Roles

見るポイント: 長期アクセスキーではなく、一時的な権限を引き受ける仕組みとして理解する。

![Cantrill IAM Roles](https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/0600-IAM_ACCOUNTS_ORGS/00_LEARNINGAIDS/IAMRoles-1.png)

### Service Control Policies

見るポイント: SCPは権限を直接付与するのではなく、Organizations配下で許可できる範囲を制御する。

![Cantrill Service Control Policies](https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/0600-IAM_ACCOUNTS_ORGS/00_LEARNINGAIDS/ServiceControlPolicies-1.png)

### CloudFront

見るポイント: エッジでコンテンツを配信・キャッシュする役割を、Global Acceleratorと分ける。

![Cantrill CloudFront Architecture](https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/1700-GLOBAL_CONTENT_DELIVERY_AND_OPTIMIZATION/00_LEARNINGAIDS/CloudFrontArchitecture-1.png)

### Global Accelerator

見るポイント: TCP / UDPトラフィックをAWSグローバルネットワークへ乗せて最適化する。

![Cantrill Global Accelerator](https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/1700-GLOBAL_CONTENT_DELIVERY_AND_OPTIMIZATION/00_LEARNINGAIDS/GlobalAccelerator-1.png)

### RDS Architecture

見るポイント: RDSの構成を確認し、Multi-AZとRead Replicaの目的を混同しない。

![Cantrill RDS Architecture](https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/1300-RELATIONAL_DATABASE_SERVICE%28RDS%29/00_LEARNINGAIDS/RDSArch-1.png)

### Gateway Endpoint

見るポイント: S3 / DynamoDBへVPCからprivateに接続するとき、NAT Gatewayが本当に必要か確認する。

![Cantrill Gateway Endpoint](https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/1800-ADVANCED_VPC_NETWORKING/00_LEARNINGAIDS/GatewayEndpoints-1.png)

### Transit Gateway

見るポイント: 多数のVPCやVPN接続をhub-and-spokeで集約する。

![Cantrill Transit Gateway](https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/1900-HYBRID_ENVIRONMENTS_AND_MIGRATION/00_LEARNINGAIDS/TransitGateway-1.png)

### SQS

見るポイント: producerとconsumerを切り離し、キューを使って非同期処理する。

![Cantrill SQS](https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/1600-SERVERLESS_and_APPLICATION_SERVICES/00_LEARNINGAIDS/SQS-1.png)

## 図を見た後に確認すること

1. そのサービスを選ぶ決め手を説明できるか。
2. 似たサービスを1つ挙げ、違いを説明できるか。
3. Security / Resilience / Performance / Costのどの要件に関係するか説明できるか。

元リポジトリ: [acantril/aws-sa-associate-saac03](https://github.com/acantril/aws-sa-associate-saac03)

License: MIT License, Copyright (c) 2022 Adrian Cantrill.
