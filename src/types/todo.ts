// src/types/todo.ts
export interface Todo {
  id: number
  title: string
  description?: string
  completed: boolean
  category: string  // 新增
  createDatetime: number
}

export type FilterType = 'all' | 'active' | 'completed'
export type CategoryType = '全部' | '工作' | '学习' | '生活' | '其他'
