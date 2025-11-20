// src/api/todoApi.ts
import type { Todo } from '../types/todo.ts'

// 模拟数据库初始数据
let mockData: Todo[] = [
  { id: 1, title: '学习 Vue 3', description: '熟悉 Composition API', completed: true, createdAt: Date.now() },
  { id: 2, title: '完成代码重构', description: '拆分组件结构', completed: false, createdAt: Date.now() }
]

export const todoApi = {
  // 获取列表
  fetchTodos: (): Promise<Todo[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockData]), 500)
    })
  },

  // 添加任务
  addTodo: (title: string, description: string): Promise<Todo> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newItem: Todo = {
          id: Date.now(),
          title,
          description,
          completed: false,
          createdAt: Date.now()
        }
        mockData.unshift(newItem)
        resolve(newItem)
      }, 300)
    })
  },

  // 删除任务
  deleteTodo: (id: number): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockData = mockData.filter(item => item.id !== id)
        resolve(true)
      }, 200)
    })
  },

  // 切换状态 (虽然前端可以直接改，但为了模拟真实场景，保留接口)
  toggleStatus: (id: number): Promise<boolean> => {
    return Promise.resolve(true)
  }
}
