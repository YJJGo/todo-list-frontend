<template>
  <el-card class="box-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <span class="title">📝 待办分类清单</span>

        <!-- 右上角：分类筛选器 -->
        <el-select
          v-model="filterCategory"
          placeholder="筛选分类"
          size="small"
          style="width: 100px"
        >
          <el-option label="全部" value="全部" />
          <el-option label="工作" value="工作" />
          <el-option label="学习" value="学习" />
          <el-option label="生活" value="生活" />
          <el-option label="其他" value="其他" />
        </el-select>
      </div>
    </template>

    <TodoInput @add="handleAdd" :loading="loading" />

    <!-- 状态筛选器 (TodoFilter 组件保持之前的代码即可，不用动) -->
    <TodoFilter v-model="filterStatus" :total="finalList.length" />

    <div class="list-container" v-loading="loading">
      <transition name="fade" mode="out-in">
        <el-empty v-if="finalList.length === 0 && !loading" description="暂无任务" />

        <div v-else key="list">
          <transition-group name="list" tag="div">
            <TodoItem
              v-for="item in finalList"
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
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { todoApi } from '@/api/todoApi' // 假设用相对路径或已修好别名
import type { Todo, FilterType, CategoryType } from '@/types/todo'
import TodoInput from '@/components/TodoInput.vue'
import TodoFilter from '@/components/TodoFilter.vue'
import TodoItem from '@/components/TodoItem.vue'

const loading = ref(false)
const todoList = ref<Todo[]>([])
const filterStatus = ref<FilterType>('all')
const filterCategory = ref<CategoryType>('全部') // 新增分类筛选状态

// 初始化
onMounted(async () => {
  loading.value = true
  try {
    todoList.value = await todoApi.fetchTodos() // 获取所有数据
  } finally {
    loading.value = false
  }
})

// 核心逻辑：双重过滤
const finalList = computed(() => {
  return todoList.value.filter(item => {
    // 1. 状态过滤
    const matchStatus =
      filterStatus.value === 'all' ? true :
        filterStatus.value === 'active' ? !item.completed :
          item.completed

    // 2. 分类过滤
    const matchCategory =
      filterCategory.value === '全部' ? true :
        item.category === filterCategory.value

    return matchStatus && matchCategory
  })
})

const handleAdd = async (payload: any) => {
  loading.value = true
  try {
    const newItem = await todoApi.addTodo(payload)
    newItem.category = payload.category

    todoList.value.unshift(newItem)
    ElMessage.success('添加成功')
  } finally {
    loading.value = false
  }
}

// ... handleDelete 和 handleToggle 保持不变 ...
const handleDelete = async (id: number) => {
  await todoApi.deleteTodo(id)
  todoList.value = todoList.value.filter(item => item.id !== id)
  ElMessage.success('已删除')
}

const handleToggle = async (item: Todo) => {
  item.completed = !item.completed
  await todoApi.toggleStatus(item.id, item.completed)
}
</script>

<style scoped>
.box-card {
  width: 600px; border-radius: 12px;
}
.card-header {
  display: flex; justify-content: space-between; align-items: center;
}
.list-container {
  min-height: 300px; position: relative;
}
/* 保持之前的动画样式 */
.list-enter-active, .list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from, .list-leave-to {
  opacity: 0; transform: translateX(30px);
}
.list-leave-active {
  position: absolute; width: 100%;
}
</style>
