
import { Recuperator } from './Recuperator'

export interface PaginatedRecuperatorResponse {
  data: Recuperator[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  total_actifs: number
  total_inactifs: number
  new_this_month: number
}
