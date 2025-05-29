<script setup>
import { defineProps, computed } from 'vue'
import ModelCard from './ModelCard.vue'

const props = defineProps({
  models: Array,
  sortBy: String
})

// Group models by date for timeline view
const groupedModels = computed(() => {
  const sorted = [...props.models].sort((a, b) => {
    if (props.sortBy === 'name') {
      return a.displayName.localeCompare(b.displayName)
    } else if (props.sortBy === 'architecture') {
      return a.architecture.localeCompare(b.architecture)
    } else {
      return new Date(b.created) - new Date(a.created)
    }
  })

  if (props.sortBy === 'created') {
    // Create timeline entries
    const groups = {}
    sorted.forEach(model => {
      const date = new Date(model.created).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(model)
    })
    return Object.entries(groups).map(([date, models]) => ({
      title: formatDate(date),
      subtitle: `${models.length} 個模型發布`,
      icon: 'schedule',
      color: 'primary',
      models: models
    }))
  } else {
    // Return as single group for other sorting
    return [{
      title: props.sortBy === 'architecture' ? '依架構排序' : '依名稱排序',
      subtitle: `共 ${sorted.length} 個模型`,
      icon: props.sortBy === 'architecture' ? 'category' : 'sort_by_alpha',
      color: 'secondary',
      models: sorted
    }]
  }
})

const getArchitectureColor = (architecture) => {
  const colors = {
    'GPT': 'positive',
    'Claude': 'info',
    'Gemini': 'secondary'
  }
  return colors[architecture] || 'grey'
}

const formatDate = (dateString) => {
  if (dateString === 'Models') return dateString
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div>
    <!-- Timeline for date-based sorting -->
    <q-timeline v-if="sortBy === 'created'" color="primary">
      <q-timeline-entry
        v-for="group in groupedModels"
        :key="group.title"
        :title="group.title"
        :subtitle="group.subtitle"
        :icon="group.icon"
        :color="group.color"
      >
        <div class="row q-gutter-md">
          <div 
            v-for="model in group.models" 
            :key="model.id || model.name"
            class="col-lg-4 col-md-6 col-12"
          >
            <ModelCard 
              :model="model"
              :architecture-color="getArchitectureColor(model.architecture)"
            />
          </div>
        </div>
      </q-timeline-entry>
    </q-timeline>

    <!-- Grid view for other sorting -->
    <div v-else>
      <q-card class="q-mb-lg" v-for="group in groupedModels" :key="group.title">
        <q-card-section>
          <div class="text-h6 q-mb-md">
            <q-icon :name="group.icon" class="q-mr-sm" />
            {{ group.title }}
          </div>
          <div class="text-caption text-grey-6 q-mb-md">{{ group.subtitle }}</div>
          
          <div class="row q-gutter-md">
            <div 
              v-for="model in group.models" 
              :key="model.id || model.name"
              class="col-lg-4 col-md-6 col-12"
            >
              <ModelCard 
                :model="model"
                :architecture-color="getArchitectureColor(model.architecture)"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Statistics Card -->
    <q-card class="q-mt-xl">
      <q-card-section>
        <div class="text-h6 q-mb-md">
          <q-icon name="analytics" class="q-mr-sm" />
          統計資訊
        </div>
        
        <div class="row q-gutter-md">
          <div class="col-lg-3 col-md-6 col-12">
            <q-card flat bordered class="text-center q-pa-md">
              <q-icon name="storage" size="2rem" color="primary" />
              <div class="text-h4 text-primary q-mt-sm">{{ models.length }}</div>
              <div class="text-caption text-grey-6">總模型數</div>
            </q-card>
          </div>
          
          <div class="col-lg-3 col-md-6 col-12">
            <q-card flat bordered class="text-center q-pa-md">
              <q-icon name="smart_toy" size="2rem" color="positive" />
              <div class="text-h4 text-positive q-mt-sm">
                {{ models.filter(m => m.architecture === 'GPT').length }}
              </div>
              <div class="text-caption text-grey-6">GPT 模型</div>
            </q-card>
          </div>
          
          <div class="col-lg-3 col-md-6 col-12">
            <q-card flat bordered class="text-center q-pa-md">
              <q-icon name="psychology" size="2rem" color="info" />
              <div class="text-h4 text-info q-mt-sm">
                {{ models.filter(m => m.architecture === 'Claude').length }}
              </div>
              <div class="text-caption text-grey-6">Claude 模型</div>
            </q-card>
          </div>
          
          <div class="col-lg-3 col-md-6 col-12">
            <q-card flat bordered class="text-center q-pa-md">
              <q-icon name="diamond" size="2rem" color="secondary" />
              <div class="text-h4 text-secondary q-mt-sm">
                {{ models.filter(m => m.architecture === 'Gemini').length }}
              </div>
              <div class="text-caption text-grey-6">Gemini 模型</div>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
