import * as fs from 'fs';
import * as path from 'path';

export interface ContentNode {
  id: string;
  type: 'home' | 'main_topic' | 'sub_topic' | 'cluster' | 'article';
  title: string;
  seoTitle?: string;
  url: string;
  parentId: string | null;
  hubId: string | null;
  intent: string;
  primaryQuestion: string;
  inScope: string[];
  outOfScope: string[];
  sourceIds: string[];
  entityIds: string[];
  relatedIds: string[];
  wordTarget: number;
  zhCharCount: number;
  status: 'planned' | 'researching' | 'draft' | 'reviewed' | 'published' | 'blocked';
  createdAt: string;
  updatedAt: string;
}

// 13 主专题结构定义
const mainTopicsDef = [
  {
    id: 'H01',
    name: '梯子怎么选',
    slug: 'choose',
    subs: [
      {
        id: 'H01-S1',
        name: '需求与约束判断',
        slug: 'needs',
        clusters: [
          {
            id: 'H01-S1-C1',
            name: '真实任务与使用频率',
            slug: 'workloads',
            articles: [
              { id: 'H01-S1-C1-A1', title: '只是浏览网页和查资料，怎样确定梯子的最低够用条件？', slug: 'browsing-task-budget' },
              { id: 'H01-S1-C1-A2', title: '每月只用几次，选长期订阅还是临时方案更合适？', slug: 'occasional-use-choice' },
              { id: 'H01-S1-C1-A3', title: '浏览、视频和文件传输混合使用，怎样安排服务优先级？', slug: 'mixed-workloads' },
              { id: 'H01-S1-C1-A4', title: '出差期间临时需要网络服务，购买前怎样规划设备和使用时间？', slug: 'travel-use-planning' }
            ]
          },
          {
            id: 'H01-S1-C2',
            name: '实付预算与附加成本',
            slug: 'budget',
            articles: [
              { id: 'H01-S1-C2-A1', title: '预算有限怎么选梯子：先算第一次实际要付多少钱', slug: 'first-payment-limit' },
              { id: 'H01-S1-C2-A2', title: '选择网络服务时，怎样把客户端费用算进总预算？', slug: 'software-extra-cost' },
              { id: 'H01-S1-C2-A3', title: '月付与年付怎样选择：费用节省和预付承诺一起比较', slug: 'monthly-annual-commitment' },
              { id: 'H01-S1-C2-A4', title: '套餐流量一直用不完，如何按任务重新分配预算？', slug: 'wasted-quota-budget' }
            ]
          },
          {
            id: 'H01-S1-C3',
            name: '上手难度与维护负担',
            slug: 'complexity',
            articles: [
              { id: 'H01-S1-C3-A1', title: '自有客户端和通用订阅怎么选：上手步骤与可迁移性比较', slug: 'one-click-versus-import' },
              { id: 'H01-S1-C3-A2', title: '不想经常折腾配置，选服务时应该确认哪些维护条件？', slug: 'maintenance-time' },
              { id: 'H01-S1-C3-A3', title: '怎样判断一个服务的教程和客服足以帮助自己上手？', slug: 'documentation-support' },
              { id: 'H01-S1-C3-A4', title: '会安装软件但不懂协议，怎样选择符合自己能力的方案？', slug: 'technical-skill-fit' }
            ]
          },
          {
            id: 'H01-S1-C4',
            name: '账号、设备与场景约束',
            slug: 'constraints',
            articles: [
              { id: 'H01-S1-C4-A1', title: '已经买了客户端，怎样反向筛选适配的服务？', slug: 'existing-client-service' },
              { id: 'H01-S1-C4-A2', title: '设备由单位管理时，选择个人网络服务前需要确认什么？', slug: 'managed-device-choice' },
              { id: 'H01-S1-C4-A3', title: '应用账号资格和网络连接有什么区别，选服务时怎样分别核对？', slug: 'account-network-boundary' },
              { id: 'H01-S1-C4-A4', title: '选择梯子前如何列出必须满足和可以放弃的条件？', slug: 'non-negotiable-needs' }
            ]
          }
        ]
      },
      {
        id: 'H01-S2',
        name: '候选比较与最终取舍',
        slug: 'decisions',
        clusters: [
          {
            id: 'H01-S2-C1',
            name: '候选收敛与证据比较',
            slug: 'shortlist',
            articles: [
              { id: 'H01-S2-C1-A1', title: '面对很多服务品牌，怎样用可核验条件缩小候选范围？', slug: 'build-shortlist' },
              { id: 'H01-S2-C1-A2', title: '不依赖综合评分，如何比较两套网络服务方案？', slug: 'comparison-not-scores' },
              { id: 'H01-S2-C1-A3', title: '候选服务资料不完整时，怎样判断需要补问哪些问题？', slug: 'missing-information' },
              { id: 'H01-S2-C1-A4', title: '怎样阅读梯子推荐文章：区分选择依据与推广话术', slug: 'recommendation-reasons' }
            ]
          },
          {
            id: 'H01-S2-C2',
            name: '设备组合与使用范围',
            slug: 'devices',
            articles: [
              { id: 'H01-S2-C2-A1', title: '一台手机加一台电脑，怎样设计容易维护的使用方案？', slug: 'phone-laptop-combination' },
              { id: 'H01-S2-C2-A2', title: '家庭多人使用服务，怎样核对设备、连接和共享规则？', slug: 'family-device-rules' },
              { id: 'H01-S2-C2-A3', title: '只需要浏览器联网时，是否有必要配置整个设备？', slug: 'browser-only-needs' },
              { id: 'H01-S2-C2-A4', title: '新旧设备混用，怎样比较兼容范围与长期维护成本？', slug: 'legacy-new-device' }
            ]
          },
          {
            id: 'H01-S2-C3',
            name: '性能声明与试用证据',
            slug: 'evidence',
            articles: [
              { id: 'H01-S2-C3-A1', title: '推荐页速度数字很高，为什么还要核对测试条件？', slug: 'peak-speed-not-experience' },
              { id: 'H01-S2-C3-A2', title: '选服务时看到协议和专线名称，哪些信息仍然需要验证？', slug: 'protocol-label-selection' },
              { id: 'H01-S2-C3-A3', title: '怎样把自己的日常任务变成购买前的体验清单？', slug: 'task-based-trial' },
              { id: 'H01-S2-C3-A4', title: '官网声明、编辑实测和用户反馈，选择时分别能说明什么？', slug: 'evidence-confidence' }
            ]
          },
          {
            id: 'H01-S2-C4',
            name: '决策记录与后续复核',
            slug: 'final-choice',
            articles: [
              { id: 'H01-S2-C4-A1', title: '购买前如何写一份能复查理由的服务选择记录？', slug: 'decision-sheet' },
              { id: 'H01-S2-C4-A2', title: '哪些情况适合暂缓购买，先处理设备或账号问题？', slug: 'not-buy-yet' },
              { id: 'H01-S2-C4-A3', title: '首选方案未通过验收时，怎样调整条件而不是盲目换品牌？', slug: 'alternative-after-failure' },
              { id: 'H01-S2-C4-A4', title: '使用需求发生变化后，怎样判断原来的选择是否仍然合适？', slug: 'review-choice-later' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'H02',
    name: '手机方案',
    slug: 'mobile',
    subs: [
      {
        id: 'H02-S1',
        name: '移动系统与接入方式',
        slug: 'systems',
        clusters: [
          {
            id: 'H02-S1-C1',
            name: 'Android设备方案',
            slug: 'android',
            articles: [
              { id: 'H02-S1-C1-A1', title: 'Android手机选网络服务，怎样核对系统版本与客户端条件？', slug: 'android-version-needs' },
              { id: 'H02-S1-C1-A2', title: 'Android应用内代理和系统VPN连接怎样选择适用范围？', slug: 'android-app-system' },
              { id: 'H02-S1-C1-A3', title: '不同Android厂商的后台策略，会给方案选择带来哪些检查项？', slug: 'android-vendor-background' },
              { id: 'H02-S1-C1-A4', title: '无法使用某个应用商店时，怎样评估可取得的软件渠道？', slug: 'android-no-store' }
            ]
          },
          {
            id: 'H02-S1-C2',
            name: 'iPhone与iPad方案',
            slug: 'ios',
            articles: [
              { id: 'H02-S1-C2-A1', title: 'iPhone购买服务前，怎样确认所需客户端能够正常获取？', slug: 'ios-app-availability' },
              { id: 'H02-S1-C2-A2', title: 'iPhone与iPad一起使用，怎样核对服务权益和配置管理？', slug: 'ipad-iphone-workflow' },
              { id: 'H02-S1-C2-A3', title: '苹果设备安装VPN配置前，应怎样理解授权提示与范围？', slug: 'ios-permissions-choice' },
              { id: 'H02-S1-C2-A4', title: 'iOS客户端收费和机场服务收费如何区分？', slug: 'ios-free-app-paid-service' }
            ]
          },
          {
            id: 'H02-S1-C3',
            name: '手机服务交付方式',
            slug: 'delivery',
            articles: [
              { id: 'H02-S1-C3-A1', title: '手机使用服务商自有客户端，选择前应确认哪些更新与退出条件？', slug: 'mobile-vendor-client' },
              { id: 'H02-S1-C3-A2', title: '手机通用客户端接收哪种订阅，购买服务前怎样确认？', slug: 'mobile-subscription-format' },
              { id: 'H02-S1-C3-A3', title: '同一手机保留多个连接配置，怎样避免选错服务？', slug: 'mobile-profiles-multiple' },
              { id: 'H02-S1-C3-A4', title: '从浏览器跳转客户端导入订阅，怎样判断交接流程是否适配？', slug: 'mobile-import-handoff' }
            ]
          },
          {
            id: 'H02-S1-C4',
            name: '移动使用场景',
            slug: 'mobile-scenarios',
            articles: [
              { id: 'H02-S1-C4-A1', title: '以阅读和学习为主的手机用户，应该怎样估算使用要求？', slug: 'mobile-reading-learning' },
              { id: 'H02-S1-C4-A2', title: '手机视频和通话混合使用，怎样分别验证任务体验？', slug: 'mobile-video-calls' },
              { id: 'H02-S1-C4-A3', title: '经常上传照片和文件，手机方案需要关注哪些条件？', slug: 'mobile-large-files' },
              { id: 'H02-S1-C4-A4', title: '开热点给电脑使用时，怎样核对手机连接能否覆盖共享流量？', slug: 'mobile-hotspot-boundary' }
            ]
          }
        ]
      },
      {
        id: 'H02-S2',
        name: '移动连续使用与设备维护',
        slug: 'continuity',
        clusters: [
          {
            id: 'H02-S2-C1',
            name: 'Wi-Fi与蜂窝切换',
            slug: 'switching',
            articles: [
              { id: 'H02-S2-C1-A1', title: '从Wi-Fi切到蜂窝网络前后，怎样比较连接是否正常恢复？', slug: 'wifi-cellular-baseline' },
              { id: 'H02-S2-C1-A2', title: '公共Wi-Fi需要网页认证时，怎样安排登录与代理连接顺序？', slug: 'public-wifi-login' },
              { id: 'H02-S2-C1-A3', title: '双卡手机换数据卡后，哪些条件需要重新核对？', slug: 'dual-sim-measurement' },
              { id: 'H02-S2-C1-A4', title: '漫游时使用网络服务，怎样分清运营商费用与服务流量？', slug: 'roaming-usage-plan' }
            ]
          },
          {
            id: 'H02-S2-C2',
            name: '后台、锁屏与续航',
            slug: 'battery',
            articles: [
              { id: 'H02-S2-C2-A1', title: '手机锁屏后应用任务中断，怎样验证后台行为而不只看连接图标？', slug: 'lock-screen-verification' },
              { id: 'H02-S2-C2-A2', title: '比较两款手机客户端耗电，怎样控制屏幕和网络条件？', slug: 'battery-fair-comparison' },
              { id: 'H02-S2-C2-A3', title: '长时间后台连接与续航之间，应该怎样安排使用策略？', slug: 'mobile-keepalive-tradeoff' },
              { id: 'H02-S2-C2-A4', title: '启用代理后通知延迟，怎样确认应用后台权限与连接状态？', slug: 'mobile-notification-check' }
            ]
          },
          {
            id: 'H02-S2-C3',
            name: '移动流量与多设备权益',
            slug: 'mobile-quota',
            articles: [
              { id: 'H02-S2-C3-A1', title: '蜂窝流量账单与机场流量统计为什么需要分别查看？', slug: 'cellular-service-accounting' },
              { id: 'H02-S2-C3-A2', title: '手机后台下载和同步，怎样纳入套餐用量估算？', slug: 'mobile-background-data' },
              { id: 'H02-S2-C3-A3', title: '手机和平板同时连接时，怎样理解服务的设备与会话限制？', slug: 'phone-tablet-limits' },
              { id: 'H02-S2-C3-A4', title: '怎样记录一周手机实际用量，避免凭感觉选套餐？', slug: 'mobile-usage-record' }
            ]
          },
          {
            id: 'H02-S2-C4',
            name: '换机、备份与恢复',
            slug: 'migration',
            articles: [
              { id: 'H02-S2-C4-A1', title: '换手机前如何清点客户端、订阅和恢复信息？', slug: 'phone-change-checklist' },
              { id: 'H02-S2-C4-A2', title: '手机配置备份应该保留什么，哪些凭据不应公开同步？', slug: 'mobile-secret-backup' },
              { id: 'H02-S2-C4-A3', title: '旧手机不再使用后，怎样撤销配置和敏感访问资料？', slug: 'old-phone-revoke' },
              { id: 'H02-S2-C4-A4', title: '新手机恢复配置后，怎样完成权限、连接和应用任务验收？', slug: 'mobile-restore-test' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'H03',
    name: '电脑方案',
    slug: 'desktop',
    subs: [
      {
        id: 'H03-S1',
        name: '桌面系统与运行环境',
        slug: 'platforms',
        clusters: [
          {
            id: 'H03-S1-C1',
            name: 'Windows方案',
            slug: 'windows',
            articles: [
              { id: 'H03-S1-C1-A1', title: 'Windows内置VPN连接与代理客户端有什么不同，选服务前怎样区分？', slug: 'windows-native-or-client' },
              { id: 'H03-S1-C1-A2', title: 'Windows电脑选择客户端前，怎样确认CPU架构与运行环境？', slug: 'windows-cpu-packages' },
              { id: 'H03-S1-C1-A3', title: '没有管理员权限的Windows账户，怎样核对方案能否使用？', slug: 'windows-user-permissions' },
              { id: 'H03-S1-C1-A4', title: '电脑已有虚拟网卡和网络工具时，如何评估新增客户端的影响？', slug: 'windows-existing-network' }
            ]
          },
          {
            id: 'H03-S1-C2',
            name: 'macOS方案',
            slug: 'macos',
            articles: [
              { id: 'H03-S1-C2-A1', title: 'Intel Mac与Apple芯片Mac选择客户端时，哪些条件需要分别核对？', slug: 'mac-chip-version' },
              { id: 'H03-S1-C2-A2', title: 'macOS网络扩展与应用代理怎样区分，选型时应看什么？', slug: 'mac-network-extension' },
              { id: 'H03-S1-C2-A3', title: 'Mac办公软件种类很多，怎样定义需要覆盖的联网范围？', slug: 'mac-work-apps' },
              { id: 'H03-S1-C2-A4', title: '准备升级macOS前，怎样评估当前客户端与配置的可持续使用？', slug: 'mac-upgrade-planning' }
            ]
          },
          {
            id: 'H03-S1-C3',
            name: 'Linux方案',
            slug: 'linux',
            articles: [
              { id: 'H03-S1-C3-A1', title: 'Linux桌面客户端和命令行核心怎样选择管理方式？', slug: 'linux-desktop-cli' },
              { id: 'H03-S1-C3-A2', title: '不同Linux发行版怎样核对客户端包和依赖兼容？', slug: 'linux-distribution-fit' },
              { id: 'H03-S1-C3-A3', title: '系统服务、用户会话与应用代理，Linux使用前怎样分清作用范围？', slug: 'linux-service-scope' },
              { id: 'H03-S1-C3-A4', title: 'Linux客户端更新由谁管理，选型前怎样核对维护来源？', slug: 'linux-update-maintenance' }
            ]
          },
          {
            id: 'H03-S1-C4',
            name: '受管设备与隔离环境',
            slug: 'workspace',
            articles: [
              { id: 'H03-S1-C4-A1', title: '在工作电脑上配置个人网络工具前，怎样核对组织授权与限制？', slug: 'work-computer-policy' },
              { id: 'H03-S1-C4-A2', title: '虚拟机里的联网请求从哪里发出，怎样设计可验证的接入方案？', slug: 'virtual-machine-exit' },
              { id: 'H03-S1-C4-A3', title: '远程桌面连接的本地与远程网络，选服务时应该分别考虑什么？', slug: 'remote-desktop-origin' },
              { id: 'H03-S1-C4-A4', title: '多人共用一台电脑，怎样隔离订阅凭据和应用连接设置？', slug: 'multi-user-computer' }
            ]
          }
        ]
      },
      {
        id: 'H03-S2',
        name: '桌面任务与维护策略',
        slug: 'workflows',
        clusters: [
          {
            id: 'H03-S2-C1',
            name: '浏览器与文件任务',
            slug: 'browser-work',
            articles: [
              { id: 'H03-S2-C1-A1', title: '多个浏览器配置文件并用时，怎样安排扩展与系统代理？', slug: 'desktop-browser-profile' },
              { id: 'H03-S2-C1-A2', title: '大文件下载应该比较哪些服务条件，而不只看节点标注速度？', slug: 'desktop-download-tasks' },
              { id: 'H03-S2-C1-A3', title: '网页办公与桌面办公软件并用，怎样检查两类请求的范围？', slug: 'desktop-web-office' },
              { id: 'H03-S2-C1-A4', title: '需要访问打印机和本地NAS时，怎样选择不干扰局域网的配置？', slug: 'desktop-local-resources' }
            ]
          },
          {
            id: 'H03-S2-C2',
            name: '终端与开发任务',
            slug: 'development',
            articles: [
              { id: 'H03-S2-C2-A1', title: '浏览器可以访问但终端不行，方案设计时应先分清哪些配置来源？', slug: 'terminal-browser-difference' },
              { id: 'H03-S2-C2-A2', title: '编辑器与插件是否共用网络设置，购买服务前怎样安排验收？', slug: 'editor-extension-origin' },
              { id: 'H03-S2-C2-A3', title: '容器内的应用怎样使用网络服务，选方案时有哪些边界？', slug: 'container-network-choice' },
              { id: 'H03-S2-C2-A4', title: '代码仓库、依赖下载与API调用混用时，怎样列出测试目标？', slug: 'package-download-needs' }
            ]
          },
          {
            id: 'H03-S2-C3',
            name: '资源、连接与恢复',
            slug: 'resources',
            articles: [
              { id: 'H03-S2-C3-A1', title: '如何记录客户端的CPU和内存基线，避免把设备卡顿归咎于线路？', slug: 'desktop-resource-baseline' },
              { id: 'H03-S2-C3-A2', title: '电脑睡眠唤醒后，怎样验证连接、DNS和应用是否恢复？', slug: 'sleep-resume-workflow' },
              { id: 'H03-S2-C3-A3', title: '电脑同时安装多个代理客户端时，怎样管理启动与端口冲突？', slug: 'desktop-multiple-clients' },
              { id: 'H03-S2-C3-A4', title: '长时间办公应怎样记录连接中断和任务恢复情况？', slug: 'desktop-long-session' }
            ]
          },
          {
            id: 'H03-S2-C4',
            name: '电脑迁移与协作',
            slug: 'continuity',
            articles: [
              { id: 'H03-S2-C4-A1', title: '电脑与手机共用一个服务，怎样比较权益和配置维护？', slug: 'desktop-to-mobile-plan' },
              { id: 'H03-S2-C4-A2', title: '电脑配置文件如何备份，怎样避免把订阅密钥提交到Git？', slug: 'desktop-backup-policy' },
              { id: 'H03-S2-C4-A3', title: '更换桌面客户端时，怎样保留必要规则并准备回退？', slug: 'desktop-client-switch' },
              { id: 'H03-S2-C4-A4', title: '重装系统后恢复网络工具，需要按什么顺序核对依赖与凭据？', slug: 'desktop-reinstall-check' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'H04',
    name: '新手方案',
    slug: 'beginner',
    subs: [
      {
        id: 'H04-S1',
        name: '首次使用前的基础准备',
        slug: 'preparation',
        clusters: [
          {
            id: 'H04-S1-C1',
            name: '软件、服务与账户分工',
            slug: 'roles',
            articles: [
              { id: 'H04-S1-C1-A1', title: '第一次使用梯子到底需要准备什么：软件、服务和设备分别负责什么？', slug: 'beginner-what-to-buy' },
              { id: 'H04-S1-C1-A2', title: '下载了客户端为什么还不能直接连接，下一步需要哪些资料？', slug: 'beginner-software-not-service' },
              { id: 'H04-S1-C1-A3', title: '客户端账号、服务账号和应用账号分别有什么用途？', slug: 'beginner-account-separation' },
              { id: 'H04-S1-C1-A4', title: '付款给客户端开发者和付款给机场有什么区别，怎样避免买错？', slug: 'beginner-billing-parties' }
            ]
          },
          {
            id: 'H04-S1-C2',
            name: '设备与资料准备',
            slug: 'readiness',
            articles: [
              { id: 'H04-S1-C2-A1', title: '第一次设置前如何整理系统、架构和现有软件信息？', slug: 'beginner-device-sheet' },
              { id: 'H04-S1-C2-A2', title: '开始安装网络工具前，为什么要先确认本地网络正常？', slug: 'beginner-connection-baseline' },
              { id: 'H04-S1-C2-A3', title: '新手怎样安全保存购买记录、恢复方式和订阅凭据？', slug: 'beginner-storage' },
              { id: 'H04-S1-C2-A4', title: '第一次尝试应该预留哪些检查步骤，而不是只看安装耗时？', slug: 'beginner-time-window' }
            ]
          },
          {
            id: 'H04-S1-C3',
            name: '学习路线与完成标准',
            slug: 'learning',
            articles: [
              { id: 'H04-S1-C3-A1', title: '新手先学哪些概念就能开始使用，哪些高级设置可以以后再看？', slug: 'beginner-minimum-knowledge' },
              { id: 'H04-S1-C3-A2', title: '从下载到完成应用任务，每个阶段怎样判断已经做对？', slug: 'beginner-stage-checks' },
              { id: 'H04-S1-C3-A3', title: '第一次阅读客户端教程，怎样识别适用系统和版本？', slug: 'beginner-doc-reading' },
              { id: 'H04-S1-C3-A4', title: '为什么新手应先验证最小配置，再增加规则和TUN功能？', slug: 'beginner-avoid-overconfig' }
            ]
          },
          {
            id: 'H04-S1-C4',
            name: '低门槛首次决定',
            slug: 'first-decision',
            articles: [
              { id: 'H04-S1-C4-A1', title: '第一次买服务，怎样评估短周期体验与长期预付的取舍？', slug: 'beginner-short-commitment' },
              { id: 'H04-S1-C4-A2', title: '不会排查问题的新手，怎样判断服务支持方式是否适合自己？', slug: 'beginner-helpful-support' },
              { id: 'H04-S1-C4-A3', title: '先在一台设备上验证方案，有助于排除哪些不确定因素？', slug: 'beginner-single-device' },
              { id: 'H04-S1-C4-A4', title: '新手选择免费体验还是低门槛付费，需要先明确什么任务？', slug: 'beginner-free-or-paid' }
            ]
          }
        ]
      },
      {
        id: 'H04-S2',
        name: '首次成功后的使用习惯',
        slug: 'habits',
        clusters: [
          {
            id: 'H04-S2-C1',
            name: '基本操作与状态意识',
            slug: 'daily-basics',
            articles: [
              { id: 'H04-S2-C1-A1', title: '软件显示运行中、已连接和任务可用分别意味着什么？', slug: 'beginner-state-signals' },
              { id: 'H04-S2-C1-A2', title: '不用代理时怎样退出连接，并确认普通上网已经恢复？', slug: 'beginner-safe-disconnect' },
              { id: 'H04-S2-C1-A3', title: '客户端有多个配置和节点，新手怎样避免误用旧订阅？', slug: 'beginner-profile-selection' },
              { id: 'H04-S2-C1-A4', title: '新手怎样安排检查流量、到期时间与版本更新的频率？', slug: 'beginner-update-reminders' }
            ]
          },
          {
            id: 'H04-S2-C2',
            name: '账户与费用管理',
            slug: 'subscriptions',
            articles: [
              { id: 'H04-S2-C2-A1', title: '首次购买后应保留哪些订单和套餐条件记录？', slug: 'beginner-first-order-record' },
              { id: 'H04-S2-C2-A2', title: '第一次续费前，怎样复盘真实用量和遇到的问题？', slug: 'beginner-renewal-review' },
              { id: 'H04-S2-C2-A3', title: '准备增加第二台设备前，应核对哪些授权与限制？', slug: 'beginner-extra-device' },
              { id: 'H04-S2-C2-A4', title: '不继续使用时，怎样找到取消续费和处理账户资料的入口？', slug: 'beginner-cancel-options' }
            ]
          },
          {
            id: 'H04-S2-C3',
            name: '求助与错误描述',
            slug: 'help-seeking',
            articles: [
              { id: 'H04-S2-C3-A1', title: '不知道问题在哪里时，新手应该提供哪些不含秘密的故障信息？', slug: 'beginner-error-report' },
              { id: 'H04-S2-C3-A2', title: '截图求助前如何遮住订阅、账号和二维码里的敏感内容？', slug: 'beginner-screenshot-redaction' },
              { id: 'H04-S2-C3-A3', title: '客服要求反复更改设置时，怎样记录操作并保留回退条件？', slug: 'beginner-follow-support' },
              { id: 'H04-S2-C3-A4', title: '别人说问题已解决后，新手应该如何自己完成复验？', slug: 'beginner-confirm-fix' }
            ]
          },
          {
            id: 'H04-S2-C4',
            name: '进阶与更换时机',
            slug: 'growth',
            articles: [
              { id: 'H04-S2-C4-A1', title: '什么时候值得学习规则分流，而不是一直使用默认模式？', slug: 'beginner-when-rules' },
              { id: 'H04-S2-C4-A2', title: '体验不理想时，怎样分清需要学习客户端还是重新评估服务？', slug: 'beginner-client-or-service' },
              { id: 'H04-S2-C4-A3', title: '新手是否需要主用和备用两个服务，怎样按实际风险判断？', slug: 'beginner-two-services' },
              { id: 'H04-S2-C4-A4', title: '完成首次使用后，怎样根据经常遇到的任务制定进阶路线？', slug: 'beginner-next-learning-plan' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'H05',
    name: '服务类型',
    slug: 'service-types',
    subs: [
      {
        id: 'H05-S1',
        name: '产品类别与任务边界',
        slug: 'categories',
        clusters: [
          {
            id: 'H05-S1-C1',
            name: '个人VPN与代理订阅',
            slug: 'proxy-vpn',
            articles: [
              { id: 'H05-S1-C1-A1', title: '个人VPN与机场订阅怎样比较：服务形式、客户端和使用范围', slug: 'consumer-vpn-subscription' },
              { id: 'H05-S1-C1-A2', title: '应用商店里的VPN软件与一种VPN协议有什么不同？', slug: 'vpn-app-versus-protocol' },
              { id: 'H05-S1-C1-A3', title: '比较代理服务时，怎样核对浏览器、应用和系统流量的覆盖？', slug: 'proxy-scope-evaluation' },
              { id: 'H05-S1-C1-A4', title: '阅读英文服务介绍时，怎样区分proxy、VPN和remote access的用途？', slug: 'service-language-naming' }
            ]
          },
          {
            id: 'H05-S1-C2',
            name: '自有客户端与开放配置',
            slug: 'managed-client',
            articles: [
              { id: 'H05-S1-C2-A1', title: '服务商客户端与通用订阅的长期取舍：迁移、维护与支持', slug: 'vendor-app-portability' },
              { id: 'H05-S1-C2-A2', title: '所谓开放配置应提供哪些资料，怎样核对可导出范围？', slug: 'open-config-fields' },
              { id: 'H05-S1-C2-A3', title: '客户端绑定某个服务时，停用订阅后哪些功能可能受到影响？', slug: 'app-service-coupling' },
              { id: 'H05-S1-C2-A4', title: '选择手动节点配置方案，用户与服务方分别需要维护什么？', slug: 'manual-config-responsibility' }
            ]
          },
          {
            id: 'H05-S1-C3',
            name: '企业远程接入与设备组网',
            slug: 'remote-access',
            articles: [
              { id: 'H05-S1-C3-A1', title: '公司要求连接企业VPN时，为什么个人代理订阅通常不是替代品？', slug: 'enterprise-vpn-not-airport' },
              { id: 'H05-S1-C3-A2', title: '虚拟局域网工具主要解决什么需求，怎样避免与公网出口服务混淆？', slug: 'virtual-lan-purpose' },
              { id: 'H05-S1-C3-A3', title: '站点间连接和个人远程接入有什么不同，选择前需要哪些网络资料？', slug: 'site-to-site-user-access' },
              { id: 'H05-S1-C3-A4', title: '企业管理员提供的网关与认证资料，为什么不能随意套用第三方教程？', slug: 'administrator-provided-settings' }
            ]
          },
          {
            id: 'H05-S1-C4',
            name: '特殊用途与自建方案',
            slug: 'special-purpose',
            articles: [
              { id: 'H05-S1-C4-A1', title: '自建代理与购买托管服务怎样比较：维护责任和总成本', slug: 'self-hosted-maintenance' },
              { id: 'H05-S1-C4-A2', title: '游戏加速、虚拟局域网和日常代理分别适合什么任务？', slug: 'game-latency-products' },
              { id: 'H05-S1-C4-A3', title: '需要固定出口时，应怎样核对动态共享、静态共享与独立地址条件？', slug: 'static-exit-needs' },
              { id: 'H05-S1-C4-A4', title: '浏览器扩展提供的代理服务，和独立客户端有什么范围差异？', slug: 'browser-extension-service' }
            ]
          }
        ]
      },
      {
        id: 'H05-S2',
        name: '交付条件与服务声明',
        slug: 'delivery',
        clusters: [
          {
            id: 'H05-S2-C1',
            name: '订阅交付与协议组合',
            slug: 'subscription-formats',
            articles: [
              { id: 'H05-S2-C1-A1', title: 'Clash配置、节点链接和节点协议有什么区别，购买时怎么问清？', slug: 'format-protocol-distinction' },
              { id: 'H05-S2-C1-A2', title: '服务写着支持某客户端，为什么还要核对核心与版本？', slug: 'core-client-compatibility' },
              { id: 'H05-S2-C1-A3', title: '同一个节点协议搭配不同传输和安全参数，兼容条件会有哪些变化？', slug: 'transport-security-fields' },
              { id: 'H05-S2-C1-A4', title: '订阅转换能改变格式但不一定改变能力，选择服务时怎样理解？', slug: 'conversion-limit-selection' }
            ]
          },
          {
            id: 'H05-S2-C2',
            name: '直连、中转与专线声明',
            slug: 'lines',
            articles: [
              { id: 'H05-S2-C2-A1', title: '机场标注直连、中转或专线时，用户应该追问哪些具体条件？', slug: 'line-label-questions' },
              { id: 'H05-S2-C2-A2', title: 'IPLC与IEPL相关宣传该怎样核对来源，而不只比较标签？', slug: 'iplc-iepl-evidence' },
              { id: 'H05-S2-C2-A3', title: '入口线路、出口地区和节点名称怎样区分，为什么不能互相替代？', slug: 'line-versus-exit-region' },
              { id: 'H05-S2-C2-A4', title: '服务宣传的带宽上限与用户能获得的速度是什么关系？', slug: 'marketing-bandwidth-limit' }
            ]
          },
          {
            id: 'H05-S2-C3',
            name: '出口地址与地区资料',
            slug: 'address-types',
            articles: [
              { id: 'H05-S2-C3-A1', title: '共享出口和独立出口怎样比较适用场景与限制？', slug: 'shared-dedicated-exit' },
              { id: 'H05-S2-C3-A2', title: '住宅、机房与原生IP标签来自哪里，选择服务时怎样审查依据？', slug: 'residential-hosting-labels' },
              { id: 'H05-S2-C3-A3', title: '节点地区与IP查询城市不一致时，哪些结论不能直接下？', slug: 'country-city-accuracy' },
              { id: 'H05-S2-C3-A4', title: '服务支持IPv6究竟指什么，如何要求给出可验证的说明？', slug: 'ipv6-delivery-conditions' }
            ]
          },
          {
            id: 'H05-S2-C4',
            name: '服务条款与支持边界',
            slug: 'commercial-boundaries',
            articles: [
              { id: 'H05-S2-C4-A1', title: '不限设备、同时连接和共享账户分别指什么，怎么核对？', slug: 'unlimited-device-meaning' },
              { id: 'H05-S2-C4-A2', title: '不限时流量包并不等于无限期保障，购买前需要看哪些规则？', slug: 'unlimited-time-conditions' },
              { id: 'H05-S2-C4-A3', title: '客服在线时间、响应承诺和服务可用承诺怎样分别理解？', slug: 'support-sla-claims' },
              { id: 'H05-S2-C4-A4', title: '服务停用、规则变更或账户关闭时，购买前应看哪些公开条款？', slug: 'service-end-conditions' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'H06',
    name: '选型检查',
    slug: 'checklist',
    subs: [
      {
        id: 'H06-S1',
        name: '购买前证据与条件检查',
        slug: 'before-buying',
        clusters: [
          {
            id: 'H06-S1-C1',
            name: '身份与入口检查',
            slug: 'identity',
            articles: [
              { id: 'H06-S1-C1-A1', title: '付款前怎样确认当前页面与服务公开渠道属于同一品牌？', slug: 'prebuy-domain-check' },
              { id: 'H06-S1-C1-A2', title: '软件下载页的发行者与机场品牌不同，购买前应怎样核对关系？', slug: 'prebuy-publisher-check' },
              { id: 'H06-S1-C1-A3', title: '购买前如何确认客服、公告与帮助渠道确实可访问？', slug: 'prebuy-contact-check' },
              { id: 'H06-S1-C1-A4', title: '官网、推广页与评测页信息冲突时，怎样记录并请求确认？', slug: 'prebuy-source-conflict' }
            ]
          },
          {
            id: 'H06-S1-C2',
            name: '订单与费用检查',
            slug: 'order-terms',
            articles: [
              { id: 'H06-S1-C2-A1', title: '结算页面的实付金额应怎样与宣传价格逐项核对？', slug: 'checkout-total' },
              { id: 'H06-S1-C2-A2', title: '付款周期、自动续费和下一次扣费日期怎样一起检查？', slug: 'checkout-cycle' },
              { id: 'H06-S1-C2-A3', title: '下单前怎样核对流量额度、倍率、重置和有效期？', slug: 'checkout-quota' },
              { id: 'H06-S1-C2-A4', title: '优惠码显示有效之后，还要核对哪些套餐和用户资格条件？', slug: 'checkout-coupon' }
            ]
          },
          {
            id: 'H06-S1-C3',
            name: '设备与能力检查',
            slug: 'capability',
            articles: [
              { id: 'H06-S1-C3-A1', title: '怎样制作购买前客户端兼容表：系统、核心、格式与版本', slug: 'prebuy-compatibility-table' },
              { id: 'H06-S1-C3-A2', title: '服务声称支持AI或视频时，购买前应要求明确哪些功能？', slug: 'prebuy-task-claims' },
              { id: 'H06-S1-C3-A3', title: '准备多设备或多人使用，怎样核对允许的使用规则？', slug: 'prebuy-sharing-policy' },
              { id: 'H06-S1-C3-A4', title: '购买前怎样确认客户端可以获取、安装并获得必要权限？', slug: 'prebuy-download-access' }
            ]
          },
          {
            id: 'H06-S1-C4',
            name: '承诺与退出检查',
            slug: 'commitment',
            articles: [
              { id: 'H06-S1-C4-A1', title: '退款与试用承诺在什么位置核对，怎样保留当时的公开条件？', slug: 'prebuy-refund-evidence' },
              { id: 'H06-S1-C4-A2', title: '首期优惠结束后，怎样检查续费价格和套餐是否可能变化？', slug: 'prebuy-renewal-change' },
              { id: 'H06-S1-C4-A3', title: '客服会协助哪些设置，购买前怎样确认支持范围？', slug: 'prebuy-support-scope' },
              { id: 'H06-S1-C4-A4', title: '购买前设置哪些停止条件，避免发现不适配仍继续增加投入？', slug: 'prebuy-stop-checklist' }
            ]
          }
        ]
      },
      {
        id: 'H06-S2',
        name: '购买后的任务验收',
        slug: 'acceptance',
        clusters: [
          {
            id: 'H06-S2-C1',
            name: '基础交付验收',
            slug: 'connection',
            articles: [
              { id: 'H06-S2-C1-A1', title: '付款后如何核对订单、套餐激活和订阅交付是否一致？', slug: 'accept-order-delivery' },
              { id: 'H06-S2-C1-A2', title: '订阅成功导入后，怎样检查节点数量、名称与格式是否异常？', slug: 'accept-import' },
              { id: 'H06-S2-C1-A3', title: '首次连接验收应记录哪些环境和成功标志？', slug: 'accept-first-connection' },
              { id: 'H06-S2-C1-A4', title: '关闭客户端后怎样确认普通上网和本地设备访问恢复？', slug: 'accept-disconnect-restore' }
            ]
          },
          {
            id: 'H06-S2-C2',
            name: '应用任务验收',
            slug: 'application',
            articles: [
              { id: 'H06-S2-C2-A1', title: '网页能打开之外，怎样验收登录、内容加载和实际操作？', slug: 'accept-web-task' },
              { id: 'H06-S2-C2-A2', title: 'AI任务验收怎样区分账号权限、API额度和网络可达性？', slug: 'accept-ai-task' },
              { id: 'H06-S2-C2-A3', title: '视频服务验收怎样记录会员条件、设备、画质与连续播放？', slug: 'accept-video-task' },
              { id: 'H06-S2-C2-A4', title: '开发工具验收怎样分别测试仓库、依赖下载和API请求？', slug: 'accept-development-task' }
            ]
          },
          {
            id: 'H06-S2-C3',
            name: '使用质量记录',
            slug: 'measurement',
            articles: [
              { id: 'H06-S2-C3-A1', title: '验收测速前如何建立本地网络与设备基线？', slug: 'accept-measurement-baseline' },
              { id: 'H06-S2-C3-A2', title: '购买后如何安排不同时间段的体验记录，而非只测一次？', slug: 'accept-time-samples' },
              { id: 'H06-S2-C3-A3', title: '怎样比较实际任务流量与服务后台扣量记录？', slug: 'accept-usage-meter' },
              { id: 'H06-S2-C3-A4', title: '连接成功率和任务成功率怎么分别记录样本与失败？', slug: 'accept-failure-denominator' }
            ]
          },
          {
            id: 'H06-S2-C4',
            name: '验收结论与后续决定',
            slug: 'decision-record',
            articles: [
              { id: 'H06-S2-C4-A1', title: '怎样汇总购买验收结果，区分已确认、未测与不符合条件？', slug: 'accept-evidence-summary' },
              { id: 'H06-S2-C4-A2', title: '验收发现问题后，怎样整理脱敏资料向服务方反馈？', slug: 'accept-support-ticket' },
              { id: 'H06-S2-C4-A3', title: '服务方调整节点或配置后，怎样复测而不混用旧结果？', slug: 'accept-retake' },
              { id: 'H06-S2-C4-A4', title: '试用或首期结束时，怎样依据验收结果决定保留、升级或退出？', slug: 'accept-keep-or-exit' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'H07',
    name: '免费试用',
    slug: 'free-trial',
    subs: [
      {
        id: 'H07-S1',
        name: '免费类型与领取资格',
        slug: 'eligibility',
        clusters: [
          {
            id: 'H07-S1-C1',
            name: '免费形态辨认',
            slug: 'free-types',
            articles: [
              { id: 'H07-S1-C1-A1', title: '客户端免费与网络服务免费有何区别，领取前怎样分清？', slug: 'free-software-service' },
              { id: 'H07-S1-C1-A2', title: '免费试用和付费后申请退款有什么不同？', slug: 'trial-refund-difference' },
              { id: 'H07-S1-C1-A3', title: '注册赠送流量与长期免费额度怎样区分？', slug: 'gift-versus-recurring' },
              { id: 'H07-S1-C1-A4', title: '公益资源标注免费时，仍然需要确认哪些使用条件？', slug: 'public-resource-terms' }
            ]
          },
          {
            id: 'H07-S1-C2',
            name: '来源和领取渠道',
            slug: 'source-check',
            articles: [
              { id: 'H07-S1-C2-A1', title: '怎样从服务公开渠道确认一项免费试用确实存在？', slug: 'trial-official-source' },
              { id: 'H07-S1-C2-A2', title: '群聊转发的免费订阅链接，使用前怎样检查来源与授权？', slug: 'trial-forwarded-link' },
              { id: 'H07-S1-C2-A3', title: '找到旧试用文章时，怎样核对领取活动是否已经结束？', slug: 'trial-expired-promotion' },
              { id: 'H07-S1-C2-A4', title: '同名网站都声称有免费试用，怎样区分运营方和资料来源？', slug: 'trial-same-name' }
            ]
          },
          {
            id: 'H07-S1-C3',
            name: '账号与付款前提',
            slug: 'requirements',
            articles: [
              { id: 'H07-S1-C3-A1', title: '新用户、老用户和指定套餐的试用资格怎样核对？', slug: 'trial-user-eligibility' },
              { id: 'H07-S1-C3-A2', title: '免费体验要求绑定付款方式时，需要先确认哪些费用条件？', slug: 'trial-payment-method' },
              { id: 'H07-S1-C3-A3', title: '试用的设备和同时连接限制，会怎样影响体验安排？', slug: 'trial-device-limits' },
              { id: 'H07-S1-C3-A4', title: '领取体验需要填写个人资料时，怎样判断必要性和信任范围？', slug: 'trial-personal-data' }
            ]
          },
          {
            id: 'H07-S1-C4',
            name: '额度、时间与激活',
            slug: 'quota-clock',
            articles: [
              { id: 'H07-S1-C4-A1', title: '试用从注册、领取还是首次连接开始计时，怎样核对？', slug: 'trial-clock-start' },
              { id: 'H07-S1-C4-A2', title: '试用流量很少时，怎样按优先级安排验证任务？', slug: 'trial-small-quota' },
              { id: 'H07-S1-C4-A3', title: '试用的限速和功能限制，哪些不能直接推断为正式套餐表现？', slug: 'trial-rate-limits' },
              { id: 'H07-S1-C4-A4', title: '赠送额度、正式额度和到期清零规则怎样分别查看？', slug: 'trial-carryover' }
            ]
          }
        ]
      },
      {
        id: 'H07-S2',
        name: '体验过程与退出决策',
        slug: 'evaluation',
        clusters: [
          {
            id: 'H07-S2-C1',
            name: '体验准备与安全接入',
            slug: 'trial-setup',
            articles: [
              { id: 'H07-S2-C1-A1', title: '导入试用配置前，怎样备份现有设置并避免覆盖主用配置？', slug: 'trial-before-import' },
              { id: 'H07-S2-C1-A2', title: '试用只提供一种订阅格式时，怎样选择适配客户端？', slug: 'trial-compatible-client' },
              { id: 'H07-S2-C1-A3', title: '同时比较多项试用，怎样命名配置并记录各自条件？', slug: 'trial-isolated-labels' },
              { id: 'H07-S2-C1-A4', title: '分享试用经验时，怎样避免公开有效订阅和访问凭据？', slug: 'trial-share-results' }
            ]
          },
          {
            id: 'H07-S2-C2',
            name: '体验记录与结论边界',
            slug: 'trial-results',
            articles: [
              { id: 'H07-S2-C2-A1', title: '一份可复查的免费体验记录应包含哪些环境字段？', slug: 'trial-environment-record' },
              { id: 'H07-S2-C2-A2', title: '短期试用怎样覆盖主要任务，而不声称证明了长期稳定？', slug: 'trial-task-sampling' },
              { id: 'H07-S2-C2-A3', title: '某个功能没通过体验，怎样区分未开放、配置错误与服务问题？', slug: 'trial-missing-functions' },
              { id: 'H07-S2-C2-A4', title: '怎样把主观体验和实际测量分开写进试用报告？', slug: 'trial-subjective-objective' }
            ]
          },
          {
            id: 'H07-S2-C3',
            name: '到期、取消与凭据撤销',
            slug: 'trial-exit',
            articles: [
              { id: 'H07-S2-C3-A1', title: '试用结束前应检查续费、配置和剩余额度的哪些事项？', slug: 'trial-end-check' },
              { id: 'H07-S2-C3-A2', title: '怎样确认已取消试用或自动续费，并保存必要记录？', slug: 'trial-cancel-proof' },
              { id: 'H07-S2-C3-A3', title: '不继续使用免费资源时，怎样清理客户端配置和授权？', slug: 'trial-remove-profile' },
              { id: 'H07-S2-C3-A4', title: '试用链接意外公开后，怎样撤销或更换凭据？', slug: 'trial-link-leak' }
            ]
          },
          {
            id: 'H07-S2-C4',
            name: '失效与付费判断',
            slug: 'trial-transition',
            articles: [
              { id: 'H07-S2-C4-A1', title: '免费资源无法连接时，怎样区分过期、额度用尽和临时故障？', slug: 'trial-unavailable-status' },
              { id: 'H07-S2-C4-A2', title: '免费政策变化后，资源页应怎样标记旧条件和当前状态？', slug: 'trial-policy-update' },
              { id: 'H07-S2-C4-A3', title: '免费方案已经够用时，怎样判断有没有必要升级？', slug: 'trial-upgrade-decision' },
              { id: 'H07-S2-C4-A4', title: '试用满意后选择正式套餐，还需要重新核对哪些条件？', slug: 'trial-main-plan-compare' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'H08',
    name: '品牌数据库',
    slug: 'brands',
    subs: [
      {
        id: 'H08-S1',
        name: '品牌身份与渠道关系',
        slug: 'identity',
        clusters: [
          {
            id: 'H08-S1-C1',
            name: '名称、别名与重名',
            slug: 'names',
            articles: [
              { id: 'H08-S1-C1-A1', title: '机场品牌名称、英文名和简称怎样建立统一档案？', slug: 'brand-standard-name' },
              { id: 'H08-S1-C1-A2', title: '两个同名机场是否属于同一服务，应该比较哪些公开线索？', slug: 'brand-same-name' },
              { id: 'H08-S1-C1-A3', title: '一个品牌提供多个产品或站点时，怎样区分服务范围？', slug: 'brand-product-lines' },
              { id: 'H08-S1-C1-A4', title: '服务改名后怎样维护新旧名称，避免用户误认成另一个品牌？', slug: 'brand-renaming-record' }
            ]
          },
          {
            id: 'H08-S1-C2',
            name: '官网与公开渠道',
            slug: 'official-entry',
            articles: [
              { id: 'H08-S1-C2-A1', title: '品牌官网核验应保留哪些来源，而不是只看页面写着官网？', slug: 'brand-official-evidence' },
              { id: 'H08-S1-C2-A2', title: '公告、客服和官网地址怎样交叉核对？', slug: 'brand-channel-crosscheck' },
              { id: 'H08-S1-C2-A3', title: '推广域名、登录域名和主官网不同，资料页应该怎样说明？', slug: 'brand-referral-domains' },
              { id: 'H08-S1-C2-A4', title: '暂时无法确认品牌入口时，资料库应如何展示而不误导付款？', slug: 'brand-unverified-entry' }
            ]
          },
          {
            id: 'H08-S1-C3',
            name: '服务方、发行者与支持者',
            slug: 'operators',
            articles: [
              { id: 'H08-S1-C3-A1', title: '客户端开发者和机场运营者不同时，用户应该在哪里寻求帮助？', slug: 'brand-client-developer' },
              { id: 'H08-S1-C3-A2', title: '品牌自称有官方客户端时，怎样核对发行渠道与软件身份？', slug: 'brand-official-app' },
              { id: 'H08-S1-C3-A3', title: '代理销售、推荐站和服务运营方怎样在资料库中分别标注？', slug: 'brand-reseller-roles' },
              { id: 'H08-S1-C3-A4', title: '品牌支持渠道的用途、开放时间和核验状态如何记录？', slug: 'brand-support-channels' }
            ]
          },
          {
            id: 'H08-S1-C4',
            name: '域名变更与历史记录',
            slug: 'historical-domains',
            articles: [
              { id: 'H08-S1-C4-A1', title: '品牌宣布换域时，怎样留存公告与当前入口关系？', slug: 'brand-domain-announcement' },
              { id: 'H08-S1-C4-A2', title: '旧官网失效后，品牌档案如何保留历史信息并避免误导点击？', slug: 'brand-old-domain-status' },
              { id: 'H08-S1-C4-A3', title: '多个镜像入口是否可信，为什么需要分别记录核验结果？', slug: 'brand-mirror-claims' },
              { id: 'H08-S1-C4-A4', title: '曾经停用的域名重新出现内容，怎样核对是否仍属原品牌？', slug: 'brand-returned-domain' }
            ]
          }
        ]
      },
      {
        id: 'H08-S2',
        name: '套餐资料、证据与变更维护',
        slug: 'records',
        clusters: [
          {
            id: 'H08-S2-C1',
            name: '当前套餐字段',
            slug: 'plan-records',
            articles: [
              { id: 'H08-S2-C1-A1', title: '完整机场套餐档案应包含哪些价格、流量和限制字段？', slug: 'brand-plan-fields' },
              { id: 'H08-S2-C1-A2', title: '同名套餐不同付款周期，资料库应怎样避免混成一条价格？', slug: 'brand-plan-periods' },
              { id: 'H08-S2-C1-A3', title: '多币种价格与换算展示，怎样区分实际收款和参考金额？', slug: 'brand-plan-currency' },
              { id: 'H08-S2-C1-A4', title: '套餐资料缺少倍率或续费条件时，应如何标记未知项？', slug: 'brand-plan-unknown' }
            ]
          },
          {
            id: 'H08-S2-C2',
            name: '能力声明与可用证据',
            slug: 'claims',
            articles: [
              { id: 'H08-S2-C2-A1', title: '服务协议支持声明应怎样关联官方资料、版本和核验日期？', slug: 'brand-protocol-claims' },
              { id: 'H08-S2-C2-A2', title: '线路和节点数量宣传，怎样分别记录原始说法与可观察信息？', slug: 'brand-network-claims' },
              { id: 'H08-S2-C2-A3', title: '品牌宣称支持某平台时，资料库怎样细化功能和测试条件？', slug: 'brand-app-claims' },
              { id: 'H08-S2-C2-A4', title: '转载测速结果时，怎样标记来源而不冒称本站测试？', slug: 'brand-test-origin' }
            ]
          },
          {
            id: 'H08-S2-C3',
            name: '价格、权益与状态变化',
            slug: 'history',
            articles: [
              { id: 'H08-S2-C3-A1', title: '价格变更记录怎样区分新购价、续费价和历史活动价？', slug: 'brand-price-history' },
              { id: 'H08-S2-C3-A2', title: '服务条款调整后，怎样记录生效时间与受影响的套餐？', slug: 'brand-terms-history' },
              { id: 'H08-S2-C3-A3', title: '品牌客户端升级和服务节点调整，应该分别保存哪些记录？', slug: 'brand-version-history' },
              { id: 'H08-S2-C3-A4', title: '官网打不开是否代表停止运营，状态记录应保留哪些证据边界？', slug: 'brand-status-evidence' }
            ]
          },
          {
            id: 'H08-S2-C4',
            name: '资料纠错与商业披露',
            slug: 'corrections',
            articles: [
              { id: 'H08-S2-C4-A1', title: '用户报告品牌资料错误后，怎样核验并公开更正？', slug: 'brand-correction-workflow' },
              { id: 'H08-S2-C4-A2', title: '品牌档案包含推广链接时，怎样区分事实字段与商业展示？', slug: 'brand-review-neutrality' },
              { id: 'H08-S2-C4-A3', title: '来源失效或信息过时后，资料库应该如何更新引用？', slug: 'brand-source-expiry' },
              { id: 'H08-S2-C4-A4', title: '分站品牌档案链接主站评测时，怎样说明同一运营关系和证据来源？', slug: 'brand-main-site-link' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'H09',
    name: '客户端下载',
    slug: 'clients',
    subs: [
      {
        id: 'H09-S1',
        name: '系统与安装包选择',
        slug: 'platforms',
        clusters: [
          {
            id: 'H09-S1-C1',
            name: 'Windows下载资料',
            slug: 'windows-packages',
            articles: [
              { id: 'H09-S1-C1-A1', title: 'Windows代理客户端安装版和便携版怎样选择？', slug: 'windows-installer-portable' },
              { id: 'H09-S1-C1-A2', title: '含运行库版与精简版安装包分别适合什么环境？', slug: 'windows-runtime-bundles' },
              { id: 'H09-S1-C1-A3', title: '下载Windows客户端后，怎样核对发行者、签名和发布记录？', slug: 'windows-signature-check' },
              { id: 'H09-S1-C1-A4', title: '需要旧版Windows兼容包时，怎样找到可核对的历史发布来源？', slug: 'windows-older-builds' }
            ]
          },
          {
            id: 'H09-S1-C2',
            name: 'Android下载资料',
            slug: 'android-packages',
            articles: [
              { id: 'H09-S1-C2-A1', title: 'Android客户端从应用商店和官方APK获取有什么维护差别？', slug: 'android-store-apk' },
              { id: 'H09-S1-C2-A2', title: 'Android下载页面提供多个架构包时，怎样核对设备适配？', slug: 'android-abi-choice' },
              { id: 'H09-S1-C2-A3', title: '同名或分支Android客户端怎样核对包名、发行者和来源？', slug: 'android-fork-identity' },
              { id: 'H09-S1-C2-A4', title: '手动安装的Android客户端，后续更新来源应如何维护？', slug: 'android-package-update' }
            ]
          },
          {
            id: 'H09-S1-C3',
            name: '苹果平台下载资料',
            slug: 'apple-packages',
            articles: [
              { id: 'H09-S1-C3-A1', title: 'iPhone客户端商店条目应该核对哪些开发者和收费信息？', slug: 'ios-store-identity' },
              { id: 'H09-S1-C3-A2', title: 'macOS发布页提供不同芯片安装包时，怎样选择正确文件？', slug: 'mac-release-packages' },
              { id: 'H09-S1-C3-A3', title: '苹果客户端稳定版与测试分发版本，选择时有哪些维护条件？', slug: 'apple-beta-stable' },
              { id: 'H09-S1-C3-A4', title: '应用商店地区和可获取状态变化时，下载资料页怎样记录？', slug: 'apple-availability-record' }
            ]
          },
          {
            id: 'H09-S1-C4',
            name: 'Linux与网络设备资料',
            slug: 'linux-router-packages',
            articles: [
              { id: 'H09-S1-C4-A1', title: 'Linux客户端的安装包、仓库和官方发布来源怎样区分？', slug: 'linux-package-source' },
              { id: 'H09-S1-C4-A2', title: '软路由插件下载前，如何核对固件与CPU架构？', slug: 'router-architecture-package' },
              { id: 'H09-S1-C4-A3', title: '命令行核心与图形客户端分别下载什么，怎样避免装错对象？', slug: 'linux-core-gui' },
              { id: 'H09-S1-C4-A4', title: '第三方插件与核心项目有何关系，下载页应怎样标明来源？', slug: 'router-third-party-package' }
            ]
          }
        ]
      },
      {
        id: 'H09-S2',
        name: '软件家族、版本与来源核验',
        slug: 'projects',
        clusters: [
          {
            id: 'H09-S2-C1',
            name: 'Clash与Mihomo家族资料',
            slug: 'mihomo-apps',
            articles: [
              { id: 'H09-S2-C1-A1', title: 'Clash Verge Rev发布页怎样阅读：版本、安装包与更新说明', slug: 'verge-rev-official-release' },
              { id: 'H09-S2-C1-A2', title: 'FlClash软件档案怎样核对平台覆盖、发行者与版本来源？', slug: 'flclash-project-record' },
              { id: 'H09-S2-C1-A3', title: 'Clash相关客户端名称相近，怎样判断项目、分支和维护状态？', slug: 'clash-fork-history' },
              { id: 'H09-S2-C1-A4', title: 'Mihomo核心版本与图形客户端版本怎样分别记录？', slug: 'mihomo-core-app-versions' }
            ]
          },
          {
            id: 'H09-S2-C2',
            name: 'v2rayN与v2rayNG资料',
            slug: 'xray-apps',
            articles: [
              { id: 'H09-S2-C2-A1', title: 'v2rayN发布文件怎样选择：系统、运行库与核心资料核对', slug: 'v2rayn-release-assets' },
              { id: 'H09-S2-C2-A2', title: 'v2rayNG官方下载渠道与版本记录怎样核对？', slug: 'v2rayng-release-source' },
              { id: 'H09-S2-C2-A3', title: '客户端自带核心与自行更新核心，下载资料应说明什么？', slug: 'xray-core-shipping' },
              { id: 'H09-S2-C2-A4', title: 'v2rayN不同版本的配置变化，下载前如何查看迁移说明？', slug: 'v2rayn-branch-compatibility' }
            ]
          },
          {
            id: 'H09-S2-C3',
            name: 'sing-box与跨平台资料',
            slug: 'singbox-apps',
            articles: [
              { id: 'H09-S2-C3-A1', title: 'sing-box核心发行包怎样按系统和架构选择？', slug: 'singbox-official-builds' },
              { id: 'H09-S2-C3-A2', title: 'Hiddify客户端的发行版本、平台与核心资料如何核对？', slug: 'hiddify-release-record' },
              { id: 'H09-S2-C3-A3', title: '使用sing-box的不同客户端，为什么需要分别核验项目身份？', slug: 'singbox-client-identity' },
              { id: 'H09-S2-C3-A4', title: '下载sing-box相关软件时，怎样同时检查配置格式版本？', slug: 'singbox-config-release-match' }
            ]
          },
          {
            id: 'H09-S2-C4',
            name: '安全下载与资料维护',
            slug: 'source-safety',
            articles: [
              { id: 'H09-S2-C4-A1', title: '安装包校验值怎样使用，为什么校验来源也需要核对？', slug: 'checksum-source-trust' },
              { id: 'H09-S2-C4-A2', title: '官方安装包链接失效后，下载页面应该怎样引导用户？', slug: 'download-link-expiry' },
              { id: 'H09-S2-C4-A3', title: '第三方网站提供重打包客户端时，下载资料库应如何处理？', slug: 'download-no-repack' },
              { id: 'H09-S2-C4-A4', title: '怎样建立客户端下载核验记录，区分访问成功与软件安全结论？', slug: 'download-verification-log' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'H10',
    name: '使用教程',
    slug: 'guides',
    subs: [
      {
        id: 'H10-S1',
        name: '从安装到首次任务完成',
        slug: 'first-connection',
        clusters: [
          {
            id: 'H10-S1-C1',
            name: '安装与首次启动',
            slug: 'install',
            articles: [
              { id: 'H10-S1-C1-A1', title: 'Clash Verge Rev安装到首次启动：前提、权限与完成检查', slug: 'guide-install-verge-rev' },
              { id: 'H10-S1-C1-A2', title: 'v2rayN初次安装怎样核对运行环境、核心和基础启动？', slug: 'guide-install-v2rayn' },
              { id: 'H10-S1-C1-A3', title: '手机通用代理客户端首次安装后，应按什么顺序核对系统授权？', slug: 'guide-install-mobile' },
              { id: 'H10-S1-C1-A4', title: '首次安装后决定不使用，怎样卸载并恢复原有网络设置？', slug: 'guide-uninstall-restore' }
            ]
          },
          {
            id: 'H10-S1-C2',
            name: '导入订阅与节点',
            slug: 'import',
            articles: [
              { id: 'H10-S1-C2-A1', title: '拿到订阅链接后，怎样完成识别、导入和内容核对？', slug: 'guide-subscription-import' },
              { id: 'H10-S1-C2-A2', title: '只有单个节点链接时，如何确认客户端支持并完成导入？', slug: 'guide-node-uri-import' },
              { id: 'H10-S1-C2-A3', title: '导入本地配置文件前后，应检查哪些来源和格式信息？', slug: 'guide-file-import' },
              { id: 'H10-S1-C2-A4', title: '通过二维码导入配置时，怎样保护凭据并核对识别结果？', slug: 'guide-qr-import' }
            ]
          },
          {
            id: 'H10-S1-C3',
            name: '最小配置与首次连接',
            slug: 'initial-config',
            articles: [
              { id: 'H10-S1-C3-A1', title: '如何保留最小可用配置，先验证连接再增加高级功能？', slug: 'guide-minimal-profile' },
              { id: 'H10-S1-C3-A2', title: '多个配置和节点同时存在时，怎样确认当前实际使用的是哪一个？', slug: 'guide-select-profile-node' },
              { id: 'H10-S1-C3-A3', title: '第一次启用系统代理，怎样检查适用应用并保留还原办法？', slug: 'guide-system-proxy-start' },
              { id: 'H10-S1-C3-A4', title: '第一次配置TUN前，应完成哪些权限、路由和本地网络检查？', slug: 'guide-tun-first-use' }
            ]
          },
          {
            id: 'H10-S1-C4',
            name: '任务验收与结果记录',
            slug: 'verify',
            articles: [
              { id: 'H10-S1-C4-A1', title: '怎样用公开请求结果核对当前浏览器连接路径？', slug: 'guide-public-request-check' },
              { id: 'H10-S1-C4-A2', title: '怎样从网页连通继续验证实际应用任务是否完成？', slug: 'guide-app-completion' },
              { id: 'H10-S1-C4-A3', title: '配置后如何确认打印机、路由器管理页和NAS仍可访问？', slug: 'guide-local-network-check' },
              { id: 'H10-S1-C4-A4', title: '完成首次使用后，怎样保存不包含秘密的配置与验证摘要？', slug: 'guide-session-report' }
            ]
          }
        ]
      },
      {
        id: 'H10-S2',
        name: '日常配置与生命周期管理',
        slug: 'maintenance',
        clusters: [
          {
            id: 'H10-S2-C1',
            name: '订阅更新与配置保护',
            slug: 'subscription-updates',
            articles: [
              { id: 'H10-S2-C1-A1', title: '怎样更新订阅并核对更新前后的节点和字段变化？', slug: 'guide-update-subscription' },
              { id: 'H10-S2-C1-A2', title: '订阅自动更新时，怎样保护需要保留的自定义设置？', slug: 'guide-protect-overrides' },
              { id: 'H10-S2-C1-A3', title: '管理多个机场订阅时，怎样安排命名、更新和默认配置？', slug: 'guide-multi-subscriptions' },
              { id: 'H10-S2-C1-A4', title: '订阅过期或更换链接后，怎样清理旧配置并验证新资料？', slug: 'guide-expired-subscription' }
            ]
          },
          {
            id: 'H10-S2-C2',
            name: '规则与应用接入',
            slug: 'routing-rules',
            articles: [
              { id: 'H10-S2-C2-A1', title: '添加分流规则前，怎样阅读匹配顺序并验证命中结果？', slug: 'guide-rule-order' },
              { id: 'H10-S2-C2-A2', title: '手动选择、自动选择和故障切换策略组怎样按任务使用？', slug: 'guide-policy-groups' },
              { id: 'H10-S2-C2-A3', title: '怎样分别配置浏览器与终端，而不假设两者共用所有设置？', slug: 'guide-browser-terminal' },
              { id: 'H10-S2-C2-A4', title: '调整DNS策略时，怎样记录原配置、检查结果并安全回退？', slug: 'guide-dns-change' }
            ]
          },
          {
            id: 'H10-S2-C3',
            name: '用量、设备与续费操作',
            slug: 'billing-management',
            articles: [
              { id: 'H10-S2-C3-A1', title: '怎样核对客户端用量、服务后台额度与流量重置时间？', slug: 'guide-usage-check' },
              { id: 'H10-S2-C3-A2', title: '给第二台设备配置已有服务，应怎样检查授权和连接限制？', slug: 'guide-second-device' },
              { id: 'H10-S2-C3-A3', title: '升级套餐前后怎样核对生效时间、补差金额和剩余额度？', slug: 'guide-plan-upgrade' },
              { id: 'H10-S2-C3-A4', title: '怎样确认服务的自动续费设置和取消结果？', slug: 'guide-renewal-disable' }
            ]
          },
          {
            id: 'H10-S2-C4',
            name: '备份、升级与迁移',
            slug: 'backup-migration',
            articles: [
              { id: 'H10-S2-C4-A1', title: '配置备份应包含哪些文件，怎样加密保存敏感部分？', slug: 'guide-config-backup' },
              { id: 'H10-S2-C4-A2', title: '客户端升级前后如何检查配置兼容，并准备旧版恢复？', slug: 'guide-client-upgrade' },
              { id: 'H10-S2-C4-A3', title: '更换服务时怎样保留通用规则，同时替换旧订阅凭据？', slug: 'guide-service-move' },
              { id: 'H10-S2-C4-A4', title: '设备转让或停用前，怎样清理网络配置、账号和访问资料？', slug: 'guide-device-retirement' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'H11',
    name: '网络排障',
    slug: 'troubleshooting',
    subs: [
      {
        id: 'H11-S1',
        name: '启动、订阅与节点连接错误',
        slug: 'connection-errors',
        clusters: [
          {
            id: 'H11-S1-C1',
            name: '客户端启动与进程异常',
            slug: 'startup',
            articles: [
              { id: 'H11-S1-C1-A1', title: '代理客户端启动后没有窗口，怎样区分进程、权限和界面问题？', slug: 'error-wont-start' },
              { id: 'H11-S1-C1-A2', title: '提示端口已被占用时，怎样定位占用进程而不盲目结束系统服务？', slug: 'error-port-in-use' },
              { id: 'H11-S1-C1-A3', title: '客户端提示缺少运行环境，怎样根据版本文档核对依赖？', slug: 'error-runtime' },
              { id: 'H11-S1-C1-A4', title: '更新客户端后崩溃，怎样保留证据并回退验证？', slug: 'error-upgrade-crash' }
            ]
          },
          {
            id: 'H11-S1-C2',
            name: '订阅请求与返回错误',
            slug: 'subscription-fetch',
            articles: [
              { id: 'H11-S1-C2-A1', title: '订阅返回401、403或其他HTTP错误时，怎样区分可能的失败阶段？', slug: 'error-subscription-http' },
              { id: 'H11-S1-C2-A2', title: '订阅更新请求超时，应该怎样检查网络路径、地址和代理设置？', slug: 'error-fetch-timeout' },
              { id: 'H11-S1-C2-A3', title: '浏览器能获取订阅但客户端不能更新，应该比较哪些请求条件？', slug: 'error-browser-client-fetch' },
              { id: 'H11-S1-C2-A4', title: '订阅更新返回空内容或登录页面，怎样判断并非有效配置？', slug: 'error-subscription-empty' }
            ]
          },
          {
            id: 'H11-S1-C3',
            name: '内容解析与版本不匹配',
            slug: 'parsing',
            articles: [
              { id: 'H11-S1-C3-A1', title: 'Clash配置出现YAML解析错误时，怎样定位结构和缩进问题？', slug: 'error-yaml-indent' },
              { id: 'H11-S1-C3-A2', title: '核心提示未知字段或不支持参数，怎样核对配置与版本？', slug: 'error-unknown-field' },
              { id: 'H11-S1-C3-A3', title: '订阅导入完成但没有节点，怎样检查资源类型与过滤条件？', slug: 'error-import-zero-nodes' },
              { id: 'H11-S1-C3-A4', title: 'sing-box配置加载失败时，怎样根据具体错误检查结构和迁移要求？', slug: 'error-json-schema' }
            ]
          },
          {
            id: 'H11-S1-C4',
            name: '节点连通、认证与握手',
            slug: 'node-connection',
            articles: [
              { id: 'H11-S1-C4-A1', title: '所有节点都超时，怎样先检查本地网络与客户端接管？', slug: 'error-all-timeout' },
              { id: 'H11-S1-C4-A2', title: '只有部分节点连接失败，怎样对比地区、协议和失败时段？', slug: 'error-some-timeout' },
              { id: 'H11-S1-C4-A3', title: '节点认证失败时，怎样核对凭据、有效期和服务端条件？', slug: 'error-authentication' },
              { id: 'H11-S1-C4-A4', title: 'TLS握手报错应怎样区分时间、主机名、证书与连接路径？', slug: 'error-tls-handshake' }
            ]
          }
        ]
      },
      {
        id: 'H11-S2',
        name: '已连接后的范围与质量异常',
        slug: 'runtime-errors',
        clusters: [
          {
            id: 'H11-S2-C1',
            name: 'DNS、TUN与路由冲突',
            slug: 'dns-tun',
            articles: [
              { id: 'H11-S2-C1-A1', title: '域名解析失败时，怎样区分缓存、解析器和代理连接问题？', slug: 'error-dns-cache' },
              { id: 'H11-S2-C1-A2', title: 'TUN无法启动时，怎样检查虚拟网卡、权限与现有驱动？', slug: 'error-tun-permission' },
              { id: 'H11-S2-C1-A3', title: '启用代理后无法访问路由器或NAS，怎样定位本地路由问题？', slug: 'error-local-network' },
              { id: 'H11-S2-C1-A4', title: 'IPv4和IPv6连接结果不同，排查时怎样分别验证地址族路径？', slug: 'error-ipv6-path' }
            ]
          },
          {
            id: 'H11-S2-C2',
            name: 'IP与应用接管异常',
            slug: 'scope',
            articles: [
              { id: 'H11-S2-C2-A1', title: '连接后网页IP没有变化，怎样判断是规则、代理范围还是检测方式？', slug: 'error-ip-unchanged' },
              { id: 'H11-S2-C2-A2', title: '浏览器正常但桌面应用无法使用，怎样核对各自的代理来源？', slug: 'error-browser-only' },
              { id: 'H11-S2-C2-A3', title: '关闭客户端后仍不能上网，怎样查找残留代理或解析设置？', slug: 'error-after-disconnect' },
              { id: 'H11-S2-C2-A4', title: '两款网络工具同时运行造成异常，怎样隔离变量并恢复基线？', slug: 'error-two-vpn-tools' }
            ]
          },
          {
            id: 'H11-S2-C3',
            name: '慢速、掉线与间歇故障',
            slug: 'performance',
            articles: [
              { id: 'H11-S2-C3-A1', title: '代理速度慢时，怎样依次检查本地带宽、设备资源和目标服务？', slug: 'error-speed-drop' },
              { id: 'H11-S2-C3-A2', title: '晚上变慢但白天正常，怎样收集可比较的时段证据？', slug: 'error-evening-slow' },
              { id: 'H11-S2-C3-A3', title: '连接间歇中断时，怎样记录切网、休眠与超时条件？', slug: 'error-intermittent-drop' },
              { id: 'H11-S2-C3-A4', title: '只有一个网站或任务卡顿，怎样避免误判整条服务线路？', slug: 'error-one-site-slow' }
            ]
          },
          {
            id: 'H11-S2-C4',
            name: 'AI、视频与开发工具异常',
            slug: 'application',
            articles: [
              { id: 'H11-S2-C4-A1', title: 'AI工具报错时，怎样区分账户权限、配额和网络连接？', slug: 'error-ai-permission-network' },
              { id: 'H11-S2-C4-A2', title: 'API命令请求失败而网页正常，怎样检查环境变量和认证配置？', slug: 'error-api-proxy-env' },
              { id: 'H11-S2-C4-A3', title: '视频能打开页面却不能播放，怎样分别核对会员、设备与连接？', slug: 'error-stream-playback' },
              { id: 'H11-S2-C4-A4', title: '编辑器插件无法下载或联网时，怎样定位进程环境和请求目标？', slug: 'error-ide-download' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'H12',
    name: '风险提示',
    slug: 'risks',
    subs: [
      {
        id: 'H12-S1',
        name: '购买与安装前的风险判断',
        slug: 'before-use',
        clusters: [
          {
            id: 'H12-S1-C1',
            name: '价格与营销表述',
            slug: 'misleading-sales',
            articles: [
              { id: 'H12-S1-C1-A1', title: '低价宣传没有写付款周期时，怎样避免误解实际支出？', slug: 'risk-low-monthly-banner' },
              { id: 'H12-S1-C1-A2', title: '看到永久稳定、全平台保证等宣传，应怎样核对证据与限制？', slug: 'risk-absolute-promises' },
              { id: 'H12-S1-C1-A3', title: '限时倒计时和稀缺名额影响购买判断时，应该先确认什么？', slug: 'risk-fake-timer' },
              { id: 'H12-S1-C1-A4', title: '推荐站存在商业合作时，读者怎样识别事实、意见和推广关系？', slug: 'risk-review-conflicts' }
            ]
          },
          {
            id: 'H12-S1-C2',
            name: '仿冒入口与软件下载',
            slug: 'impersonation',
            articles: [
              { id: 'H12-S1-C2-A1', title: '域名和品牌名很相似时，怎样识别需要进一步核验的入口？', slug: 'risk-lookalike-domain' },
              { id: 'H12-S1-C2-A2', title: '下载页面有多个按钮时，怎样分清官方安装包、广告与购买入口？', slug: 'risk-download-button' },
              { id: 'H12-S1-C2-A3', title: '客户端安装包来源和签名无法核对，应该如何处理不确定性？', slug: 'risk-unsigned-installer' },
              { id: 'H12-S1-C2-A4', title: '他人提供共享服务账户或订阅时，使用前有哪些权限与凭据问题？', slug: 'risk-shared-accounts' }
            ]
          },
          {
            id: 'H12-S1-C3',
            name: '系统权限与证书',
            slug: 'permissions',
            articles: [
              { id: 'H12-S1-C3-A1', title: '系统VPN授权允许软件做什么，怎样结合用途检查必要性？', slug: 'risk-vpn-permission' },
              { id: 'H12-S1-C3-A2', title: '客户端要求管理员权限时，怎样核对功能需求与官方说明？', slug: 'risk-admin-request' },
              { id: 'H12-S1-C3-A3', title: '不明教程要求安装根证书时，为什么应先确认信任范围与来源？', slug: 'risk-root-certificate' },
              { id: 'H12-S1-C3-A4', title: '遇到安装阻止时，为什么不应把关闭所有安全保护作为默认办法？', slug: 'risk-disable-protection' }
            ]
          },
          {
            id: 'H12-S1-C4',
            name: '付款渠道与记录保护',
            slug: 'payment-records',
            articles: [
              { id: 'H12-S1-C4-A1', title: '结算跳到不同收款页面时，怎样核对订单与服务关系？', slug: 'risk-payment-destination' },
              { id: 'H12-S1-C4-A2', title: '长期预付服务的成本优势和履约不确定性怎样共同评估？', slug: 'risk-prepayment' },
              { id: 'H12-S1-C4-A3', title: '保存付款证据时，怎样遮住不必要的个人和支付资料？', slug: 'risk-order-privacy' },
              { id: 'H12-S1-C4-A4', title: '退款条件表述含糊时，怎样在付款前获取可记录的说明？', slug: 'risk-refund-claims' }
            ]
          }
        ]
      },
      {
        id: 'H12-S2',
        name: '使用期间与退出后的风险管理',
        slug: 'ongoing-use',
        clusters: [
          {
            id: 'H12-S2-C1',
            name: '订阅、日志和配置秘密',
            slug: 'secrets',
            articles: [
              { id: 'H12-S2-C1-A1', title: '为什么订阅链接可能包含访问凭据，分享前应怎样检查？', slug: 'risk-subscription-token' },
              { id: 'H12-S2-C1-A2', title: '配置文件上传到代码仓库或论坛前，需要清理哪些敏感字段？', slug: 'risk-public-config' },
              { id: 'H12-S2-C1-A3', title: '把订阅交给在线转换服务前，怎样评估凭据暴露和信任范围？', slug: 'risk-online-converter' },
              { id: 'H12-S2-C1-A4', title: '客户端日志和截图如何脱敏，保留诊断价值又不泄露秘密？', slug: 'risk-log-sharing' }
            ]
          },
          {
            id: 'H12-S2-C2',
            name: '更新、配置变更与回退',
            slug: 'updates',
            articles: [
              { id: 'H12-S2-C2-A1', title: '收到软件升级提示时，怎样核对实际下载渠道和发布记录？', slug: 'risk-update-provenance' },
              { id: 'H12-S2-C2-A2', title: '远程规则和配置更新会改变哪些行为，用户应该保留什么记录？', slug: 'risk-remote-rules' },
              { id: 'H12-S2-C2-A3', title: '备份里含有订阅与账号资料时，怎样控制存放和读取权限？', slug: 'risk-backup-readability' },
              { id: 'H12-S2-C2-A4', title: '回退旧客户端后，怎样检查配置、凭据和来源是否仍然适用？', slug: 'risk-rollback-validation' }
            ]
          },
          {
            id: 'H12-S2-C3',
            name: '服务异常与状态信息',
            slug: 'service-events',
            articles: [
              { id: 'H12-S2-C3-A1', title: '连接故障和停止运营传言，怎样按证据区分而不是直接下结论？', slug: 'risk-outage-rumor' },
              { id: 'H12-S2-C3-A2', title: '服务换域消息出现时，怎样防止误入仿冒登录入口？', slug: 'risk-domain-change-scam' },
              { id: 'H12-S2-C3-A3', title: '客服要求发送完整订阅或远程控制时，怎样评估必要范围？', slug: 'risk-support-request' },
              { id: 'H12-S2-C3-A4', title: '服务规则突然变化，用户应如何整理影响和可选处理步骤？', slug: 'risk-policy-change' }
            ]
          },
          {
            id: 'H12-S2-C4',
            name: '撤销、退出与纠错',
            slug: 'exit-response',
            articles: [
              { id: 'H12-S2-C4-A1', title: '订阅链接已经泄露，怎样联系服务方撤销并验证旧凭据失效？', slug: 'risk-revoke-exposed-link' },
              { id: 'H12-S2-C4-A2', title: '设备遗失或转让后，怎样逐项检查网络服务的访问授权？', slug: 'risk-device-retirement' },
              { id: 'H12-S2-C4-A3', title: '停用服务时，怎样确认续费、设备配置和账户资料分别处理？', slug: 'risk-account-closure' },
              { id: 'H12-S2-C4-A4', title: '网站曾发布错误服务信息时，应怎样更正而不掩盖影响？', slug: 'risk-correction-publication' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'H13',
    name: '知识百科',
    slug: 'wiki',
    subs: [
      {
        id: 'H13-S1',
        name: '连接、地址与协议基础',
        slug: 'mechanisms',
        clusters: [
          {
            id: 'H13-S1-C1',
            name: '网络角色与请求路径',
            slug: 'roles-topology',
            articles: [
              { id: 'H13-S1-C1-A1', title: '客户端、代理核心与机场服务分别处于连接的哪个环节？', slug: 'wiki-client-core-service' },
              { id: 'H13-S1-C1-A2', title: '代理请求如何经过本地程序和远端服务器，哪些环节需要分别理解？', slug: 'wiki-proxy-server' },
              { id: 'H13-S1-C1-A3', title: '入口、落地、出口与节点名称有什么关系？', slug: 'wiki-entry-exit' },
              { id: 'H13-S1-C1-A4', title: '系统代理、应用代理与虚拟网卡在网络路径上有什么区别？', slug: 'wiki-system-app' }
            ]
          },
          {
            id: 'H13-S1-C2',
            name: 'IP、DNS与地址转换',
            slug: 'ip-dns',
            articles: [
              { id: 'H13-S1-C2-A1', title: '公网IP与私有IP是什么，为什么设备设置和网页查询结果可能不同？', slug: 'wiki-public-private-ip' },
              { id: 'H13-S1-C2-A2', title: 'NAT与CGNAT怎样影响地址共享，为什么公网IP不等于某个用户？', slug: 'wiki-nat-cgnat' },
              { id: 'H13-S1-C2-A3', title: '域名解析、缓存和解析器分别做什么，更新结果为何可能不一致？', slug: 'wiki-dns-cache' },
              { id: 'H13-S1-C2-A4', title: 'IPv4与IPv6怎样共同工作，为什么连接需要分别观察？', slug: 'wiki-ipv4-ipv6' }
            ]
          },
          {
            id: 'H13-S1-C3',
            name: '传输、加密与连接建立',
            slug: 'transport',
            articles: [
              { id: 'H13-S1-C3-A1', title: 'TCP与UDP分别提供什么机制，为什么不能直接等同于快或慢？', slug: 'wiki-tcp-udp' },
              { id: 'H13-S1-C3-A2', title: 'QUIC解决哪些连接问题，和普通UDP流量有什么区别？', slug: 'wiki-quic-purpose' },
              { id: 'H13-S1-C3-A3', title: 'TLS的加密与证书验证分别保护什么，不保护什么？', slug: 'wiki-tls-properties' },
              { id: 'H13-S1-C3-A4', title: '节点协议、传输方式和安全层怎样组合成一条连接？', slug: 'wiki-proxy-layering' }
            ]
          },
          {
            id: 'H13-S1-C4',
            name: '配置、路由与分流机制',
            slug: 'config-semantics',
            articles: [
              { id: 'H13-S1-C4-A1', title: '订阅链接获取的配置资料是什么，为什么更新不只是新增节点？', slug: 'wiki-subscription-document' },
              { id: 'H13-S1-C4-A2', title: '分流规则的顺序与匹配条件怎样决定请求路径？', slug: 'wiki-rules-order' },
              { id: 'H13-S1-C4-A3', title: 'TUN接口与系统路由怎样配合，为什么需要保留本地访问规则？', slug: 'wiki-tun-routing' },
              { id: 'H13-S1-C4-A4', title: 'DNS查询路径与网页请求路径为什么可能不同？', slug: 'wiki-dns-proxy-boundary' }
            ]
          }
        ]
      },
      {
        id: 'H13-S2',
        name: '指标、证据与可靠性解释',
        slug: 'measurement',
        clusters: [
          {
            id: 'H13-S2-C1',
            name: '速度、延迟与抖动',
            slug: 'speed-metrics',
            articles: [
              { id: 'H13-S2-C1-A1', title: '带宽与实际吞吐量有什么区别，测速结果应该怎样读？', slug: 'wiki-bandwidth-throughput' },
              { id: 'H13-S2-C1-A2', title: '平均延迟、中位数和P95分别说明什么，怎样避免只看最低值？', slug: 'wiki-latency-percentiles' },
              { id: 'H13-S2-C1-A3', title: '抖动与丢包是什么，采样方法为何会影响结果解释？', slug: 'wiki-jitter-loss' },
              { id: 'H13-S2-C1-A4', title: 'Mbps、MB/s、GB与GiB怎样区分，比较表应该如何统一单位？', slug: 'wiki-speed-units' }
            ]
          },
          {
            id: 'H13-S2-C2',
            name: '测量设计与样本',
            slug: 'test-design',
            articles: [
              { id: 'H13-S2-C2-A1', title: '单连接与多连接测速测到了什么，为什么结果不能直接混比？', slug: 'wiki-single-multi-connection' },
              { id: 'H13-S2-C2-A2', title: '网络实验怎样建立基线与控制变量？', slug: 'wiki-baseline-controls' },
              { id: 'H13-S2-C2-A3', title: '可用率和稳定性结论为什么必须有观察窗口和样本分母？', slug: 'wiki-availability-window' },
              { id: 'H13-S2-C2-A4', title: '失败样本与缺失数据应该怎样记录，为什么不能只保留成功结果？', slug: 'wiki-failed-missing-samples' }
            ]
          },
          {
            id: 'H13-S2-C3',
            name: '标签、声明与推断边界',
            slug: 'claims-inference',
            articles: [
              { id: 'H13-S2-C3-A1', title: 'IP地区数据库如何形成结果，为什么不能据此精确定位个人？', slug: 'wiki-ip-location-limit' },
              { id: 'H13-S2-C3-A2', title: 'IP信誉和代理标签表示什么，为什么不同提供方可能不一致？', slug: 'wiki-ip-reputation-context' },
              { id: 'H13-S2-C3-A3', title: '路由观察和测速能够证明哪些线路信息，哪些商业声明仍无法确认？', slug: 'wiki-line-proof' },
              { id: 'H13-S2-C3-A4', title: '文档支持、配置可加载和任务成功，为什么是三个不同证据层级？', slug: 'wiki-support-levels' }
            ]
          },
          {
            id: 'H13-S2-C4',
            name: '技术资料与知识更新',
            slug: 'sources-methods',
            articles: [
              { id: 'H13-S2-C4-A1', title: '阅读客户端与协议官方文档时，怎样确认版本和适用范围？', slug: 'wiki-read-official-docs' },
              { id: 'H13-S2-C4-A2', title: 'RFC、项目文档和服务商说明分别适合支持哪些结论？', slug: 'wiki-rfc-project-doc' },
              { id: 'H13-S2-C4-A3', title: '技术文章怎样记录来源、访问日期和结论边界，方便读者复查？', slug: 'wiki-source-traceability' },
              { id: 'H13-S2-C4-A4', title: '技术版本变化后，知识文章应如何保留历史条件并发布更正？', slug: 'wiki-update-corrections' }
            ]
          }
        ]
      }
    ]
  }
];

export function buildFullRegistry(): ContentNode[] {
  const nodes: ContentNode[] = [];
  const now = '2026-10-26T18:40:00+08:00';

  // 1. 首页 (H00)
  nodes.push({
    id: 'H00',
    type: 'home',
    title: '梯子参考：按设备与需求选择合适的网络方案',
    seoTitle: '梯子参考：手机电脑方案、客户端与网络服务选型指南',
    url: '/',
    parentId: null,
    hubId: null,
    intent: '全站总导航、设备/任务分流、全局选型摘要与决策入口',
    primaryQuestion: '如何根据自己的设备类型、任务需求和网络环境选择最合适稳定的网络方案？',
    inScope: ['全平台分流', '服务类型辨析', '使用排障指引', '主站选购中心引流说明'],
    outOfScope: ['具体机场综合打分排名', '盗版软件分发', '非法破解'],
    sourceIds: ['src-google-helpful-content'],
    entityIds: ['windows', 'macos', 'android', 'ios', 'linux'],
    relatedIds: ['H01', 'H02', 'H03', 'H04', 'H05', 'H09', 'H10', 'H11'],
    wordTarget: 12000,
    zhCharCount: 0,
    status: 'planned',
    createdAt: now,
    updatedAt: now
  });

  // 2. 遍历 13 主专题
  for (const main of mainTopicsDef) {
    const mainUrl = `/${main.slug}/`;
    nodes.push({
      id: main.id,
      type: 'main_topic',
      title: `${main.name}：完整选型、方案与深度指南`,
      seoTitle: `${main.name}｜梯子参考 tizicankao.cc`,
      url: mainUrl,
      parentId: 'H00',
      hubId: 'H00',
      intent: `提供${main.name}领域的全面决策树、核心参数表与下级内容索引`,
      primaryQuestion: `在${main.name}专题中，用户应掌握哪些核心判断准则和操作方案？`,
      inScope: [`${main.name}全景概览`, '核心分类决策', '典型问题排查'],
      outOfScope: ['复制主站测评榜单', '无证据商业推荐'],
      sourceIds: ['src-google-helpful-content'],
      entityIds: [],
      relatedIds: ['H00'],
      wordTarget: 12000,
      zhCharCount: 0,
      status: 'planned',
      createdAt: now,
      updatedAt: now
    });

    // 遍历二级专题
    for (const sub of main.subs) {
      const subUrl = `/${main.slug}/${sub.slug}/`;
      nodes.push({
        id: sub.id,
        type: 'sub_topic',
        title: `${sub.name}：${main.name}二级专题深度解析`,
        seoTitle: `${sub.name} - ${main.name}｜梯子参考`,
        url: subUrl,
        parentId: main.id,
        hubId: main.id,
        intent: `针对${main.name}下的${sub.name}展开深度分析与集群索引`,
        primaryQuestion: `在${sub.name}场景下，核心边界条件与选择依据是什么？`,
        inScope: [`${sub.name}分类对比`, '指标与环境约束'],
        outOfScope: ['空洞理论', '通用废话'],
        sourceIds: [],
        entityIds: [],
        relatedIds: [main.id],
        wordTarget: 10000,
        zhCharCount: 0,
        status: 'planned',
        createdAt: now,
        updatedAt: now
      });

      // 遍历三级集群
      for (const cl of sub.clusters) {
        const clUrl = `/${main.slug}/${sub.slug}/${cl.slug}/`;
        nodes.push({
          id: cl.id,
          type: 'cluster',
          title: `${cl.name}：集群聚合与决策矩阵`,
          seoTitle: `${cl.name} - ${sub.name}｜梯子参考`,
          url: clUrl,
          parentId: sub.id,
          hubId: main.id,
          intent: `针对${cl.name}的4篇核心文章进行横向对比、场景串联与导读`,
          primaryQuestion: `如何系统化处理${cl.name}涉及的4个细分任务与条件？`,
          inScope: [`${cl.name}集群总览`, '4篇细分文章导读矩阵'],
          outOfScope: ['简单罗列文章标题而不做实质分析'],
          sourceIds: [],
          entityIds: [],
          relatedIds: [sub.id],
          wordTarget: 10000,
          zhCharCount: 0,
          status: 'planned',
          createdAt: now,
          updatedAt: now
        });

        // 遍历4篇独立文章
        for (const art of cl.articles) {
          // 正文物理URL: /{主专题}/{文章slug}/
          const artUrl = `/${main.slug}/${art.slug}/`;
          nodes.push({
            id: art.id,
            type: 'article',
            title: art.title,
            seoTitle: `${art.title}｜梯子参考`,
            url: artUrl,
            parentId: cl.id, // 逻辑父级为集群
            hubId: main.id,
            intent: `针对具体用户问题提供端到端彻底解答与可操作方案`,
            primaryQuestion: art.title,
            inScope: ['答案与边界', '参数对比', '完整步骤', '机制局限', '常见问题解答'],
            outOfScope: ['泛泛而谈', '虚构测试数据', '强行推销'],
            sourceIds: [],
            entityIds: [],
            relatedIds: [cl.id],
            wordTarget: 12000,
            zhCharCount: 0,
            status: 'planned',
            createdAt: now,
            updatedAt: now
          });
        }
      }
    }
  }

  return nodes;
}

if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('generate-registry')) {
  const nodes = buildFullRegistry();
  const targetPath = path.resolve(process.cwd(), 'data/content_registry.json');
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, JSON.stringify(nodes, null, 2), 'utf-8');
  console.log(`Successfully generated full registry with ${nodes.length} nodes to ${targetPath}`);
}
