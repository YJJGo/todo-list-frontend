import axios from 'axios'
import type { Todo, SortType  } from '@/types/todo'

// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://localhost:8080/todo', // 后端地址
  timeout: 5000
})

// 响应拦截器：自动解包 data
request.interceptors.response.use(res => {
  return res.data // 这里取到的就是 Result 对象
})

export const todoApi = {
  // 获取列表
    fetchTodos: async (sortBy: SortType = 'createDatetime'): Promise<Todo[]> => {
        const res: any = await request.post('/list', { sortBy })
        return res.code === 200 ? res.data : []
    },

  // 添加任务
  addTodo: async (payload: any): Promise<Todo> => {
    const res: any = await request.post('/add', payload)
    return res.data
  },

  // 删除
  deleteTodo: async (id: number) => {
    await request.delete(`/delete/${id}`)
    return true
  },

  // 切换状态
  toggleStatus: async (id: number, completed: boolean) => { // 注意这里稍微改了下参数
    // 后端 update 接口接收对象
    await request.put('/update', { id, completed: completed ? 1 : 0 })
    return true
  }
}
