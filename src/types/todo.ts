// src/types/todo.ts
export interface Todo {
  id: number
  title: string
  description?: string
  completed: boolean
  create_datetime: number
}

export type FilterType = 'all' | 'active' | 'completed'
