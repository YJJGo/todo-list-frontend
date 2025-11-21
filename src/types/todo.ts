export interface Todo {
  id: number
  title: string
  description?: string
  completed: boolean
  category: string
  email?: string
  reminderPreTime?: number
  reminderSent?: boolean
  dueDatetime?: number
  createDatetime: number
  updateDatetime: number
}

export type FilterType = 'all' | 'active' | 'completed'
export type CategoryType = '全部' | '工作' | '学习' | '生活' | '其他'
export type SortType = 'createDatetime' | 'dueDatetime'
