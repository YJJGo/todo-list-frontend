<template>
  <div class="todo-item" :class="{ 'is-done': todo.completed }">
    <el-checkbox
      :model-value="todo.completed"
      @change="$emit('toggle', todo)"
      size="large"
    />

    <div class="content">
      <div class="title-row">
        <!-- 新增：分类标签 -->
        <el-tag :type="getTagType(todo.category)" size="small" effect="dark" class="category-tag">
          {{ todo.category }}
        </el-tag>
        <span class="item-title">{{ todo.title }}</span>
      </div>
      <div class="item-desc" v-if="todo.description">{{ todo.description }}</div>
    </div>

    <el-button type="danger" icon="Delete" circle size="small" plain @click="$emit('delete', todo.id)" />
  </div>
</template>

<script setup lang="ts">
import type { Todo } from '@/types/todo'

defineProps<{ todo: Todo }>()
defineEmits(['toggle', 'delete'])

// 根据分类返回不同的 Tag 颜色
const getTagType = (category: string) => {
  switch (category) {
    case '工作': return 'primary' // 蓝
    case '学习': return 'success' // 绿
    case '生活': return 'warning' // 橙
    default: return 'info'        // 灰
  }
}
</script>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 10px;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  transition: all 0.3s;
}
.content {
  flex: 1; margin: 0 12px; overflow: hidden;
}
.title-row {
  display: flex; align-items: center; margin-bottom: 4px;
}
.category-tag {
  margin-right: 8px; font-weight: normal;
}
.item-title {
  font-weight: 600; color: #303133;
}
.item-desc {
  font-size: 12px; color: #909399;
}
.todo-item.is-done .item-title {
  text-decoration: line-through; color: #c0c4cc;
}
.todo-item.is-done .category-tag {
  opacity: 0.6;
}
</style>
