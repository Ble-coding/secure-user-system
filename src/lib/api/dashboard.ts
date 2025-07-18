import { apiRequest } from './config'
import { ApiResponse } from '@/types/api'


export interface DashboardOverview {
  total_users: number
  active_agents: number
  registered_parents: number
  today_recoveries: number
  qr_scans_week: number
  success_rate: number
  recent_activities: {
    id: number
    type: string
    status: string
    scanned_at: string
    recuperator: {
      full_name: string
      code: string
      photo?: string | null
    } | null
  }[]
  children_count: number
  children_trend: {
    value: number
    isPositive: boolean
  }
}


export const dashboardService = {
  async getOverview(): Promise<ApiResponse<DashboardOverview>> {
    return await apiRequest('/users/dashboard/overview')
  }
}
