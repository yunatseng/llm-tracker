<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  message: {
    type: String,
    default: '載入中...'
  },
  size: {
    type: String,
    default: 'md' // sm, md, lg
  }
})

const getSizeClasses = (size) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }
  return sizes[size] || sizes.md
}
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12">
    <!-- Spinning loader -->
    <div 
      :class="getSizeClasses(size)"
      class="animate-spin rounded-full border-b-2 border-blue-600 mb-4"
    ></div>
    
    <!-- Loading message -->
    <p class="text-gray-600 text-sm">{{ message }}</p>
  </div>
</template>
