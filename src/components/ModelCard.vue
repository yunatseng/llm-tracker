<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  model: Object,
  architectureColor: String
})

const formatDate = (dateString) => {
  if (!dateString) return '未知日期'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatPrice = (pricing) => {
  if (!pricing) return null
  if (typeof pricing === 'object') {
    const prompt = pricing.prompt || pricing.input
    const completion = pricing.completion || pricing.output
    if (prompt && completion) {
      return `輸入: $${prompt}/1M tokens<br>輸出: $${completion}/1M tokens`
    }
  }
  return null
}

const getModelDescription = (model) => {
  return model.description || 
         model.summary || 
         `${model.architecture} 系列的語言模型`
}

const getContextLength = (model) => {
  return model.context_length || 
         model.max_tokens || 
         model.contextLength || 
         '未知'
}
</script>

<template>
  <q-card 
    class="model-card" style="
      display: flex;
      flex-direction: column;
      justify-content: space-between;
  ">
    <q-card-section style="padding-bottom: 0;">
      <div class="row items-center justify-between q-mb-sm">
        <div class="col text-left">
          <div class="text-h6 text-weight-bold">
            {{ model.displayName }}
          </div>
          <div class="text-caption text-grey-6">{{ model.id }}</div>
        </div>
        <q-chip 
          :color="architectureColor" 
          text-color="white" 
          size="sm"
        >
          {{ model.architecture }}
        </q-chip>
      </div>
    </q-card-section>

    <q-card-section>
      <p class="text-body2 text-left q-mb-md truncate-text" style="min-height: 40px;">
        {{ getModelDescription(model) }}
        <q-tooltip class="max-w-[300px] text-body2">
          {{ getModelDescription(model) }}
        </q-tooltip>
      </p>
      <!-- <q-list dense>
        <q-item>
          <q-item-section>
            <q-item-label caption>API 釋出日期</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ formatDate(model.created) }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label caption>上下文長度</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ getContextLength(model) }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label caption>定價</q-item-label>
          </q-item-section>
          <q-item-section>
            <small v-html="formatPrice(model.endpoint?.pricing)" />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label caption>提供商</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ model.endpoint?.provider_name || model.author }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list> -->
    </q-card-section>

    <q-card-actions v-if="model.link || model.url" align="center">
      <q-btn
        flat
        color="primary"
        icon="open_in_new"
        label="了解更多"
        :href="model.link || model.url"
        target="_blank"
        rel="noopener noreferrer"
      />
    </q-card-actions>
  </q-card>
</template>

<style scoped>
.model-card {
  height: 100%;
  transition: all 0.3s ease;
}

.model-card:hover {
  transform: translateY(-2px);
}

.truncate-text {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
