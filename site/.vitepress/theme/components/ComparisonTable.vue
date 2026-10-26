<template>
  <div class="table-wrapper-box" data-pagefind-body>
    <div class="table-meta-bar" v-if="title || note">
      <div class="table-title-area">
        <h4 class="table-title" v-if="title">{{ title }}</h4>
        <span class="table-note" v-if="note">{{ note }}</span>
      </div>
      <div class="table-scroll-hint">
        <span class="hint-badge">支持横向滚动</span>
      </div>
    </div>

    <!-- 容器内滚动，避免撑开全页 -->
    <div class="table-scroll-container">
      <table class="custom-table">
        <thead>
          <tr>
            <th v-for="(col, i) in columns" :key="i">
              <div class="col-header-wrap">
                <span>{{ col.label }}</span>
                <span class="col-unit" v-if="col.unit">({{ col.unit }})</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rIndex) in rows" :key="rIndex">
            <td v-for="(col, cIndex) in columns" :key="cIndex">
              <span v-if="row[col.key] === null || row[col.key] === undefined || row[col.key] === 'unknown'" class="val-unknown">
                待核验
              </span>
              <span v-else-if="row[col.key] === true" class="val-bool-yes">✓ 支持</span>
              <span v-else-if="row[col.key] === false" class="val-bool-no">✕ 不支持</span>
              <span v-else class="val-text">{{ row[col.key] }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 移动端关键字段摘要卡片 -->
    <div class="mobile-summary-cards" v-if="rows && rows.length > 0">
      <div class="card-hint">移动端快速摘要：</div>
      <div v-for="(row, i) in rows" :key="'m-' + i" class="summary-card">
        <div class="card-primary-title">{{ row[columns[0]?.key] }}</div>
        <div class="card-fields">
          <div v-for="col in columns.slice(1, 4)" :key="col.key" class="card-row">
            <span class="card-k">{{ col.label }}:</span>
            <span class="card-v">{{ row[col.key] }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="table-source-footer" v-if="source">
      <span>数据口径与来源：{{ source }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ColumnDef {
  key: string;
  label: string;
  unit?: string;
}

defineProps<{
  title?: string;
  note?: string;
  columns: ColumnDef[];
  rows: Record<string, any>[];
  source?: string;
}>();
</script>

<style scoped>
.table-wrapper-box {
  margin: 1.8rem 0;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.table-meta-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  flex-wrap: wrap;
  gap: 8px;
}

.table-title {
  margin: 0;
  font-size: 14.5px;
  font-weight: 700;
  color: #0f172a;
}

.table-note {
  font-size: 12.5px;
  color: #64748b;
  margin-left: 8px;
}

.hint-badge {
  font-size: 11px;
  color: #64748b;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 2px 6px;
  border-radius: 4px;
}

.table-scroll-container {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
  text-align: left;
}

.custom-table th {
  background: #f8fafc;
  color: #334155;
  font-weight: 600;
  padding: 10px 14px;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

.col-unit {
  font-size: 11px;
  color: #64748b;
  font-weight: normal;
  margin-left: 2px;
}

.custom-table td {
  padding: 10px 14px;
  border-bottom: 1px solid #f1f5f9;
  color: #1e293b;
  vertical-align: middle;
}

.custom-table tr:hover td {
  background-color: #f8fafc;
}

.val-unknown {
  color: #94a3b8;
  font-style: italic;
  font-size: 12px;
}

.val-bool-yes {
  color: #059669;
  font-weight: 600;
}

.val-bool-no {
  color: #dc2626;
  font-weight: 600;
}

.table-source-footer {
  padding: 8px 16px;
  background: #fafafa;
  border-top: 1px solid #f1f5f9;
  font-size: 12px;
  color: #64748b;
}

.mobile-summary-cards {
  display: none;
  padding: 12px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

@media (max-width: 640px) {
  .mobile-summary-cards {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .card-hint {
    font-size: 11.5px;
    font-weight: 600;
    color: #64748b;
  }
  .summary-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px;
  }
  .card-primary-title {
    font-weight: 600;
    font-size: 13.5px;
    color: #0f172a;
    margin-bottom: 6px;
  }
  .card-row {
    display: flex;
    justify-content: space-between;
    font-size: 12.5px;
    padding: 2px 0;
  }
  .card-k {
    color: #64748b;
  }
  .card-v {
    color: #1e293b;
    font-weight: 500;
  }
}
</style>
