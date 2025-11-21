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
      <el-divider content-position="left">提醒设置 (可选)</el-divider>

      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="提前多久通知">
            <el-select v-model="formData.reminderPreTime" placeholder="不提醒" clearable style="width: 100%">
              <el-option label="提前 5 分钟" :value="5" />
              <el-option label="提前 15 分钟" :value="15" />
              <el-option label="提前 30 分钟" :value="30" />
              <el-option label="提前 1 小时" :value="60" />
              <el-option label="提前 3 小时" :value="180" />
              <el-option label="提前 1 天" :value="1440" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="14">
          <el-form-item label="通知邮箱">
            <el-input
              v-model="formData.email"
              placeholder="接收通知的 Email"
              clearable
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
  dueDatetime: '',
  reminderPreTime: undefined, // 新增：默认 undefined (即不提醒)
  email: localStorage.getItem('user_email') || ''
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

  // 逻辑检查：如果选了提醒时间，必须填邮箱，必须填截止日期
  if (formData.reminderPreTime) {
    if (!formData.dueDatetime) {
      ElMessage.warning('设置提醒必须选择截止时间')
      return
    }
    if (!formData.email) {
      ElMessage.warning('设置提醒必须填写邮箱')
      return
    }
    // 记住用户的邮箱，下次自动填
    localStorage.setItem('user_email', formData.email)
  }

  emit('add', { ...formData })
  dialogVisible.value = false
}

const resetForm = () => {
  formData.title = ''
  formData.description = ''
  formData.category = '工作'
  formData.dueDatetime = ''
  formData.reminderPreTime = undefined
  formData.email = localStorage.getItem('user_email') || ''
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
