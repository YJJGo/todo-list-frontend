<template>
  <div class="filter-bar">
    <el-radio-group :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" size="small">
      <el-radio-button label="all">全部</el-radio-button>
      <el-radio-button label="active">进行中</el-radio-button>
      <el-radio-button label="completed">已完成</el-radio-button>
    </el-radio-group>
    <span class="counter">共 {{ total }} 项</span>
  </div>
</template>

<script setup lang="ts">
import type { FilterType } from '@/types/todo'

defineProps<{
  modelValue: FilterType,
  total: number
}>()

defineEmits(['update:modelValue'])
</script>

<style scoped>
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}
.counter {
  font-size: 12px;
  color: #909399;
}
</style>
