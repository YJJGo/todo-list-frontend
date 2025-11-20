<template>
  <el-card class="box-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <span class="title">📝 TODO List 应用</span>
        <el-tag effect="plain">Made By YJJ</el-tag>
      </div>
    </template>

    <TodoInput @add="handleAdd" :loading="loading" />
    <TodoFilter v-model="filterStatus" :total="filteredList.length" />

    <!-- 3. 列表展示区 (修改核心部分) -->
    <!-- 给容器一个最小高度，防止内容切换时卡片高度塌陷带来的抖动 -->
    <div class="list-container" v-loading="loading">

      <!-- 外层：控制“有数据”和“无数据”状态的切换 -->
      <!-- mode="out-in": 当前元素先进行过渡离开，完成之后新元素过渡进入 -->
      <transition name="fade" mode="out-in">

        <!-- 情况A: 无数据 -->
        <!-- 这里的 key="empty" 是必须的，帮助 Vue 区分元素 -->
        <el-empty
          v-if="filteredList.length === 0 && !loading"
          key="empty"
          description="暂无相关任务"
          :image-size="80"
        />

        <!-- 情况B: 有数据 -->
        <div v-else key="list" class="list-wrapper">
          <transition-group name="list" tag="div" class="todo-group">
            <TodoItem
              v-for="item in filteredList"
              :key="item.id"
              :todo="item"
              @toggle="handleToggle"
              @delete="handleDelete"
            />
          </transition-group>
        </div>

      </transition>
    </div>
  </el-card>
</template>

<script setup lang="ts">
// ... script 部分保持不变 ...
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { todoApi } from '@/api/todoApi' // 或者 '../api/todoApi'
import type { Todo, FilterType } from '@/types/todo' // 或者 '../types/todo'
import TodoInput from '@/components/TodoInput.vue' // 或者 '../components/TodoInput.vue'
import TodoFilter from '@/components/TodoFilter.vue' // 或者 '../components/TodoFilter.vue'
import TodoItem from '@/components/TodoItem.vue' // 或者 '../components/TodoItem.vue'

const loading = ref(false)
const todoList = ref<Todo[]>([])
const filterStatus = ref<FilterType>('all')

onMounted(async () => {
  loading.value = true
  try {
    todoList.value = await todoApi.fetchTodos()
  } finally {
    loading.value = false
  }
})

const filteredList = computed(() => {
  switch (filterStatus.value) {
    case 'active': return todoList.value.filter(t => !t.completed)
    case 'completed': return todoList.value.filter(t => t.completed)
    default: return todoList.value
  }
})

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

const handleDelete = async (id: number) => {
  await todoApi.deleteTodo(id)
  todoList.value = todoList.value.filter(item => item.id !== id)
  ElMessage.success('已删除')
}

const handleToggle = async (item: Todo) => {
  // 乐观更新 UI
  const oldStatus = item.completed
  item.completed = !item.completed
  try {
    await todoApi.toggleStatus(item.id, item.completed)
  } catch (e) {
    // 失败回滚
    item.completed = oldStatus
    ElMessage.error('状态更新失败')
  }
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
  min-height: 300px; /* 核心：固定最小高度，防止内容切换时界面跳动 */
  position: relative;
  overflow: hidden; /* 防止动画过程中滚动条闪烁 */
}

/* --- 1. 外层状态切换动画 (fade) --- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* --- 2. 内层列表项动画 (list) - 核心修复 --- */
/* 列表项进入和离开的动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 关键修复：让离开的元素脱离文档流，
   这样其他元素才能平滑地“滑”上去，而不是瞬间跳上去 */
.list-leave-active {
  position: absolute;
  width: 100%; /* 绝对定位后需要手动指定宽度 */
}

/* FLIP 动画队列：让非移动元素平滑过渡 */
.list-move {
  transition: transform 0.4s ease;
}
</style>
