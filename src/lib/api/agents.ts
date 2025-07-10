
import { apiRequest } from './config';
import { ApiResponse } from '@/types/api';
import { Agent, PaginatedAgentResponse } from '@/types/Agent';

export const agentService = {
  getAll: (page = 1, search = "", status = "") =>
    apiRequest<ApiResponse<PaginatedAgentResponse>>(
      `/users/agents?page=${page}&search=${encodeURIComponent(search)}&status=${status}`
    ),

  getById: (code: string) =>
    apiRequest<ApiResponse<Agent>>(`/users/agents/${code}`),

  create: (agentData: FormData) =>
    apiRequest<ApiResponse<Agent>>('/users/agents', {
      method: 'POST',
      body: agentData,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    }),

  update: (code: string, agentData: FormData) =>
    apiRequest<ApiResponse<Agent>>(`/users/agents/${code}`, {
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

    delete: (code: string) =>
      apiRequest<ApiResponse<null>>(`/users/agents/${code}`, {
        method: 'DELETE',
      }),

    restore: (code: string) =>
    apiRequest<ApiResponse<Agent>>(`/users/agents/${encodeURIComponent(code)}/restore`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    }),


  scanQrCode: (scanData: {
    child_id: string;
    parent_user_id: string;
    agent_id: string;
    recuperator_id?: string;
    type: 'entry' | 'exit';
    scanned_at?: string;
  }) =>
    apiRequest<ApiResponse<unknown>>('/agents/scan-qr-code', {
      method: 'POST',
      body: JSON.stringify(scanData),
    }),
};
