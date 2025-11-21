<template>
  <el-card class="box-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <!-- 左侧：标题 -->
        <div class="header-left">
          <span class="title">📝 待办清单</span>
        </div>

        <!-- 右侧：操作区 (排序 -> 筛选 -> 新建) -->
        <div class="header-actions">
          <!-- 1. 排序按钮 -->
          <el-tooltip :content="sortTooltip" placement="top">
            <el-button
              :type="sortBy === 'dueDatetime' ? 'primary' : 'default'"
              circle
              plain
              size="small"
              @click="toggleSort"
              class="action-item"
            >
              <el-icon><Sort /></el-icon>
            </el-button>
          </el-tooltip>

          <!-- 2. 分类筛选 -->
          <el-select
            v-model="filterCategory"
            placeholder="筛选"
            size="small"
            class="action-item category-select"
          >
            <el-option label="全部分类" value="全部" />
            <el-option label="工作" value="工作" />
            <el-option label="学习" value="学习" />
            <el-option label="生活" value="生活" />
            <el-option label="其他" value="其他" />
          </el-select>

          <!-- 3. 新建按钮 (最显眼) -->
          <el-button
            type="primary"
            size="small"
            class="action-item"
            @click="openAddDialog"
          >
            <el-icon class="el-icon--left"><Plus /></el-icon>新建
          </el-button>
        </div>
      </div>
    </template>

    <!-- 引用 TodoInput 组件，并绑定 ref -->
    <TodoInput ref="todoInputRef" @add="handleAdd" :loading="loading" />

    <!-- 状态筛选器 -->
    <TodoFilter v-model="filterStatus" :total="finalList.length" />

    <!-- 列表区域 -->
    <div class="list-container" v-loading="loading">
      <!-- ... 列表代码不变 ... -->
      <!-- 为了展示精确到秒的时间，记得改一下 TodoItem 的显示格式，下面有说明 -->
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
const sortBy = ref<'createDatetime' | 'dueDatetime'>('createDatetime')
const todoInputRef = ref()

const sortTooltip = computed(() => {
  return sortBy.value === 'createDatetime' ? '当前：按创建时间排序' : '当前：按截止日期排序'
})

// 初始化
const fetchList = async () => {
  loading.value = true
  try {
    todoList.value = await todoApi.fetchTodos(sortBy.value)
  } finally {
    loading.value = false
  }
}

onMounted(fetchList)

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
    fetchList()
    ElMessage.success('添加成功')
  } finally {
    loading.value = false
  }
}

// ... handleDelete 和 handleToggle 保持不变 ...
const handleDelete = async (id: number) => {
  await todoApi.deleteTodo(id)
  fetchList()
  ElMessage.success('已删除')
}

const handleToggle = async (item: Todo) => {
  item.completed = !item.completed
  await todoApi.toggleStatus(item.id, item.completed)
}

const toggleSort = () => {
  sortBy.value = sortBy.value === 'createDatetime' ? 'dueDatetime' : 'createDatetime'
  fetchList()
}

const openAddDialog = () => {
  todoInputRef.value?.open()
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px; /* 统一高度 */
}

.title {
  font-weight: bold;
  font-size: 18px;
}

.header-actions {
  display: flex;
  align-items: center;
}

/* 统一间距 */
.action-item {
  margin-left: 12px;
}

.category-select {
  width: 100px;
}
.box-card {
  width: 500px; border-radius: 12px;
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
