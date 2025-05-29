<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  architecture: String,
  search: String,
  sort: String,
  loading: Boolean
})

const emit = defineEmits(['update:architecture', 'update:search', 'update:sort'])

const architectures = [
  { value: 'all', label: '全部架構' },
  { value: 'GPT', label: 'GPT 系列' },
  { value: 'Claude', label: 'Claude 系列' },
  { value: 'Gemini', label: 'Gemini 系列' }
]

const sortOptions = [
  { value: 'created', label: '建立時間' },
  { value: 'name', label: '名稱' },
  { value: 'architecture', label: '架構類型' }
]
</script>

<template>
  <q-card class="q-mb-lg">
    <q-card-section>
      <div class="text-h6 q-mb-md">
        <q-icon name="filter_alt" class="q-mr-sm" />
        篩選與搜尋
      </div>
      
      <div class="row q-gutter-md">
        <!-- Architecture Filter -->
        <div class="col-md-3 col-12">
          <q-select
            :model-value="architecture"
            @update:model-value="emit('update:architecture', $event)"
            :options="architectures"
            option-value="value"
            option-label="label"
            label="模型架構"
            outlined
            :loading="loading"
            emit-value
            map-options
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="architecture" />
            </template>
          </q-select>
        </div>

        <!-- Search -->
        <div class="col-md-6 col-12">
          <q-input
            :model-value="search"
            @update:model-value="emit('update:search', $event)"
            label="搜尋模型"
            placeholder="輸入模型名稱或描述..."
            outlined
            :loading="loading"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <!-- Sort -->
        <div class="col-md-3 col-12">
          <q-select
            :model-value="sort"
            @update:model-value="emit('update:sort', $event)"
            :options="sortOptions"
            option-value="value"
            option-label="label"
            label="排序方式"
            outlined
            :loading="loading"
            emit-value
            map-options
          >
            <template v-slot:prepend>
              <q-icon name="sort" />
            </template>
          </q-select>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
