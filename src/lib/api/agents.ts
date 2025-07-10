
import { apiRequest } from './config';
import { ApiResponse } from '@/types/api';
import { Agent, PaginatedAgentResponse } from '@/types/Agent';

export const agentService = {
  getAll: (page = 1, search = "", status = "") =>
    apiRequest<ApiResponse<PaginatedAgentResponse>>(
      `/users/agents?page=${page}&search=${encodeURIComponent(search)}&status=${status}`
    ),

  getById: (id: number) =>
    apiRequest<ApiResponse<Agent>>(`/users/agents/${id}`),

  create: (agentData: FormData) =>
    apiRequest<ApiResponse<Agent>>('/users/agents', {
      method: 'POST',
      body: agentData,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    }),

  update: (id: number, agentData: FormData) =>
    apiRequest<ApiResponse<Agent>>(`/users/agents/${id}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      body: (() => {
        const form = agentData
        form.append("_method", "PUT")
        return form
      })(),
    }),

  delete: (id: number) =>
    apiRequest<ApiResponse<null>>(`/users/agents/${id}`, {
      method: 'DELETE',
    }),

  scanQrCode: (scanData: {
    child_id: string;
    parent_user_id: string;
    agent_id: string;
    recuperator_id?: string;
    type: 'entry' | 'exit';
    scanned_at?: string;
  }) =>
    apiRequest<ApiResponse<any>>('/agents/scan-qr-code', {
      method: 'POST',
      body: JSON.stringify(scanData),
    }),
};
