<template>
  <div class="task-finder-card">
    <div class="finder-header">
      <div class="finder-badge">独立决策辅助工具</div>
      <h3 class="finder-title">本地方案匹配向导 (TaskFinder)</h3>
      <p class="finder-subtitle">
        根据您的设备、核心任务与当前网络现状，生成可解释的推荐方案与阅读路径。
        <span class="privacy-note">（纯前端本地计算，不收集任何网络数据或凭据）</span>
      </p>
    </div>

    <!-- 筛选交互区域 -->
    <div class="finder-controls">
      <!-- 维度 1：主用设备 -->
      <div class="control-group">
        <label class="control-label">1. 选择您的主力设备：</label>
        <div class="options-grid">
          <button
            v-for="d in devices"
            :key="d.id"
            type="button"
            class="option-pill"
            :class="{ active: selectedDevice === d.id }"
            @click="selectedDevice = d.id"
          >
            {{ d.name }}
          </button>
        </div>
      </div>

      <!-- 维度 2：核心任务 -->
      <div class="control-group">
        <label class="control-label">2. 您最关心的核心任务：</label>
        <div class="options-grid">
          <button
            v-for="t in tasks"
            :key="t.id"
            type="button"
            class="option-pill"
            :class="{ active: selectedTask === t.id }"
            @click="selectedTask = t.id"
          >
            {{ t.name }}
          </button>
        </div>
      </div>

      <!-- 维度 3：当前现状 -->
      <div class="control-group">
        <label class="control-label">3. 您的当前使用状态：</label>
        <div class="options-grid">
          <button
            v-for="s in states"
            :key="s.id"
            type="button"
            class="option-pill"
            :class="{ active: selectedState === s.id }"
            @click="selectedState = s.id"
          >
            {{ s.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- 匹配结论卡片 -->
    <div class="finder-result" v-if="recommendation">
      <div class="result-header">
        <span class="rec-tag">匹配建议与逻辑解释</span>
        <h4 class="rec-title">{{ recommendation.title }}</h4>
      </div>

      <p class="rec-reason">{{ recommendation.reason }}</p>

      <div class="rec-paths">
        <div class="path-title">本站专属深度学习路径：</div>
        <ul class="path-list">
          <li v-for="(p, i) in recommendation.localPaths" :key="i">
            <a :href="p.url" class="path-link">{{ p.title }}</a>
            <span class="path-role">（{{ p.role }}）</span>
          </li>
        </ul>
      </div>

      <!-- 选购引流说明（仅当用户处于选购阶段时呈现） -->
      <div v-if="recommendation.mainSiteAction" class="rec-mainsite-hint">
        <div class="mainsite-hint-text">
          <strong>需要挑选高可用真实服务或比对套餐价格？</strong>
          <span>{{ recommendation.mainSiteAction.desc }}</span>
        </div>
        <a
          :href="recommendation.mainSiteAction.url"
          target="_blank"
          rel="nofollow sponsored noopener"
          class="mainsite-btn"
        >
          {{ recommendation.mainSiteAction.buttonText }} ↗
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const selectedDevice = ref('windows');
const selectedTask = ref('browse');
const selectedState = ref('beginner');

const devices = [
  { id: 'windows', name: 'Windows 电脑' },
  { id: 'mac', name: 'macOS (MacBook/iMac)' },
  { id: 'android', name: 'Android 安卓手机' },
  { id: 'ios', name: 'iPhone / iPad' },
  { id: 'linux', name: 'Linux / 软路由' }
];

const tasks = [
  { id: 'browse', name: '日常网页与文献查阅' },
  { id: 'ai', name: 'ChatGPT / Claude / AI 工具' },
  { id: 'media', name: '4K 流媒体与高清视频' },
  { id: 'dev', name: 'GitHub / 终端开发协作' }
];

const states = [
  { id: 'beginner', name: '新手零基础，准备首次尝试' },
  { id: 'has_software', name: '已有客户端，缺稳定服务' },
  { id: 'has_error', name: '已有连接，但经常断线/报错' }
];

const recommendation = computed(() => {
  const d = selectedDevice.value;
  const t = selectedTask.value;
  const s = selectedState.value;

  // 基础决策模型
  if (s === 'has_error') {
    return {
      title: `${d.toUpperCase()} 平台网络排障与连通性恢复策略`,
      reason: '针对已有订阅但在特定应用或切换网络时遇到的超时与接管失效，建议先排除本地 TUN/DNS 冲突，而非盲目重新购买服务。',
      localPaths: [
        { title: '网络排障：节点连通、认证与 TLS 握手异常', url: '/troubleshooting/connection-errors/node-connection/', role: '排查连接失败根因' },
        { title: 'DNS、TUN 与系统路由冲突定位', url: '/troubleshooting/runtime-errors/dns-tun/', role: '修复断网或无接管' },
        { title: 'AI 工具与开发环境网络独立排障', url: '/troubleshooting/runtime-errors/application/', role: '针对性应用配置' }
      ],
      mainSiteAction: null
    };
  }

  if (s === 'beginner') {
    return {
      title: `${d === 'windows' || d === 'mac' ? '桌面端' : '移动端'} 新手最小阻力上手路线`,
      reason: '新手首次使用切忌复杂分流与深度多内核修改，应优先选用成熟主流 GUI 客户端（如 Clash Verge Rev 或 v2rayN/NG），跑通标准订阅交付流程。',
      localPaths: [
        { title: '第一次使用梯子到底需要准备什么：软件、服务和设备分工', url: '/beginner/beginner-what-to-buy/', role: '建立清晰概念' },
        { title: '客户端下载：官方发布与完整性校验', url: '/clients/', role: '获取纯净安装包' },
        { title: '从安装到首次跑通最小配置指南', url: '/guides/first-connection/initial-config/', role: '无痛完成首连' }
      ],
      mainSiteAction: {
        desc: '在具备基本软件使用认知后，可到机场榜一比对支持新手一键导入的靠谱服务商。',
        url: 'https://jichangbang.org/recommend/?utm_source=tizicankao.cc&utm_medium=referral&utm_campaign=taskfinder_beginner',
        buttonText: '到主站查看新手推荐服务'
      }
    };
  }

  // has_software
  return {
    title: `适配 ${d.toUpperCase()} + ${t.toUpperCase()} 的商业服务选型约束`,
    reason: `针对 ${t === 'ai' ? 'AI 类敏感请求（要求住宅/干净机房 IP 与低欺诈分）' : t === 'media' ? '大吞吐视频需求（要求优质大带宽 BGP/专线）' : '日常稳定开发需求'}，选型重点在协议兼容性与出口纯净度。`,
    localPaths: [
      { title: '梯子怎么选：真实任务与使用频率优先级', url: '/choose/needs/workloads/', role: '预算与任务定界' },
      { title: '直连、中转与专线声明核验标准', url: '/service-types/delivery/lines/', role: '辨识商家宣传水分' },
      { title: '选型检查：购买前身份、协议与退订条款审查', url: '/checklist/before-buying/order-terms/', role: '规避预付陷阱' }
    ],
    mainSiteAction: {
      desc: '前往主站查看通过多地多机房实时测速与解锁能力验证的品牌列表。',
      url: 'https://jichangbang.org/pricing/?utm_source=tizicankao.cc&utm_medium=referral&utm_campaign=taskfinder_service',
      buttonText: '到主站对比当前套餐与真实测速'
    }
  };
});
</script>

<style scoped>
.task-finder-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  margin: 2rem 0;
}

.finder-badge {
  display: inline-block;
  font-size: 11.5px;
  font-weight: 600;
  color: #2563eb;
  background: #eff6ff;
  padding: 3px 8px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.finder-title {
  margin: 0 0 6px 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.finder-subtitle {
  color: #475569;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 20px 0;
}

.privacy-note {
  color: #059669;
  font-weight: 500;
}

.finder-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #edf2f7;
}

.control-label {
  display: block;
  font-size: 13.5px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
}

.options-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.option-pill {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #334155;
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.option-pill:hover {
  border-color: #94a3b8;
  background: #f1f5f9;
}

.option-pill.active {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(37, 99, 235, 0.3);
}

.finder-result {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px dashed #cbd5e1;
}

.rec-tag {
  font-size: 12px;
  font-weight: 600;
  color: #059669;
  background: #ecfdf5;
  padding: 2px 6px;
  border-radius: 4px;
}

.rec-title {
  margin: 6px 0 8px 0;
  font-size: 1.15rem;
  color: #0f172a;
}

.rec-reason {
  color: #475569;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.rec-paths {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px 16px;
}

.path-title {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.path-list {
  margin: 0;
  padding-left: 20px;
  font-size: 13.5px;
}

.path-link {
  color: #2563eb;
  text-decoration: underline;
  font-weight: 500;
}

.path-role {
  color: #64748b;
  font-size: 12.5px;
}

.rec-mainsite-hint {
  margin-top: 16px;
  padding: 12px 16px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.mainsite-hint-text {
  font-size: 13px;
  color: #1e3a8a;
  display: flex;
  flex-direction: column;
}

.mainsite-btn {
  display: inline-block;
  background: #2563eb;
  color: #ffffff !important;
  text-decoration: none !important;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 6px;
  white-space: nowrap;
  transition: background 0.15s ease;
}

.mainsite-btn:hover {
  background: #1d4ed8;
}
</style>
