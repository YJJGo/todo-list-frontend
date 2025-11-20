<template>
  <div class="todo-item" :class="{ 'is-done': todo.completed }">
    <!-- 1. 左：复选框 -->
    <el-checkbox
        :model-value="todo.completed"
        @change="$emit('toggle', todo)"
        size="large"
        class="status-checkbox"
    />

    <!-- 2. 中：内容区域 -->
    <div class="content">
      <!-- 第一行：[分类+标题] (撑满剩余空间) --- [截止日期] (固定在右侧) -->
      <div class="header-row">

        <!-- 左半部分：分类 + 标题 -->
        <div class="header-left">
          <el-tag
              :type="getTagType(todo.category)"
              size="small"
              effect="dark"
              class="category-tag"
          >
            {{ todo.category }}
          </el-tag>
          <span class="item-title" :title="todo.title">{{ todo.title }}</span>
        </div>

        <!-- 右半部分：截止日期 (如果有) -->
        <div v-if="todo.dueDatetime" class="header-right" :class="{ 'is-overdue': isOverdue(todo.dueDatetime) }">
          <el-icon><Clock /></el-icon>
          <span class="date-text">{{ formatDate(todo.dueDatetime) }} 截止</span>
        </div>
      </div>

      <!-- 第二行：描述 -->
      <div class="desc-row">
        <span v-if="todo.description" :title="todo.description">{{ todo.description }}</span>
        <span v-else class="empty-desc">暂无描述</span>
      </div>
    </div>

    <!-- 3. 右：删除按钮 (独立) -->
    <el-button
        type="danger"
        icon="Delete"
        circle
        size="small"
        plain
        class="delete-btn"
        @click="$emit('delete', todo.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { Delete, Clock } from '@element-plus/icons-vue'
import type { Todo } from '@/types/todo'

defineProps<{ todo: Todo }>()
defineEmits(['toggle', 'delete'])

const getTagType = (category: string) => {
  switch (category) {
    case '工作': return 'primary'
    case '学习': return 'success'
    case '生活': return 'warning'
    default: return 'info'
  }
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  return `${month}-${day} ${hour}:${minute}`
}

const isOverdue = (timestamp: number) => {
  return timestamp < Date.now()
}
</script>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 10px;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  transition: all 0.2s;
}

.todo-item:hover {
  border-color: #dcdfe6;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
}

.status-checkbox {
  padding-right: 12px;
  flex-shrink: 0;
}

/* --- 中间核心布局 --- */
.content {
  flex: 1;             /* 自动撑满中间区域 */
  overflow: hidden;    /* 关键：防止内部长文本破坏 Flex 结构 */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* 第一行容器 */
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 关键：左右两端对齐 */
  width: 100%;
  margin-bottom: 4px;
}

/* 左侧：标签 + 标题 */
.header-left {
  display: flex;
  align-items: center;
  flex: 1;             /* 占据剩余空间 */
  overflow: hidden;    /* 超出隐藏 */
  margin-right: 10px;  /* 给右边的日期留点距离 */
}

.category-tag {
  margin-right: 8px;
  flex-shrink: 0;      /* 标签不可压缩 */
}

.item-title {
  font-weight: 600;
  font-size: 15px;
  color: #303133;

  /* 文本溢出省略号 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 右侧：日期 */
.header-right {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #909399;
  background-color: #f4f4f5;
  padding: 2px 6px;
  border-radius: 4px;
  flex-shrink: 0;       /* 关键：日期不可压缩，必须完整显示 */
  white-space: nowrap;  /* 防止日期内部换行 */
}

.header-right .el-icon {
  margin-right: 4px;
}

/* 过期变红 */
.header-right.is-overdue {
  color: #f56c6c;
  background-color: #fef0f0;
}

/* 第二行：描述 */
.desc-row {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
}

.empty-desc {
  color: #e9e9eb;
}

/* 删除按钮 */
.delete-btn {
  margin-left: 12px;
  flex-shrink: 0;
}

/* 完成状态样式 */
.todo-item.is-done .item-title,
.todo-item.is-done .desc-row {
  text-decoration: line-through;
  color: #c0c4cc;
}
.todo-item.is-done .category-tag,
.todo-item.is-done .header-right {
  opacity: 0.6;
}
</style>
