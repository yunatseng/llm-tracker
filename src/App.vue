<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import FilterPanel from './components/FilterPanel.vue'
import Timeline from './components/Timeline.vue'

const models = ref([])
const loading = ref(true)
const error = ref(null)
const selectedArchitecture = ref('all')
const searchQuery = ref('')
const sortBy = ref('created')

// Fetch models from static JSON file
const fetchModels = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await axios.get('/models.json', { timeout: 10000 })
    const data = response.data
    
    if (data.models && Array.isArray(data.models)) {
      models.value = data.models
      
      // 檢查是否有 API 錯誤
      if (data.metadata?.errors && data.metadata.errors.length > 0) {
        const errorMessages = data.metadata.errors.map(err => `${err.architecture}: ${err.error}`)
        error.value = `部分資料更新時發生錯誤: ${errorMessages.join(', ')}`
      }
      
      // 顯示最後更新時間
      if (data.metadata?.lastUpdated) {
        const lastUpdated = new Date(data.metadata.lastUpdated).toLocaleString('zh-TW')
        console.log(`📅 資料最後更新時間: ${lastUpdated}`)
      }
    } else {
      error.value = '模型資料格式錯誤'
    }
  } catch (err) {
    if (err.response?.status === 404) {
      error.value = '模型資料文件不存在，請稍後再試或聯繫管理員'
    } else {
      error.value = `載入模型資料時發生錯誤: ${err.message}`
    }
  } finally {
    loading.value = false
  }
}

// Filtered models based on search and architecture
const filteredModels = computed(() => {
  let filtered = models.value
  
  if (selectedArchitecture.value !== 'all') {
    filtered = filtered.filter(model => model.architecture === selectedArchitecture.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(model => 
      model.displayName.toLowerCase().includes(query) ||
      model.id?.toLowerCase().includes(query) ||
      model.description?.toLowerCase().includes(query)
    )
  }
  
  return filtered
})

onMounted(() => {
  fetchModels()
})
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated class="bg-primary">
      <q-toolbar>
        <q-avatar class="q-mr-sm">
          <q-icon name="timeline" />
        </q-avatar>
        
        <q-toolbar-title>
          <div class="text-h5 text-weight-bold">LLM 模型追蹤器</div>
          <div class="text-caption">追蹤最新的大型語言模型發展</div>
        </q-toolbar-title>

        <q-btn
          flat
          round
          dense
          icon="refresh"
          :loading="loading"
          @click="fetchModels"
          class="q-ml-sm"
        >
          <q-tooltip>重新整理</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Main Content -->
    <q-page-container>
      <q-page class="q-pa-md">
        <div class="container">
          <!-- Error Alert -->
          <q-banner
            v-if="error"
            class="text-white bg-negative q-mb-md"
            icon="warning"
          >
            {{ error }}
            <template v-slot:action>
              <q-btn
                flat
                label="關閉"
                @click="error = null"
              />
            </template>
          </q-banner>

          <!-- Filters -->
          <FilterPanel 
            v-model:architecture="selectedArchitecture"
            v-model:search="searchQuery"
            v-model:sort="sortBy"
            :loading="loading"
          />

          <!-- Loading state -->
          <div v-if="loading" class="row justify-center q-py-xl">
            <q-spinner-dots
              color="primary"
              size="40px"
            />
            <div class="q-ml-md text-h6">載入模型資料中...</div>
          </div>

          <!-- Timeline View -->
          <Timeline 
            v-else-if="filteredModels.length > 0"
            :models="filteredModels"
            :sort-by="sortBy"
          />

          <!-- No results -->
          <q-card v-else class="text-center q-py-xl">
            <q-card-section>
              <q-icon name="search_off" size="4rem" color="grey-5" />
              <div class="text-h6 q-mt-md text-grey-8">找不到符合條件的模型</div>
              <q-btn 
                flat
                color="primary"
                label="清除篩選條件"
                @click="searchQuery = ''; selectedArchitecture = 'all'"
                class="q-mt-md"
              />
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
