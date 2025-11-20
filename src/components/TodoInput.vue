<template>
  <!-- 现在的组件只包含弹窗，没有按钮了 -->
  <el-dialog
    v-model="dialogVisible"
    title="创建新任务"
    width="500px"
    :close-on-click-modal="false"
    @closed="resetForm"
    destroy-on-close
  >
    <el-form :model="formData" label-position="top" size="large">

      <el-form-item label="任务标题 (必填)">
        <el-input
          v-model="formData.title"
          placeholder="准备做什么？"
          ref="titleInputRef"
          clearable
          @keyup.enter="handleConfirm"
        />
      </el-form-item>

      <el-form-item label="任务描述">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="3"
          placeholder="添加详细说明..."
        />
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="分类">
            <el-select v-model="formData.category" style="width: 100%">
              <el-option label="工作" value="工作" />
              <el-option label="学习" value="学习" />
              <el-option label="生活" value="生活" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="14">
          <!-- 修改：datetime 类型，支持时分秒 -->
          <el-form-item label="截止时间 (精确到秒)">
            <el-date-picker
              v-model="formData.dueDatetime"
              type="datetime"
              placeholder="选择具体时间"
              format="MM-DD HH:mm:ss"
              value-format="x"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm" :loading="loading">
          立即创建
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'

defineProps<{ loading: boolean }>()
const emit = defineEmits(['add'])

const dialogVisible = ref(false)
const titleInputRef = ref()

const formData = reactive({
  title: '',
  description: '',
  category: '工作',
  dueDatetime: ''
})

// 向外暴露 open 方法
const open = () => {
  dialogVisible.value = true
}
defineExpose({ open })

const handleConfirm = () => {
  if (!formData.title.trim()) {
    ElMessage.warning('请填写任务标题')
    return
  }
  emit('add', { ...formData })
  dialogVisible.value = false
}

const resetForm = () => {
  formData.title = ''
  formData.description = ''
  formData.category = '工作'
  formData.dueDatetime = ''
}

watch(dialogVisible, (val) => {
  if (val) {
    nextTick(() => titleInputRef.value?.focus())
  }
})
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
