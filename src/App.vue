<template>
  <div class="app-wrapper">
    <TodoList />
  </div>
</template>

<script setup lang="ts">
import TodoList from '@/views/TodoList.vue'
</script>

<style>
/* 全局重置或背景色建议放在这里或 main.css */
body {
  margin: 0;
  background-color: #f5f7fa;
}
.app-wrapper {
  display: flex;
  justify-content: center;
  padding-top: 50px;
  min-height: 100vh;
  padding-left: 10px;
  padding-right: 10px;
}
</style>
