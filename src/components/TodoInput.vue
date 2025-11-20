<template>
  <div class="todo-input-container">
    <el-row :gutter="10">
      <!-- 1. 分类选择 (新增) -->
      <el-col :span="5">
        <el-select v-model="formData.category" placeholder="分类" style="width: 100%">
          <el-option label="工作" value="工作" />
          <el-option label="学习" value="学习" />
          <el-option label="生活" value="生活" />
          <el-option label="其他" value="其他" />
        </el-select>
      </el-col>

      <!-- 2. 标题输入 -->
      <el-col :span="7">
        <el-input
          v-model="formData.title"
          placeholder="任务标题 (必填)"
          clearable
          @keyup.enter="emitAdd"
        />
      </el-col>

      <!-- 3. 描述输入 -->
      <el-col :span="8">
        <el-input
          v-model="formData.description"
          placeholder="描述 (可选)"
          clearable
          @keyup.enter="emitAdd"
        />
      </el-col>

      <!-- 4. 按钮 -->
      <el-col :span="4">
        <el-button type="primary" style="width: 100%" @click="emitAdd" :loading="loading">
          <el-icon class="el-icon--left"><Plus /></el-icon>添加
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

defineProps<{ loading: boolean }>()
const emit = defineEmits(['add'])

const formData = reactive({
  title: '',
  description: '',
  category: '工作' // 默认选中工作
})

const emitAdd = () => {
  if (!formData.title.trim()) {
    ElMessage.warning('请输入任务标题')
    return
  }
  // 复制一份数据传出去
  emit('add', { ...formData })

  // 重置表单
  formData.title = ''
  formData.description = ''
  formData.category = '工作'
}
</script>

<style scoped>
.todo-input-container {
  margin-bottom: 20px;
}
</style>
