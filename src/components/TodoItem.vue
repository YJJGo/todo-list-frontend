<template>
  <div class="todo-item" :class="{ 'is-done': todo.completed }">
    <!-- 复选框 -->
    <el-checkbox
      :model-value="todo.completed"
      @change="$emit('toggle', todo)"
      size="large"
    />

    <!-- 内容区 -->
    <div class="content">
      <div class="item-title">{{ todo.title }}</div>
      <div class="item-desc" v-if="todo.description">{{ todo.description }}</div>
    </div>

    <!-- 删除按钮 -->
    <el-button
      type="danger"
      icon="Delete"
      circle
      size="small"
      plain
      @click="$emit('delete', todo.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'
import type { Todo } from '@/types/todo'

defineProps<{ todo: Todo }>()
defineEmits(['toggle', 'delete'])
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
.todo-item:hover {
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
}
.todo-item.is-done .item-title,
.todo-item.is-done .item-desc {
  text-decoration: line-through;
  color: #c0c4cc;
}
.content {
  flex: 1;
  margin: 0 12px;
  overflow: hidden;
}
.item-title { font-weight: 500; color: #606266; }
.item-desc { font-size: 12px; color: #909399; margin-top: 4px; }
</style>
