<template>
  <div class="todo-input-container">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-input
          v-model="formData.title"
          placeholder="任务标题 (必填)"
          clearable
          @keyup.enter="emitAdd"
        >
          <template #prefix><el-icon><List /></el-icon></template>
        </el-input>
      </el-col>
      <el-col :span="12">
        <el-input
          v-model="formData.description"
          placeholder="描述 (可选)"
          clearable
          @keyup.enter="emitAdd"
        >
          <template #prefix><el-icon><Document /></el-icon></template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" style="width: 100%" @click="emitAdd" :loading="loading">
          <el-icon class="el-icon--left"><Plus /></el-icon>添加
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Plus, List, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

defineProps<{ loading: boolean }>()
const emit = defineEmits(['add'])

const formData = reactive({
  title: '',
  description: ''
})

const emitAdd = () => {
  if (!formData.title.trim()) {
    ElMessage.warning('请输入任务标题')
    return
  }
  // 触发事件给父组件处理
  emit('add', { ...formData })

  // 清空表单
  formData.title = ''
  formData.description = ''
}
</script>

<style scoped>
.todo-input-container {
  margin-bottom: 20px;
}
</style>
