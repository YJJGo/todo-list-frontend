<template>
  <el-card class="box-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <span class="title">📝 TODO List</span>
      </div>
    </template>

    <!-- 1. 组件：添加任务 -->
    <TodoInput @add="handleAdd" :loading="loading" />

    <!-- 2. 组件：过滤器 -->
    <TodoFilter v-model="filterStatus" :total="filteredList.length" />

    <!-- 3. 列表展示区 -->
    <div class="list-container" v-loading="loading">
      <el-empty v-if="filteredList.length === 0 && !loading" description="暂无任务" :image-size="80" />

      <transition-group name="list">
        <TodoItem
          v-for="item in filteredList"
          :key="item.id"
          :todo="item"
          @toggle="handleToggle"
          @delete="handleDelete"
        />
      </transition-group>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { todoApi } from '@/api/todoApi'
import type { Todo, FilterType } from '@/types/todo'

// 引入组件
import TodoInput from '@/components/TodoInput.vue'
import TodoFilter from '@/components/TodoFilter.vue'
import TodoItem from '@/components/TodoItem.vue'

// 状态
const loading = ref(false)
const todoList = ref<Todo[]>([])
const filterStatus = ref<FilterType>('all')

// 初始化
onMounted(async () => {
  loading.value = true
  try {
    todoList.value = await todoApi.fetchTodos()
  } finally {
    loading.value = false
  }
})

// 计算属性：过滤逻辑
const filteredList = computed(() => {
  switch (filterStatus.value) {
    case 'active': return todoList.value.filter(t => !t.completed)
    case 'completed': return todoList.value.filter(t => t.completed)
    default: return todoList.value
  }
})

// 业务逻辑：添加
const handleAdd = async (payload: { title: string, description: string }) => {
  loading.value = true
  try {
    const newItem = await todoApi.addTodo(payload.title, payload.description)
    todoList.value.unshift(newItem)
    ElMessage.success('添加成功')
  } finally {
    loading.value = false
  }
}

// 业务逻辑：删除
const handleDelete = async (id: number) => {
  await todoApi.deleteTodo(id)
  todoList.value = todoList.value.filter(item => item.id !== id)
  ElMessage.success('已删除')
}

// 业务逻辑：切换状态
const handleToggle = (item: Todo) => {
  item.completed = !item.completed
  todoApi.toggleStatus(item.id) // 可选：调用后台同步状态
}
</script>

<style scoped>
.box-card {
  width: 600px;
  max-width: 100%;
  border-radius: 12px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}
.list-container {
  min-height: 200px;
}

/* 列表动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
