window.SAA_CHOICE_REASONS = {
  "new-20260718-secure-01": [
    "SCPはOUまたはアカウントへ適用する権限上限であり、IAM groupへ関連付けて作成roleの上限を固定するものではない。",
    "正解。Permissions Boundaryを作成roleへ必須指定し、変更・削除権限も制限すれば、委任先が得られる最大権限を固定できる。",
    "session policyは現在の一時セッションを制限するが、そのセッションから作成したroleへ自動継承される権限上限ではない。",
    "S3 bucket policyはS3リソースへのアクセスを制御するもので、IAMのCreateRoleや権限上限を制御できない。"
  ],
  "new-20260718-secure-02": [
    "Transit Gatewayでも重複CIDRを同じ経路表へ正しく経路設定できず、顧客VPC間のアドレス重複要件を解決できない。",
    "public NLBはインターネット公開を避けるという要件に反し、送信元制限を追加しても非公開接続にはならない。",
    "正解。PrivateLinkはNLB背後のサービスをInterface Endpoint経由で非公開提供でき、VPC間の経路共有やCIDR非重複を必要としない。",
    "Gateway VPC EndpointはS3とDynamoDB向けであり、任意のTCPアプリを顧客VPCへ転送する機能ではない。"
  ],
  "new-20260718-secure-03": [
    "GuardDutyとMacieは脅威や機密データを検出するサービスで、Webリクエストの遮断やDDoS専門支援を提供しない。",
    "NACLはL3/L4の粗い通信制御、CloudTrailはAPI監査であり、SQL injectionなどのL7攻撃や大規模DDoS対応には不足する。",
    "Inspectorは脆弱性評価、ACMは証明書管理であり、要求されたL7攻撃防御とDDoS時の専門支援・コスト保護を満たさない。",
    "正解。WAFがL7攻撃を制御し、Shield Advancedが高度なDDoS保護、専門支援、DDoS関連コスト保護を提供する。"
  ],
  "new-20260718-secure-04": [
    "正解。明示Denyはidentity policyやresource policyのAllowより優先され、SCPの権限上限を超えてPutObjectは実行できない。",
    "resource policyのAllowでも、SCPによる明示Denyや権限上限を上書きできない。",
    "identity policyとresource policyのAllowが揃っていても、評価経路に明示Denyがあれば最終結果は拒否になる。",
    "STSでroleを再取得しても、そのroleが属するアカウントやOUのSCP評価から外れることはない。"
  ],
  "new-20260718-secure-05": [
    "us-east-1の証明書が必要なのはCloudFront向けの特殊要件であり、東京リージョンのALBには使用できない。",
    "正解。ALBでHTTPSを終端するACM証明書は、対象ALBと同じ東京リージョンに配置する必要がある。",
    "Route 53 hosted zoneはグローバルなDNSリソースで、証明書のリージョンを決める基準にはならない。",
    "ALB listenerはACMまたは対応する証明書ストアの証明書を参照し、S3上の証明書ファイルを直接利用しない。"
  ],
  "new-20260718-secure-06": [
    "Secrets Managerは自動ローテーションが必要な秘密情報に強いが、今回はローテーション不要・低コスト・階層管理という要件に対して過剰である。",
    "AMIやUser Dataへ設定を埋め込むと更新、監査、アクセス制御が難しくなり、設定値を安全に一元管理する要件に合わない。",
    "正解。Parameter Storeは階層的な設定管理に対応し、SecureStringで暗号化が必要な値も保存できる。",
    "CloudTrail event historyはAWS API操作を監査する履歴であり、アプリ設定値の保存先ではない。"
  ],
  "new-20260718-resilient-01": [
    "Data Lifecycle Managerは主にEBS snapshotやAMIのライフサイクル管理で、EBS・RDS・EFSを組織横断で一元管理する要件を満たさない。",
    "StackSetsで設定を配布することはできるが、手動snapshot手順では統一されたbackup plan、保持期間、保管先の集中管理にならない。",
    "S3 Lifecycle policyはS3オブジェクトの階層移行・削除を管理するもので、EBS、RDS、EFSバックアップを直接管理できない。",
    "正解。AWS BackupとOrganizationsのbackup policyを使えば、複数サービスのbackup planを各アカウントへ統一適用できる。"
  ],
  "new-20260718-resilient-02": [
    "正解。Aurora Global Databaseは別リージョンへ低遅延で複製し、各地の読み取りとリージョン障害時の昇格に対応する。",
    "RDS Multi-AZは同一リージョン内のAZ障害対策であり、世界各地からの低レイテンシ読み取りやリージョンDRにはならない。",
    "ElastiCacheはキャッシュであり、Aurora障害時の永続的な書き込み先やクロスリージョンDBレプリカにはならない。",
    "S3 Cross-Region ReplicationはS3オブジェクトを複製する機能で、Auroraの内部データファイルを複製できない。"
  ],
  "new-20260718-resilient-03": [
    "Pilot Lightは中核リソースを常時維持するため、長いRPO/RTOを許容し平常時コストを最優先する要件にはBackup and Restoreより高コストになる。",
    "正解。RPO 12時間、RTO 24時間を許容できるため、平常時の常時稼働リソースが少ないBackup and Restoreが最も適する。",
    "Warm Standbyは縮小版の本番環境を常時動かすため復旧は速いが、今回の長いRTOに対して平常時コストが過剰になる。",
    "Multi-Region Active-Activeは復旧性能が最も高い一方で常時二重稼働となり、平常時コスト最優先の要件に反する。"
  ],
  "new-20260718-resilient-04": [
    "1つのSQS queueを競合受信するとmessageはどちらか一方のconsumerへ渡るため、請求処理と配送処理の両方へ同じイベントを配信できない。",
    "両処理を1つの同期taskへまとめると、一方の遅延や失敗がもう一方へ影響し、独立した再試行という要件を満たさない。",
    "正解。SNSから処理別SQS queueへfanoutすれば、両方が同じイベントを受け取り、backlog、retry、DLQを独立管理できる。",
    "同じKinesis consumer名やcheckpointを共有すると独立した処理状態にならず、処理別のqueueや再試行分離も得られない。"
  ],
  "new-20260718-resilient-05": [
    "Multi-AZ standbyにも論理的な誤更新が同期されるため、failoverしても事故前のデータへ戻らない。",
    "Read Replicaにも変更が複製される可能性があり、通常の読み取りendpointをそのまま更新用endpointとして事故前復旧に使えない。",
    "Route 53 health checkは接続先を切り替える機能であり、古いデータを保持したAZ別コピーを自動的に用意しない。",
    "正解。自動バックアップのPoint-in-Time Recoveryで事故直前を指定し、新しいDB instanceとして復元する。"
  ],
  "new-20260718-performance-01": [
    "正解。EKSはマネージドKubernetes control planeを提供し、Kubernetes API、Helm、operatorへの既存依存を維持できる。",
    "ECS on Fargateはコンテナ実行の運用負荷を下げられるが、Kubernetes API、Helm、operatorとの互換性を提供しない。",
    "Lambdaはイベント駆動の関数実行基盤で、Kubernetes control planeやoperatorを実行する移行先ではない。",
    "独自schedulerを構築すると運用負荷が増え、Kubernetes固有APIやHelmとの互換性も自動では得られない。"
  ],
  "new-20260718-performance-02": [
    "単一EC2はサーバー管理が必要で単一障害点にもなり、リクエスト単位の自動スケール要件を満たさない。",
    "正解。API GatewayがREST APIを公開し、Lambdaがリクエストに応じてサーバー管理なしで実行・スケールする。",
    "NLBはL4負荷分散、EBS Multi-Attachはブロックストレージ共有であり、REST APIのサーバーレス実行基盤にはならない。",
    "CloudFrontは配信高速化、RDS ProxyはDB接続管理であり、API処理本体を実行・自動スケールする構成ではない。"
  ],
  "new-20260718-performance-03": [
    "RedshiftはDWHとして構造化データの集計・SQL分析に向くが、ログの全文検索と検索ダッシュボードの第一候補ではない。",
    "Neptuneはentity間の関係を探索するグラフDBであり、ログ本文の全文検索や一般的なログダッシュボード用途ではない。",
    "正解。OpenSearchはログの取り込み、全文検索、フィールド絞り込み、検索結果の可視化に適する。",
    "EFSは共有ファイルストレージであり、ログを索引化して全文検索やダッシュボード表示を行う機能を持たない。"
  ],
  "new-20260718-performance-04": [
    "Timestreamは時系列データ向けで、口座や端末など多数entity間の関係経路を探索するグラフ用途には適さない。",
    "AuroraはリレーショナルDBとして利用できるが、多段の関係探索を主目的とする場合はグラフDBよりモデルとクエリが複雑になりやすい。",
    "AthenaはS3上のデータをSQL分析するサービスで、継続的な関係グラフと高速な経路探索を管理するDBではない。",
    "正解。NeptuneはグラフDBで、口座、端末、IP、取引の関係や経路をたどる不正検知に適する。"
  ],
  "new-20260718-performance-05": [
    "正解。Timestreamは時刻付きtelemetryの保存、時間範囲集計、保持期間やストレージ階層管理に特化した時系列DBである。",
    "Neptuneは関係性を扱うグラフDBであり、大量の時刻付き計測値を時間軸で集計・保持する主用途ではない。",
    "Cognitoはアプリ利用者の認証とID管理を行うサービスで、IoT telemetryの時系列保存先ではない。",
    "Storage GatewayはオンプレミスとAWSストレージを接続するサービスで、時系列クエリや保持期間管理を提供しない。"
  ],
  "new-20260718-cost-01": [
    "Dedicated Instanceは専有ハードウェア上で実行されるが、特定物理ホストのsocketやcoreを把握・制御するBYOL要件には不足する。",
    "正解。Dedicated Hostは物理ホスト単位で専有し、socketやcoreに紐づくライセンス管理へ対応しやすい。",
    "Savings Plansはcompute利用量への割引であり、専有物理ホストやsocket単位ライセンスという配置要件を満たさない。",
    "Spot Instanceは中断可能な余剰キャパシティの購入方法で、専有ホスト上のBYOL条件を保証しない。"
  ],
  "new-20260718-cost-02": [
    "S3 Standard-IAもミリ秒取得できるが、長期アーカイブで四半期に数回というアクセス頻度にはGlacier Instant Retrievalの方が要件に合う。",
    "Glacier Flexible Retrievalは復元に数分から数時間かかるため、要求時にミリ秒取得する要件を満たさない。",
    "正解。Glacier Instant Retrievalは低頻度アーカイブ向けでありながら、要求時にミリ秒単位で取得できる。",
    "Glacier Deep Archiveは最安クラスの長期保管向けだが、復元に長時間かかりミリ秒取得には対応しない。"
  ],
  "new-20260718-cost-03": [
    "Glacier Instant Retrievalは即時取得できるが、数分から数時間を許容する要件には性能と料金が過剰になりやすい。",
    "S3 Standardは頻繁なアクセス向けで、年に数回のバックアップ復元というアーカイブ用途ではコスト最適になりにくい。",
    "S3 One Zone-IAは単一AZの低頻度データ向けで、アーカイブ復元階層ではなく耐障害性もバックアップ用途で注意が必要である。",
    "正解。Glacier Flexible Retrievalは数分から数時間の復元オプションを持ち、Deep Archiveより速い復元要件に合う。"
  ],
  "new-20260718-cost-04": [
    "正解。AWS Budgetsは実績コストと予測コストの両方にしきい値を設定し、到達時に通知できる。",
    "Cost Explorerを月末に手動確認する方法では、80%到達時点の即時通知や月末予測超過の自動通知を満たさない。",
    "Compute Optimizerはリソースのrightsizing推奨を提供するが、予算額に対する実績・予測alertのサービスではない。",
    "Trusted Advisorのperformance checkは性能や設定の推奨であり、月次予算の実績・予測しきい値通知には使わない。"
  ]
};

Object.assign(window.SAA_CHOICE_REASONS, {
  "new-20260720-secure-01": [
    "正解。Access Analyzerはresource policyを論理分析し、組織を信頼ゾーンとして外部principalから到達可能なリソースを検出できる。",
    "CloudTrail Lakeは実際に発生したAPI操作の検索に向くが、未使用でも外部アクセスを許すresource policyを継続判定する機能ではない。",
    "MacieはS3オブジェクト内の機密データを分類するサービスであり、IAM roleやresource policyの外部共有を分析しない。",
    "AWS Config inventoryはリソース構成を記録できるが、policyを推論して組織外からの到達可能性を判定する専用機能ではない。"
  ],
  "new-20260720-secure-02": [
    "NACLはsubnet単位のstatelessな許可・拒否であり、複数subnetの送信通信を集中してdomainや高度なstateful ruleで検査する運用には向かない。",
    "正解。Network Firewallをrouteへ組み込み、managedなstateful・stateless rule groupで送信通信を集中検査できる。",
    "Gateway Load Balancerと仮想アプライアンスでも検査基盤は作れるが、自社で製品選定・更新・capacity管理が必要となり最小運用要件に劣る。",
    "AWS WAFはCloudFrontやALBなどへのWeb requestを検査するサービスで、private subnetからの任意の送信通信をWeb ACLで処理しない。"
  ],
  "new-20260720-secure-03": [
    "S3 Versioningは過去versionを保持するが、CloudTrailログの暗号学的な署名検証や欠落検出を提供しない。",
    "CloudWatch Logsのmetric filterはログ内容からmetricを生成する機能で、保存済みファイルの改変有無を証明しない。",
    "正解。log file integrity validationが署名付きdigest fileを配信し、ログの変更・削除を検証可能にする。",
    "AWS Config recorderはtrail設定の変更履歴を記録するが、S3へ配信済みの各ログファイル自体の完全性を検証しない。"
  ],
  "new-20260720-secure-04": [
    "定期Lambdaでも独自実装は可能だが、準拠評価・状態履歴・修復制御を自前で作る必要があり、Configの管理機能より運用負荷が高い。",
    "Security Hubはcontrol結果を集約できるが、確認して手動変更する構成では要求されたautomatic remediationを満たさない。",
    "CloudFormation drift detectionはstack定義との差分を検出する機能で、全volumeの継続的なpolicy準拠評価と自動修復には不足する。",
    "正解。Config ruleで暗号化準拠を評価し、Systems Manager Automation documentをremediation actionとして自動実行できる。"
  ],
  "new-20260720-secure-05": [
    "正解。CloudHSMはsingle-tenant HSMを提供し、PKCS#11対応アプリから利用しながら鍵素材とHSMユーザーを顧客側で管理できる。",
    "KMSのAWS managed keyは運用負荷が低い一方、専有HSMへの直接的なPKCS#11接続やHSMユーザー管理という要件を満たさない。",
    "Secrets Managerはsecret値の保存・取得・rotationを管理するサービスで、専有HSMやPKCS#11暗号処理基盤ではない。",
    "ACM Private CAはprivate certificateの発行・管理に向くが、アプリが汎用鍵をPKCS#11で扱う専有HSMを提供しない。"
  ],
  "new-20260720-secure-06": [
    "各アカウントの手動作成は既存・新規アカウント間で設定差異が生じやすく、中央適用と低運用負荷の要件を満たしにくい。",
    "正解。Firewall ManagerはOrganizationsのOUを対象にWAF policyを中央管理し、新規アカウントや対象resourceへ継続適用できる。",
    "Security Hub central configurationはsecurity standardやcontrol設定の中央管理に向くが、WAF Web ACL ruleを各ALBへ配布する機能ではない。",
    "StackSetsはresourceを配布できるが、配布後の独立運用では対象resourceの増減に追従するsecurity policy管理がFirewall Managerより複雑になる。"
  ],
  "new-20260720-resilient-01": [
    "visibility timeoutを長くしても失敗messageはsource queueへ戻り、正常messageと分離されず原因調査後の選択的再処理も難しい。",
    "consumerを増やすと処理能力は上がるが、処理不能messageの反復受信と隔離要件は解決しない。",
    "正解。DLQとredrive policyでmaxReceiveCount超過messageを隔離し、修正後にsource queueへredriveして再処理できる。",
    "FIFOへ変更しても処理不能messageは解消せず、単一message groupでは後続messageをさらに停滞させる可能性がある。"
  ],
  "new-20260720-resilient-02": [
    "CloudTrail LakeはAWS API eventの監査・query向けで、業務eventを元のEventBridge busへ再配信する保存機能ではない。",
    "SQS retentionはqueueへ届いたmessageを保持する設定で、既にEventBridge busを通過したeventを遡って再配信できない。",
    "Step Functions execution historyはworkflow実行履歴であり、EventBridge bus上の任意eventを期間指定で再投入する機能ではない。",
    "正解。EventBridge archiveに保存したeventを期間・pattern指定でsource busへreplayし、修正済みconsumerへ再配信できる。"
  ],
  "new-20260720-resilient-03": [
    "正解。DynamoDB global tablesはmulti-activeのcross-Region replicationを行い、各regionでlocalなread・writeを受け付ける。",
    "DAXはDynamoDB read cacheであり、region間のtable data複製や別regionでのwrite継続を提供しない。",
    "RDS Read ReplicaはDynamoDBのdata modelと互換性がなく、DynamoDB tableのmulti-active replicationには使えない。",
    "S3へexportしたsnapshotのCRRは継続的なDynamoDB更新をmulti-activeで複製せず、即時のread・write継続要件を満たさない。"
  ],
  "new-20260720-resilient-04": [
    "max_connectionsの増加はDB resource消費を増やし、Lambdaの接続stormやfailover後の接続再確立を効率化しない。",
    "正解。RDS Proxyがconnection poolを共有して急増を吸収し、DB failover時の接続経路回復も簡素化する。",
    "NAT Gatewayは外向きnetwork接続用であり、LambdaとRDS間のDB connection poolingやfailoverを扱わない。",
    "reader endpointはread分散用で、通常の更新処理を受け付ける接続poolやMulti-AZ failover仲介にはならない。"
  ],
  "new-20260720-resilient-05": [
    "日次backupはRPOがbackup間隔に依存し、server OSとdiskを継続複製して迅速にrecovery instanceを起動する要件に劣る。",
    "DataSyncはfile・object dataの移行や同期に向くが、server全体のblock-level replicationと復旧instance起動を提供しない。",
    "正解。Elastic Disaster Recoveryはsource serverのblockを継続複製し、AWS上でrecovery instanceをlaunchするDR workflowを提供する。",
    "Route 53 ARCはapplication recoveryのreadinessやrouting controlを支援するが、オンプレserver diskの継続複製を行わない。"
  ],
  "new-20260720-performance-01": [
    "spread placement groupはinstanceを異なるhardwareへ分散して相関障害を減らす配置で、node間通信を最短化する目的とは異なる。",
    "partition placement groupは大規模分散systemのrack障害分離に向くが、全nodeを近接配置して最低latencyを狙う方式ではない。",
    "複数AZ配置は可用性を高める一方、AZ間latencyが加わるため通信性能最優先のHPC要件に合わない。",
    "正解。cluster placement groupは対応instanceを単一AZ内で近接配置し、低latency・高throughputのnode間通信に適する。"
  ],
  "new-20260720-performance-02": [
    "正解。io2 Block Expressは高IOPS、低latency、一貫したperformanceが必要なmission-critical database workloadに向く。",
    "gp3は一般用途で価格性能に優れるが、非常に高いIOPSと最小latencyを最優先する要件ではio2 Block Expressが上位候補になる。",
    "st1は大容量のsequential throughputを重視するHDD volumeで、random I/O中心の高性能databaseには向かない。",
    "EFSは共有file systemであり、EC2 databaseへattachする高IOPS block volumeという要件とstorage interfaceが異なる。"
  ],
  "new-20260720-performance-03": [
    "CloudFrontは主にcontent配信とcacheに使い、世界各地からS3への直接upload経路をaccelerate endpointとして最適化する機能ではない。",
    "正解。S3 Transfer Accelerationはedge locationからAWS networkへ取り込み、遠距離のS3 uploadをaccelerate endpointで高速化する。",
    "DataSyncは拠点間の計画的な大量data移行・同期に向くが、各利用者のdirect uploadを小さな変更で高速化する用途には過剰である。",
    "Global Acceleratorは対応するALB・NLB・EC2などへのnetwork経路を最適化するが、S3 bucketを直接endpointには指定できない。"
  ],
  "new-20260720-performance-04": [
    "reserved concurrencyはfunctionの同時実行capacityを確保・制限するが、初期化済みexecution environmentを事前準備しない。",
    "timeoutやmemoryの変更で個々の実行特性は変わるが、idle environmentの保持やcold start回避を保証する設定ではない。",
    "正解。provisioned concurrencyはversionまたはaliasへ初期化済みenvironmentを事前確保し、startup latencyを予測可能にする。",
    "SQS long pollingはqueue受信のempty responseを減らす機能で、API Gatewayからの同期Lambda呼び出しのcold startを解決しない。"
  ],
  "new-20260720-performance-05": [
    "item sizeを増やすとwrite capacity消費が増えやすく、同じpartition key値への集中は解消しない。",
    "sort keyを追加しても同じ日付partition keyのitemは同じlogical partition keyへ集中し、hot keyの根本対策にならない。",
    "strongly consistent readはread整合性の設定で、write requestのpartition集中やthrottlingを分散しない。",
    "正解。高cardinalityのpartition keyやwrite shardingでrequestを複数keyへ分散し、hot partitionを避ける。"
  ],
  "new-20260720-cost-01": [
    "正解。Compute Savings PlansはEC2 family・size・OS・regionの変更に柔軟で、FargateやLambdaの対象compute利用にも適用できる。",
    "EC2 Instance Savings Plansは特定regionとinstance familyへのcommitで割引率は高めだが、family・region変更やFargate移行の柔軟性に劣る。",
    "Standard RIは指定したEC2属性へのcommitが中心で、Fargate利用へ割引を移す要件を満たさない。",
    "Capacity Reservationは特定AZのEC2 capacity確保であり、利用額commitによる横断的な料金割引を目的としない。"
  ],
  "new-20260720-cost-02": [
    "Budgetsは実績・予測値を固定thresholdと比較する通知に向くが、通常patternから外れた支出を機械学習で判定する機能ではない。",
    "正解。Cost Anomaly Detectionは機械学習で通常と異なるcost patternを検出し、monitorとalert subscriptionで通知できる。",
    "Cost Explorer reportは支出の可視化・分析に使えるが、開くだけでは異常patternを自動検出して通知しない。",
    "CloudWatch billing alarmは見積請求額のthreshold監視で、serviceやaccountの通常patternを学習したanomaly detectionではない。"
  ],
  "new-20260720-cost-03": [
    "S3 Inventoryはbucket内objectとmetadataの定期一覧であり、Organizations全体のusage・activity傾向や最適化dashboardを提供しない。",
    "Cost and Usage Reportは詳細な課金line itemを提供するが、S3のobject count、storage class、activityを専用dashboardで横断分析する用途には追加処理が必要である。",
    "正解。S3 Storage LensはOrganizations・account・bucket横断のusageとactivity metricsを集約し、cost optimizationの把握を支援する。",
    "Trusted Advisorは一般的な推奨を提示するが、S3専用のorganization-wide usage・activity dashboardと詳細metricsを置き換えない。"
  ],
  "new-20260720-cost-04": [
    "gp2はvolume sizeにbaseline performanceが連動するため、IOPS目的の容量増加では不要なstorage費用も増える。",
    "io2 Block Expressは最高性能が必要なworkload向けで、一般用途volumeを一律移行するとcost optimization要件に対して過剰になる。",
    "Snapshot Archiveはsnapshot保管費の削減策であり、稼働中volumeのtype・IOPS・throughput料金を改善しない。",
    "正解。gp3は容量とIOPS・throughputを独立設定でき、Elastic Volumesでgp2から変更して一般用途storageの費用を下げやすい。"
  ]
});

window.SAA_QUESTIONS.forEach(question => {
  const reasons = window.SAA_CHOICE_REASONS[question.id];
  if (reasons) question.r = reasons;
});

Object.assign(window.SAA_CHOICE_REASONS, {
  "foundation-20260803-secure-01": [
    "正解。MFA認証済みでないrequestを条件付きの明示Denyで拒否し、未使用sessionの操作を直接止める。",
    "AWS ConfigはMFA設定の準拠状態を評価・記録できるが、利用者の操作をrequest時点で拒否する認可policyではない。",
    "SCPはOU・accountの最大権限を制限する仕組みで、IAM userを作成して個別sessionのMFA状態を判定する機能ではない。",
    "CloudTrailはConsoleLoginなどのAPI eventを監査するサービスで、記録した時点ではMFA未使用操作を予防できない。"
  ],
  "foundation-20260803-secure-02": [
    "IAMUserChangePasswordは自分のpassword変更を許可するが、MFA deviceの作成・有効化・削除に必要な権限を含まない。",
    "正解。許可actionに加え、resource ARNやusername条件を利用者自身へ限定すると他のIAM userを操作できない。",
    "iam:*は権限が広すぎ、permission boundaryを付けても自分自身のpasswordとMFAに絞った最小権限にはならない。",
    "SCPはOU・account単位の権限上限であり、個別IAM userが操作できるresourceを本人ARNへ限定するpolicyではない。"
  ],
  "foundation-20260803-secure-03": [
    "EC2 key pairはinstanceへのSSH認証に使う鍵で、外部IdPからAWS roleを引き受けるfederation方式ではない。",
    "IAM access keyはIAM userなどへ発行する長期認証情報であり、IAM userを作成しないという条件に反する。",
    "正解。SAML 2.0 federationは外部IdPで認証し、STSの一時認証情報でIAM roleを引き受ける。",
    "S3 presigned URLは期限付きで特定S3操作を許可するURLで、AWS roleの引き受けや管理access認証には使わない。"
  ],
  "foundation-20260803-secure-04": [
    "Amazon CognitoはWeb・mobile app利用者のsignup、login、social identity連携に向くサービスである。",
    "Secrets ManagerはpasswordやAPI keyなどのsecret保存・rotationを管理し、Microsoft AD連携基盤は提供しない。",
    "IAM Access Analyzerはresource policyの外部共有や未使用accessを分析し、directory接続を仲介しない。",
    "正解。AWS Directory ServiceにはAD Connectorなど、オンプレミスMicrosoft ADとAWSを連携する機能が含まれる。"
  ],
  "foundation-20260803-secure-05": [
    "正解。AWS WAFはHTTP・HTTPS requestをL7で検査し、SQL injectionやXSSに対応するruleを適用できる。",
    "Shield Advancedは高度なDDoS保護を提供するが、SQL文字列やXSS patternをWeb request ruleで検査する主サービスではない。",
    "GuardDutyはlogを分析して脅威を検出するサービスで、ALBやCloudFrontのrequestをinlineで遮断しない。",
    "Firewall ManagerはOrganizations全体へWAFなどのpolicyを中央配布する管理サービスで、個々のrequest検査engineはWAFである。"
  ],
  "foundation-20260803-secure-06": [
    "AWS WAFはWeb applicationへのL7 requestをruleで制御するが、DDoS時の専門支援や関連cost protectionを提供しない。",
    "正解。Shield Advancedは高度なDDoS検知・緩和、専門支援、条件を満たすDDoS関連cost protectionを提供する。",
    "InspectorはEC2、ECR、Lambdaなどの脆弱性を評価するサービスで、DDoS trafficの緩和サービスではない。",
    "MacieはS3 object内の個人情報などを検出するサービスで、network DDoS保護や専門対応を提供しない。"
  ],
  "foundation-20260803-secure-07": [
    "S3 bucket policyはS3 bucketとobjectへのaccessを制御し、KMS key自体の管理者・利用者を定義しない。",
    "SCPはOrganizations配下accountの最大権限を制限するが、KMS keyへの利用許可をkey resourceへ付与しない。",
    "正解。KMS key policyはkey自体に付くresource policyで、管理権限と暗号化・復号利用権限の基礎を定義する。",
    "VPC endpoint policyはendpoint経由のAPI操作を制限するもので、KMS key resourceへのDecrypt権限を直接付与しない。"
  ],
  "foundation-20260803-secure-08": [
    "CloudWatch Metricsは数値指標の監視・alarmに使い、S3 request詳細をlog fileとして別bucketへ配信しない。",
    "AWS Config recorderはresource設定と変更履歴を記録するが、S3 object requestのaccess logを生成しない。",
    "CloudTrail Insightsは通常と異なるmanagement API activityを検出する機能で、S3 access log fileの配信機能ではない。",
    "正解。S3 Server Access Loggingは対象bucketへのrequest詳細を、指定したdelivery bucketへlog objectとして保存する。"
  ],
  "foundation-20260803-secure-09": [
    "正解。AWS Config ruleで暗号化設定を継続評価し、automatic remediationからSystems Manager Automationなどを実行できる。",
    "IAM policyはAPI権限、Access Analyzerは外部・未使用access分析であり、設定違反を検出して自動修復する組み合わせではない。",
    "CloudTrailは操作履歴、CloudWatch alarmはmetric通知に向くが、bucket設定の準拠評価と修復workflowを標準提供しない。",
    "SCPは権限上限、Cost Explorerは料金分析であり、既存bucketの暗号化状態を修復する機能を持たない。"
  ],
  "foundation-20260803-secure-10": [
    "監査人用IAM userは長期credentialの発行・保管・削除が必要となり、期間限定accessの管理負荷と漏えいriskが増える。",
    "正解。cross-account roleは監査人側accountをtrustし、STSの一時認証情報で期限付きread-only accessを提供できる。",
    "共有access keyは長期認証情報を複数者で扱う構成となり、保存先をSecrets Managerにしても共有自体のriskは残る。",
    "S3 presigned URLは特定object操作向けで、複数AWS serviceを閲覧するAWS console accessの代替にはならない。"
  ],
  "foundation-20260803-performance-01": [
    "EC2 Instance Storeはhostに付属する一時storageで、instance終了やhost障害後に別instanceへ永続volumeとして付け替えられない。",
    "EFSは複数instanceで共有するfile storageで、EC2のOS diskとしてattachするblock deviceとはinterfaceが異なる。",
    "正解。EBSはEC2から独立して保持されるblock volumeで、同一AZ内の別instanceへdetach・attachできる。",
    "S3はobject storageで、EC2へOS diskやblock deviceとして直接attachするサービスではない。"
  ],
  "foundation-20260803-performance-02": [
    "S3は大規模object storageだが、通常のPOSIX NFS file systemとして多数EC2へmountするサービスではない。",
    "EBS Multi-Attachは対応io volumeを同一AZの複数instanceへblock deviceとして接続する機能で、複数AZの自動拡張NFSではない。",
    "FSx for Windows File ServerはWindows SMB共有向けで、Linux/POSIX NFS workloadの第一候補ではない。",
    "正解。EFSはLinux系EC2から同時mountできるmanaged NFSで、保存量に応じて容量が自動的に伸縮する。"
  ],
  "foundation-20260803-performance-03": [
    "正解。Cluster Placement Groupは対応EC2を同一AZ内で近接配置し、低latency・高throughputのnode間通信に向く。",
    "Spread Placement Groupはinstanceを別hardwareへ分散して相関障害を減らすため、通信latency最小化とは目的が異なる。",
    "Partition Placement Groupは大規模分散systemを障害partitionへ分ける方式で、全nodeの近接配置を目的としない。",
    "Dedicated Hostは物理host専有やBYOL要件に使い、instance間network latencyを最小化するplacement groupではない。"
  ],
  "foundation-20260803-performance-04": [
    "Global AcceleratorはAnycast IPとAWS networkでTCP・UDP経路を最適化するが、Web contentをedge cacheするCDNではない。",
    "正解。CloudFrontはedge locationへcontentをcacheし、静的Webやcache可能なresponseを低latencyで配信するCDNである。",
    "Route 53はDNS routingとhealth checkを提供するが、content本体をedge locationへcacheして返さない。",
    "Direct ConnectはオンプレミスとAWS間の専用接続で、一般利用者向けWeb contentのedge配信サービスではない。"
  ],
  "foundation-20260803-resilient-01": [
    "Failover routingはprimaryのhealth failure時にsecondaryへ切り替えるactive-passive方式で、最低latency比較を主目的としない。",
    "Geolocation routingは利用者の国・大陸などの位置で管理者指定先へ送るため、network latency測定値で選択しない。",
    "正解。Latency-based routingは複数region endpointの中から、利用者へ低いnetwork latencyを提供する先へ案内する。",
    "Weighted routingは設定した比率でtrafficを分配し、利用者ごとのnetwork latencyを基準にendpointを選ばない。"
  ],
  "foundation-20260803-resilient-02": [
    "Manual snapshotからのrestoreは取得時点の静的copyで、primaryの更新を継続反映するreporting DBにはならない。",
    "Multi-AZ standbyは障害時の自動failover用で、通常時にreport queryを送ってread scaleするcopyではない。",
    "Point-in-Time Recoveryは指定時刻から新しいDBを復元する復旧機能で、継続更新されるread-only endpointを提供しない。",
    "正解。RDS Read Replicaはprimaryの変更を継続複製し、reportなどのread workloadをprimaryから分離できる。"
  ],
  "foundation-20260803-resilient-03": [
    "正解。Geolocation routingは利用者のcountry・continentなどに応じ、管理者が設定したendpointへDNSで案内する。",
    "Latency-based routingはnetwork latencyを比較して低遅延なregionへ案内し、国別のbusiness ruleを直接表現しない。",
    "Failover routingはhealth checkに基づくprimary・secondary切替で、国や大陸ごとの振り分けには使わない。",
    "Multivalue answer routingは複数のhealthy recordを返す簡易負荷分散で、地理的位置に基づくpolicyではない。"
  ],
  "foundation-20260803-cost-01": [
    "Aurora Backtrackはdatabaseを過去時点へ巻き戻す復旧機能で、需要に応じてcompute capacityを調整する機能ではない。",
    "正解。Aurora Serverlessはworkload需要に応じてcapacityを調整し、変動利用での過剰provisioningを抑えやすい。",
    "Aurora Global Databaseはcross-region readとregion DRに向く構成で、単一workloadの時間帯変動に合わせるcost機能ではない。",
    "RDS Multi-AZはAZ障害時の可用性を高める構成で、需要に合わせてdatabase capacityを自動調整しない。"
  ],
  "foundation-20260803-cost-02": [
    "gp2はvolume容量にbaseline IOPSが連動するため、性能目的で容量を増やすと不要なstorage costが発生しやすい。",
    "io2 Block Expressは非常に高いIOPSと低latencyが必要な重要workload向けで、一般用途のcost最適化には過剰になりやすい。",
    "正解。gp3は容量とIOPS・throughputを独立設定でき、一般用途で必要性能へ合わせながら費用を抑えやすい。",
    "st1は大容量sequential throughputを重視するHDD volumeで、random IOPS中心の一般database用途とは特性が異なる。"
  ],
  "foundation-20260803-cost-03": [
    "Aurora Serverlessは需要に応じてcapacityを調整する実行方式で、database stateを過去時点へ巻き戻す機能ではない。",
    "Aurora Read Replicaはread trafficを分散するreplicaで、primary databaseを指定時刻へ巻き戻す機能ではない。",
    "Aurora Global Databaseはcross-region replicationとregion DR向けで、誤更新前の時点へ短時間で戻す機能ではない。",
    "正解。Aurora Backtrackは対応clusterを過去の時点へ巻き戻し、論理的な誤操作からの短時間復旧に使う。"
  ]
});

window.SAA_QUESTIONS.forEach(question => {
  const reasons = window.SAA_CHOICE_REASONS[question.id];
  if (reasons) question.r = reasons;
});

const QUESTION_DECISION_CRITERIA = {
  "secure-01": "長期アクセスキーを置かず、S3へインターネットを経由せずに到達すること",
  "secure-02": "人間ユーザーの複数アカウントSSOと職務別権限を一元管理すること",
  "secure-03": "長期キーを共有せず、別AWSアカウントへ一時認証情報で権限を渡すこと",
  "secure-04": "既存IAM Allowより上位で、組織配下アカウントの利用リージョンを制限すること",
  "secure-05": "DBパスワードを安全に保存し、自動ローテーションまで管理すること",
  "secure-06": "SSE-KMSオブジェクトを読むroleへKMS側のDecrypt権限も与えること",
  "secure-07": "HTTPリクエストのSQL injectionとXSSをL7で検査・遮断すること",
  "secure-08": "S3内のPIIを継続検出し、セキュリティ担当へ検出結果を連携すること",
  "secure-09": "CloudFrontで使うACM証明書をus-east-1へ配置すること",
  "secure-10": "IAM認可では明示DenyがAllowより優先されること",
  "secure-11": "Secrets ManagerへNATやインターネットを通さずprivate接続すること",
  "secure-12": "SGはステートフルなENI単位、NACLはステートレスなsubnet単位であること",
  "secure-13": "アプリ利用者のsignup・login・social identity連携を提供すること",
  "secure-14": "不審通信や認証情報悪用などをマネージドに脅威検知すること",
  "secure-15": "S3のpublic化を発見するのではなくアカウント全体で予防的に抑止すること",
  "secure-16": "誰がいつどのAWS APIを実行したか監査証跡として残すこと",
  "secure-17": "EC2・ECR・Lambdaなどの脆弱性を継続評価すること",
  "secure-18": "KMS key自体の管理権限と暗号利用権限を分離して制御すること",
  "secure-19": "インターネット経由でオンプレミスとAWSをIPsec暗号化接続すること",
  "secure-20": "AWSサービスはrole、人間は最小権限とし、長期認証情報や過大権限を避けること",

  "resilient-01": "instance障害だけでなくAZ障害にも耐えるようWeb層を複数AZへ分散すること",
  "resilient-02": "read scaleではなくRDSのAZ障害時に自動failoverすること",
  "resilient-03": "注文受付と後続処理を非同期化し、後続障害を受付へ波及させないこと",
  "resilient-04": "1つのイベントを複数の独立した処理へ配信すること",
  "resilient-05": "分岐・待機・再試行・状態をworkflowとして明示管理すること",
  "resilient-06": "中核だけを常時維持し、障害時にアプリ層を起動するDR方式であること",
  "resilient-07": "縮小版の本番一式を別リージョンで常時稼働し、障害時に拡張すること",
  "resilient-08": "RPOを許容データ損失、RTOを許容停止時間として区別すること",
  "resilient-09": "S3オブジェクトの上書き・削除前の世代を保持して復旧できること",
  "resilient-10": "health checkでprimary障害を検知しDNSでsecondaryへ切り替えること",
  "resilient-11": "SQSで順序保証と重複排除を優先すること",
  "resilient-12": "オンプレミスからAWSストレージへ大量ファイルを継続同期すること",
  "resilient-13": "既存オンプレアプリからfile共有のようにAWS storageを利用すること",
  "resilient-14": "セッションをEC2外へ共有保存し、instance置換や水平scaleでも状態を維持すること",
  "resilient-15": "一定期間S3オブジェクトの削除・改ざんを防ぐWORM保持を実現すること",
  "resilient-16": "ALBとASGの両方を複数AZへ配置してAZ障害時も処理を継続すること",
  "resilient-17": "SQSをqueue、SNSをpub/subとして正しく使い分けること",

  "performance-01": "静的Web contentをedge cacheから世界中へ低latency配信すること",
  "performance-02": "EC2へ低latencyなblock deviceとしてattachできるstorageであること",
  "performance-03": "複数AZのLinux EC2から同時mountできる共有NFSであること",
  "performance-04": "DynamoDB read専用のmanaged cacheでmicrosecond級へ高速化すること",
  "performance-05": "MySQL互換を保ったままmanagedな高性能・高可用RDBへ移行すること",
  "performance-06": "S3上のデータをserver管理なしでSQL queryすること",
  "performance-07": "大量データをDWHとして集計しBI queryへ最適化すること",
  "performance-08": "インターネットVPNではなく安定帯域の専用線で接続すること",
  "performance-09": "多数VPCをfull-mesh peeringではなくhub型で集約接続すること",
  "performance-10": "CloudFrontはCDN、Global Acceleratorはnetwork経路最適化と区別すること",
  "performance-11": "HTTP/HTTPSのL7はALB、TCP/UDPのL4や固定IP要件はNLBと区別すること",
  "performance-12": "RDS/Auroraのread workloadをreplicaやcacheへ逃がすこと",
  "performance-13": "長時間処理を適切なcomputeへ分けつつ複雑な分岐・retry・stateをorchestrateすること",
  "performance-14": "大量のリアルタイムstreamを継続取り込みして後段分析へ渡すこと",
  "performance-15": "Windows workload向けのmanaged SMB file shareを提供すること",
  "performance-16": "HPC/ML向けの高性能並列file systemをS3と連携して使うこと",

  "cost-01": "短期かつ利用量が読めず長期commitを避けること",
  "cost-02": "1年または3年の安定compute利用へcommit discountを適用すること",
  "cost-03": "中断を許容できる再実行可能batchへ大幅割引の余剰capacityを使うこと",
  "cost-04": "アクセス頻度が読めないS3 objectを自動で適切な階層へ移すこと",
  "cost-05": "30日以上90日未満で削除される可能性がある低頻度dataを、複数AZかつmillisecond取得で保管すること",
  "cost-06": "ほぼ参照しない7年以上のarchiveを遅い復元と引き換えに低cost保管すること",
  "cost-07": "private subnetからS3への通信でNAT Gatewayの処理料金を避けること",
  "cost-08": "未使用resource自体を削除し、snapshot保持を自動化して再発を防ぐこと",
  "cost-09": "AWS料金をservice別・期間別に可視化して分析すること",
  "cost-10": "EC2やRDSなどの利用実績からrightsizing候補を得ること",
  "cost-11": "低cost要件では高可用性のための常時二重稼働が過剰になり得ると判断すること",
  "cost-12": "安定利用にはcommit discount、中断可能処理にはSpotを使い分けること",

  "foundation-20260805-performance-01": "EC2から独立したblock volumeを保持し、同一AZの別EC2へ付け替えること",
  "foundation-20260805-performance-02": "複数Linux EC2から同じdirectoryを同時mountできる共有file systemであること",
  "foundation-20260805-performance-03": "少数の重要instanceを異なるhardwareへ分散して相関障害を減らすこと",
  "foundation-20260805-performance-04": "cacheを使わずTCP/UDPを固定Anycast IPとAWS global networkで高速化すること",
  "foundation-20260805-performance-05": "海外から単一regionのS3へ直接uploadする長距離転送を高速化すること",
  "foundation-20260805-performance-06": "DynamoDB専用のmanaged in-memory cacheでreadをmicrosecond級へ高速化すること",
  "foundation-20260805-performance-07": "read分散ではなくLambdaからRDSへのconnectionをpool・共有すること",
  "foundation-20260805-performance-08": "Lambdaの初期化済みexecution environmentを指定versionへ事前確保すること",
  "foundation-20260805-performance-09": "同じpartition keyへのwrite集中を複数keyへ分散すること",
  "foundation-20260805-performance-10": "一般用途より高いIOPS・低latency・高durabilityのblock storageを優先すること",
  "foundation-20260805-cost-01": "Aurora capacityを需要に応じて増減し過剰provisioningを抑えること",
  "foundation-20260805-cost-02": "一般用途EBSで容量とIOPS・throughputを独立調整してgp2よりcostを下げること",
  "foundation-20260805-cost-03": "EC2 family・region変更とFargate利用まで割引を持ち運べる柔軟性があること",
  "foundation-20260805-cost-04": "S3通信をNAT Gatewayから外してprivate経路で処理料金を減らすこと",
  "foundation-20260805-cost-05": "ほぼ参照しない長期archiveを遅い復元と引き換えに最安寄りで保管すること",
  "foundation-20260805-secure-01": "S3 object-levelのGetObject・PutObjectをCloudTrailへdata eventとして記録すること",
  "foundation-20260805-secure-02": "API操作履歴ではなくresource設定の変更履歴とrule準拠状態を継続評価すること",
  "foundation-20260805-secure-03": "SQL injectionのL7遮断と高度DDoSの専門支援・cost protectionを同時に満たすこと",
  "foundation-20260805-resilient-01": "read scaleではなくRDSのAZ障害時に自動failoverすること",
  "foundation-20260805-resilient-02": "利用者の国ではなくAWS測定latencyを基準に低遅延regionへDNS routingすること"
};

const EXACT_CHOICE_PURPOSES = {
  "EC2 Instance Savings Plans": "選択したリージョン内の特定EC2 instance familyへの利用コミットであり、Compute Savings Plansほどfamily・region・Fargateへ適用先を広げられない",
  "Standard Reserved Instances": "特定のEC2構成へ強く紐づく割引で、FargateやLambdaへ割引を移せず、instance familyやregion変更の柔軟性も低い",
  "Spot Instances": "中断可能な余剰EC2 capacityを大幅割引で使う方式で、安定利用を1年commitして横断的な割引を得る方式ではない",
  "On-Demand Capacity Reservation": "特定AZのEC2 capacityを確保する機能で、利用額commitによる横断的な料金割引ではない",
  "S3 bucket policyで送信元VPCを制限し、EC2には共有認証情報を置く": "bucket policyで送信元を絞れても、EC2へ共有認証情報を置くため長期キー回避を満たさず、private経路も用意しない",
  "Gateway Endpoint for Secrets Manager": "Gateway Endpointが対応する代表サービスはS3とDynamoDBであり、Secrets ManagerへはInterface VPC Endpointを使う",
  "S3 Access Pointを作成し、相手アカウント側のIAM policyから参照する": "S3 Access Pointはアクセスポリシーとエンドポイントを整理するが、これだけでは相手を一時認証情報で受け入れるtrust関係を構成しない",
  "S3 Lifecycle policyで対象リージョンのデータを削除する": "S3オブジェクトの移行・削除時期を管理する機能であり、AWS APIを利用できるリージョンを組織全体で禁止しない",
  "AdministratorAccessを付けた監査用roleを作成する": "監査用roleへ広い権限を与える構成であり、既存principalの利用リージョンを制限するガードレールにはならない",
  "暗号化したUser DataをAMIに含める": "秘密情報をイメージや起動設定へ埋め込むため、集中管理・アクセス制御・自動ローテーションが難しい",
  "S3バケットに暗号化JSONとして保存する": "暗号化保管はできても、秘密情報専用の取得制御、監査、自動ローテーションを自前で実装する必要がある",
  "S3 Object OwnershipとACLの所有者設定": "S3オブジェクトの所有権とACLの扱いを制御する機能であり、SSE-KMSオブジェクトの復号権限を付与しない",
  "VPC Endpoint policyのS3アクション許可": "VPC Endpointを通るS3 API操作を制限するポリシーであり、KMS keyのDecrypt権限を付与しない",
  "resource policyがあるリソースではidentity policyの評価が発生しない": "resource policyがあっても認可コンテキストに応じてidentity policyや権限境界、SCP、明示Denyが評価される",
  "AWS Organizations": "複数AWSアカウントの組織管理サービスであり、アプリ利用者のサインアップやログイン機能を提供しない",
  "AWS Config": "AWSリソース設定の履歴・準拠状態を評価するサービスであり、利用者認証や脅威検知、処理オーケストレーションを行わない",
  "AWS Backup": "バックアップ計画と復元を一元管理するサービスであり、監視・脅威検知・キャッシュ処理を行わない",
  "S3 Transfer Acceleration": "遠距離からS3への転送を高速化する機能であり、public公開の防止やWORM保持を実現しない",
  "S3 Select": "S3オブジェクトの一部をSQL式で抽出する機能であり、public公開の抑止や削除・改ざん防止を行わない",
  "S3 Inventoryで公開状態を棚卸しする": "定期レポートで状態を発見する事後確認であり、設定変更時点でpublic accessを拒否する予防制御ではない",
  "Trusted Advisorの推奨項目を確認する": "コスト・性能・耐障害性などの推奨を提示するサービスであり、誰が行ったAPI操作かを監査証跡として保存しない",
  "S3 Lifecycle日数": "S3オブジェクトの階層移行・期限を決める設定であり、KMS keyの管理者と利用者の権限分離には関係しない",
  "開発期間中はPermission setへAdministratorAccessを付与し、後で見直す": "一時的でも過大な管理者権限を人へ付与するため、最小権限の要件を満たさない",
  "S3 bucket policyで社内CIDRからの全S3アクションを許可する": "送信元を限定しても全S3アクションを許可するため権限範囲が広すぎ、最小権限にならない",
  "EC2を大型化して同じAZで運用する": "垂直スケールで性能は上げられるが、インスタンス障害とAZ障害の単一障害点を残す",
  "EC2を同じAZへ集約する": "後続処理を同じAZへ集めても同期依存は解消せず、AZ障害の影響範囲も拡大する",
  "RDSをSingle-AZに変更する": "データベースの配置変更であり、受付APIと後続処理の同期依存を非同期化せず、可用性も下げる",
  "S3 Standard-IA": "低頻度アクセス向けストレージクラスであり、処理の分岐・待機・再試行・状態管理を制御しない",
  "Snapshot restore": "保存済みsnapshotから復元する操作であり、別リージョンの縮小版本番環境を常時稼働させるWarm Standbyではない",
  "RPOは許容停止時間、RTOは許容データ損失": "RPOとRTOの定義を逆にしており、RPOが許容データ損失、RTOが許容停止時間である",
  "RPOはDNS TTL、RTOはレコード種別": "DNS設定項目をDR目標値と混同しており、データ損失量と復旧時間を表していない",
  "S3 One Zone-IA": "単一AZに保存する低頻度アクセス向けストレージクラスであり、DNSヘルスチェックによる別リージョン切替を提供しない",
  "各EC2のローカルメモリに保存する": "セッションが各インスタンスへ分散して共有されず、置換・障害・水平スケール時に利用者状態を失う",
  "AMIにセッション初期値を含める": "AMIは起動時の不変なイメージであり、利用中に変化するセッションを複数EC2で共有する保存先にならない",
  "EC2を大型化して単一AZで稼働する": "性能余力は増えても単一AZ障害で全台が利用不能になるため、AZ障害時の継続要件を満たさない",
  "RDSをSingle-AZ固定にする": "データベースを単一AZへ固定してフェイルオーバー先をなくすため、AZ障害への耐性を下げる",
  "S3": "オブジェクトストレージであり、EC2のOSディスクとして低レイテンシにアタッチするブロックデバイスではない",
  "ACM": "TLS証明書を発行・管理するサービスであり、キャッシュ、ネットワーク集約、分析処理などの性能要件を解決しない",
  "S3 Standardにテーブルデータを保存する": "オブジェクトとして保存できてもMySQL互換のトランザクション、インデックス、SQL接続を提供しない",
  "On-Demandで運用を継続する": "利用量コミットなしで柔軟だが、長期安定稼働に対するSavings PlansやRIの割引を得られない",
  "S3 One Zone-IAへ固定する": "単一AZの低頻度階層へ固定するため、アクセス頻度が読めないデータの自動階層化と耐障害性を満たさない",
  "S3 One Zone-IAへ移してAZ障害時の再作成を許容する": "単一AZ喪失時にデータを失い得る構成であり、重要データの可用性を維持したままコストを下げる要件に反する",
  "S3 Standard": "頻繁なアクセス向けの標準階層であり、年に数回しか復元しないアーカイブでは保管費を十分に下げられない",
  "ACMでTLS証明書を管理する": "通信暗号化に必要な証明書管理であり、対象リソースの利用料金分析や削減策そのものではない",
  "Multi-Region構成はリージョン障害に対応できない": "事実と逆で、Multi-Region構成はリージョン障害への対応力を高めるが常時コストも増える",
  "S3バケット以外では利用できない": "Active-Activeはコンピュート、データベース、ネットワークなどを含むシステム全体で採用でき、S3固有の方式ではない"
};

const CHOICE_PURPOSES = [
  [/Instance Store/i, "EC2ホストへ直接接続された一時block storageで、instance停止・終了やhost障害時の永続保持には向かない"],
  [/Cluster Placement Group/i, "同一AZ内でinstanceを近接配置し、低latency・高throughput通信を優先する配置方式である"],
  [/Partition Placement Group/i, "instance群を複数partitionへ分け、hardware障害の影響範囲を分離する配置方式である"],
  [/RDS Proxy/i, "applicationとRDS・Aurora間のDB connectionをpool・共有するmanaged proxyである"],
  [/Reserved concurrency/i, "Lambdaの同時実行数を予約すると同時に上限も設定する機能で、初期化済み環境を用意する機能ではない"],
  [/sort key/i, "同じpartition key内のitem識別や並べ替えに使うkeyで、partition keyへのwrite集中自体は分散しない"],
  [/strongly consistent read/i, "最新のwrite結果を反映したreadを要求する方式で、write先partitionの偏りは解消しない"],
  [/io2 Block Express/i, "非常に高いIOPS・低latency・高durabilityを重視する高性能EBS volume typeである"],
  [/\bst1\b/i, "大容量のsequential throughputを重視するHDD-backed EBS volume typeである"],
  [/\bsc1\b/i, "低頻度accessの大容量sequential workload向けの低cost HDD-backed EBS volume typeである"],
  [/S3 Inventory/i, "S3 object一覧とmetadataを定期reportとして出力する機能で、個々のAPI実行者を監査する証跡ではない"],
  [/Geolocation routing/i, "利用者の地理的位置に基づいて管理者が指定したendpointへ案内するRoute 53 policyである"],
  [/Failover routing/i, "health check結果に基づいてprimaryからsecondaryへ切り替えるRoute 53 policyである"],
  [/Weighted routing/i, "設定した比率に基づいて複数endpointへtrafficを分配するRoute 53 policyである"],
  [/IAMユーザー|アクセスキー/i, "長期認証情報を人やアプリへ発行する方式で、漏えい・ローテーションの運用負荷が生じる"],
  [/IAM role|実行role|cross-account role/i, "一時認証情報でAWSサービスや別アカウントへ権限を渡す仕組みである"],
  [/Identity Center/i, "人間ユーザーのSSOと複数アカウント権限を一元管理するサービスである"],
  [/SCP/i, "Organizations配下のOU・アカウントに対する最大権限を制限する仕組みである"],
  [/Permissions Boundary/i, "IAM principalへ付与できる最大権限を制限する境界である"],
  [/Secrets Manager/i, "秘密情報の安全な保存と自動ローテーションに向くサービスである"],
  [/Parameter Store|SecureString/i, "設定値や簡易シークレットを階層的に保存するサービスである"],
  [/KMS|key policy/i, "暗号鍵とその利用権限を管理するサービス・ポリシーである"],
  [/CloudTrail/i, "AWS API操作を監査証跡として記録するサービスである"],
  [/GuardDuty/i, "ログから不審通信や認証情報悪用を検出する脅威検知サービスである"],
  [/Macie/i, "S3内の個人情報など機密データを検出するサービスである"],
  [/Inspector/i, "EC2・ECR・Lambdaなどの脆弱性を継続評価するサービスである"],
  [/WAF/i, "SQL injectionやXSSなどWeb層の攻撃を検査・遮断するサービスである"],
  [/Shield/i, "DDoS攻撃からAWS公開エンドポイントを保護するサービスである"],
  [/Cognito/i, "アプリ利用者のサインアップ・ログイン・ID連携を提供するサービスである"],
  [/Security Group|SGは/i, "ENI単位で動作するステートフルな許可型ファイアウォールである"],
  [/NACL/i, "サブネット単位でAllowとDenyを扱うステートレスなアクセス制御である"],
  [/Gateway (VPC )?Endpoint|Gateway Endpoint/i, "S3とDynamoDBへルートテーブル経由でprivate接続するVPC Endpointである"],
  [/Interface (VPC )?Endpoint|PrivateLink/i, "多くのAWS APIや提供サービスへENI経由でprivate接続する仕組みである"],
  [/NAT Gateway/i, "private subnetから外向き通信を行うための有料NATサービスである"],
  [/Internet Gateway/i, "VPCとインターネット間の経路を提供するゲートウェイである"],
  [/VPC Peering/i, "2つのVPCを非推移的に直接接続し、CIDR重複を許容しない方式である"],
  [/Transit Gateway/i, "多数のVPCやオンプレ接続をハブ型に集約するサービスである"],
  [/Direct Connect/i, "オンプレミスとAWSを専用線で接続するサービスである"],
  [/Site-to-Site VPN|VPN/i, "インターネット上にIPsec暗号化トンネルを作る接続方式である"],
  [/CloudFront/i, "Webコンテンツをエッジへキャッシュしてグローバル配信するCDNである"],
  [/Global Accelerator/i, "固定Anycast IPとAWSネットワークでTCP・UDP経路を最適化するサービスである"],
  [/Route 53/i, "DNSルーティングとヘルスチェックを提供するサービスである"],
  [/ALB/i, "HTTP・HTTPSのL7ルーティングに向くロードバランサである"],
  [/NLB/i, "TCP・UDPのL4、高スループット、固定IP要件に向くロードバランサである"],
  [/Multi-AZ/i, "同一リージョン内のAZ障害に備える高可用構成である"],
  [/Read Replica/i, "データベースの読み取り負荷分散を主目的とするレプリカである"],
  [/Aurora Global Database/i, "Auroraをクロスリージョン複製し、グローバル読み取りとリージョンDRに使う構成である"],
  [/Point-in-Time|PITR/i, "自動バックアップから指定時刻の状態を新しいDBとして復元する機能である"],
  [/SQS FIFO/i, "順序保証と重複排除を重視するキューである"],
  [/SQS/i, "メッセージを蓄積して処理を非同期化・疎結合化するキューである"],
  [/SNS/i, "1つの通知を複数購読者へ配信するpub/subサービスである"],
  [/EventBridge/i, "イベントをルールで複数ターゲットへルーティングするイベントバスである"],
  [/Step Functions/i, "分岐・待機・再試行を含む複数ステップの状態管理を行うサービスである"],
  [/Kinesis/i, "リアルタイムストリーミングデータを継続的に取り込むサービスである"],
  [/Lambda/i, "短時間のイベント駆動処理をサーバー管理なしで実行するサービスである"],
  [/Fargate/i, "サーバー管理なしでコンテナを実行する基盤である"],
  [/EKS/i, "Kubernetes互換のマネージドcontrol planeを提供するサービスである"],
  [/Auto Scaling|ASG/i, "負荷や障害に応じてコンピュート台数を増減する仕組みである"],
  [/API Gateway/i, "REST・HTTP・WebSocket APIの公開と管理を行うサービスである"],
  [/EBS/i, "EC2へアタッチするAZ単位のブロックストレージである"],
  [/EFS/i, "複数EC2から共有できるマネージドNFSファイルストレージである"],
  [/FSx for Windows/i, "WindowsのSMBファイル共有を提供するマネージドファイルシステムである"],
  [/FSx for Lustre/i, "HPC・機械学習向けの高性能並列ファイルシステムである"],
  [/DataSync/i, "オンプレミスとAWSストレージ間で大量データを移行・同期するサービスである"],
  [/Storage Gateway/i, "オンプレミスからAWSストレージをファイル・ボリューム・テープとして利用するサービスである"],
  [/S3 Versioning|Versioning/i, "オブジェクトの上書き・削除前の世代を保持する機能である"],
  [/Object Lock/i, "WORM要件に従って一定期間オブジェクトの削除・変更を防ぐ機能である"],
  [/Block Public Access/i, "S3の意図しないpublic公開をアカウント・バケット単位で抑止する機能である"],
  [/Intelligent-Tiering/i, "アクセス頻度が読めないS3データを自動で適切な階層へ移すストレージクラスである"],
  [/Glacier Deep Archive/i, "ほぼ参照しない長期保管向けで復元に長時間を要する低価格階層である"],
  [/Glacier Flexible Retrieval/i, "数分から数時間の復元を選べるアーカイブ階層である"],
  [/Glacier Instant Retrieval/i, "低頻度アーカイブをミリ秒単位で取得できる階層である"],
  [/DynamoDB/i, "大規模・低レイテンシ向けのマネージドNoSQLデータベースである"],
  [/DAX/i, "DynamoDBの読み取りをマイクロ秒級に高速化するキャッシュである"],
  [/ElastiCache/i, "Redis・Memcached互換のインメモリキャッシュである"],
  [/Aurora/i, "MySQL・PostgreSQL互換の高性能マネージドRDBである"],
  [/Athena/i, "S3上のデータをサーバーレスにSQL分析するサービスである"],
  [/Redshift/i, "大量データの集計・BI分析に向くデータウェアハウスである"],
  [/OpenSearch/i, "全文検索やログ検索、ダッシュボード表示に向く検索サービスである"],
  [/Neptune/i, "entity間の関係や経路を探索するグラフデータベースである"],
  [/Timestream/i, "時刻付き計測値の保存・集計・保持管理に向く時系列データベースである"],
  [/Backup and Restore/i, "平常時コストは低いがバックアップからの復元に時間がかかるDR方式である"],
  [/Pilot Light/i, "DBなど中核部分を常時維持し障害時にアプリを起動するDR方式である"],
  [/Warm Standby/i, "縮小版の本番一式を常時稼働し障害時に拡張するDR方式である"],
  [/Active-Active/i, "複数環境を同時稼働させ復旧を速める一方で常時コストが高い方式である"],
  [/Savings Plans|Reserved Instances|RI/i, "長期・安定した利用量をコミットして料金を下げる購入方法である"],
  [/Spot/i, "中断可能な余剰キャパシティを大幅割引で使う購入方法である"],
  [/Dedicated Host/i, "物理ホストを専有しsocket・core単位のBYOL要件へ対応しやすい購入形態である"],
  [/Cost Explorer/i, "サービス別・期間別のAWS料金を分析するサービスである"],
  [/AWS Budgets|Budgets/i, "実績・予測コストが設定した予算しきい値へ達した際に通知するサービスである"],
  [/Compute Optimizer/i, "利用実績からリソースの適正サイズを推奨するサービスである"]
];

function purposeForChoice(choice) {
  if (EXACT_CHOICE_PURPOSES[choice]) return EXACT_CHOICE_PURPOSES[choice];
  const match = CHOICE_PURPOSES.find(([pattern]) => pattern.test(choice));
  return match ? match[1] : null;
}

function buildChoiceReasons(question) {
  const criterion = QUESTION_DECISION_CRITERIA[question.id];
  if (!criterion) throw new Error(`${question.id}: 選択肢別解説の判断基準が未定義`);
  return question.c.map((choice, index) => {
    if (question.a.includes(index)) return `正解。${question.e}`;
    const purpose = purposeForChoice(choice);
    if (!purpose) throw new Error(`${question.id}: 「${choice}」固有の不正解理由が未定義`);
    return `${choice}：${purpose}。したがって「${criterion}」という条件に届かない。`;
  });
}

window.SAA_QUESTIONS.forEach(question => {
  if (!Array.isArray(question.r)) question.r = buildChoiceReasons(question);
});
