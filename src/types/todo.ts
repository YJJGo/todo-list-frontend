// src/types/todo.ts
export interface Todo {
  id: number
  title: string
  description?: string
  completed: boolean
  createdAt: number
}

export type FilterType = 'all' | 'active' | 'completed'
