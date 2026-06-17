<template>
  <q-card class="q-mb-md">
    <q-card-section class="text-h6">
      模型發布趨勢圖表（近 12 個月）
    </q-card-section>
    
    <q-card-section>
      <!-- 上排兩個圖表 -->
      <div class="row q-mb-md" style="margin-bottom: 50px;">
        <!-- 時間序列折線圖 -->
        <div class="col-12 col-md-6">
          <div class="chart-title">累計模型數量</div>
          <canvas id="lineChart"></canvas>
        </div>
        
        <!-- 柱狀圖 -->
        <div class="col-12 col-md-6">
          <div class="chart-title">每月新增數量</div>
          <canvas id="barChart"></canvas>
        </div>
      </div>
      
      <!-- 下排一個圖表佔滿寬度 -->
      <div class="row">
        <div class="col-12">
          <div class="chart-title">各架構每月發布</div>
          <canvas id="stackedChart"></canvas>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  models: {
    type: Array,
    required: true,
    default: () => []
  }
})

const lineChart = ref(null)
const barChart = ref(null)
const stackedChart = ref(null)

const initCharts = () => {
  if (!props.models || props.models.length === 0) return

  // 過濾掉 endpoint 為空值的模型
  const filteredModels = props.models.filter(model => model.endpoint)

  if (filteredModels.length === 0) return

  // 準備時間軸數據
  const timelineData = {}
  const architectureTimelineData = {}
  
  filteredModels.forEach(model => {
    if (model.created) {
      const date = new Date(model.created)
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      // 總數統計
      timelineData[monthYear] = (timelineData[monthYear] || 0) + 1
      
      // 架構統計
      if (!architectureTimelineData[model.architecture]) {
        architectureTimelineData[model.architecture] = {}
      }
      architectureTimelineData[model.architecture][monthYear] = 
        (architectureTimelineData[model.architecture][monthYear] || 0) + 1
    }
  })

  // 排序並取最近12個月
  const sortedMonths = Object.keys(timelineData)
    .sort()
    .slice(-12)

  // 計算累計數據
  let cumulative = 0
  const cumulativeData = sortedMonths.map(month => {
    cumulative += timelineData[month] || 0
    return cumulative
  })

  // 每月新增數據
  const monthlyData = sortedMonths.map(month => timelineData[month] || 0)

  // 準備架構數據
  const architectures = Object.keys(architectureTimelineData)
  const stackedDatasets = architectures.map((arch, index) => ({
    label: arch,
    data: sortedMonths.map(month => architectureTimelineData[arch][month] || 0),
    backgroundColor: getColor(index)
  }))

  // 1. 時間序列折線圖
  const lineCtx = document.getElementById('lineChart')
  if (lineCtx) {
    lineChart.value = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: sortedMonths.map(month => month.substring(5) + '月'),
        datasets: [{
          label: '累計模型數量',
          data: cumulativeData,
          borderColor: '#ff6b6b',
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    })
  }

  // 2. 柱狀圖
  const barCtx = document.getElementById('barChart')
  if (barCtx) {
    barChart.value = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: sortedMonths.map(month => month.substring(5) + '月'),
        datasets: [{
          label: '新增模型數量',
          data: monthlyData,
          backgroundColor: '#4ecdc4',
          borderColor: '#45b7d1',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    })
  }

  // 3. 堆疊柱狀圖
  const stackedCtx = document.getElementById('stackedChart')
  if (stackedCtx) {
    stackedChart.value = new Chart(stackedCtx, {
      type: 'bar',
      data: {
        labels: sortedMonths.map(month => month.substring(5) + '月'),
        datasets: stackedDatasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyle: 'rect',
              font: {
                size: 10
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    })
  }
}

const getColor = (index) => {
  const colors = [
    '#D32F2F', // red
    '#ff9ff3', // pink
    '#96ceb4', // green
    '#F57C00', // orange
    '#7B1FA2', // purple
    '#00796B', // teal
    '#C2185B', // pink
    '#512DA8', // deep purple
    '#455A64', // blue gray
    '#AFB42B', // olive
    '#5D4037', // brown
    '#0288D1'  // light blue
  ]
  return colors[index % colors.length]
}

const destroyCharts = () => {
  if (lineChart.value) {
    lineChart.value.destroy()
    lineChart.value = null
  }
  if (barChart.value) {
    barChart.value.destroy()
    barChart.value = null
  }
  if (stackedChart.value) {
    stackedChart.value.destroy()
    stackedChart.value = null
  }
}

watch(() => props.models, () => {
  destroyCharts()
  setTimeout(initCharts, 100)
}, { deep: true })

onMounted(() => {
  setTimeout(initCharts, 100)
})

onUnmounted(() => {
  destroyCharts()
})
</script>

<style scoped>
.chart-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
  color: #666;
}

canvas {
  max-height: 250px;
}
</style>