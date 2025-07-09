
import { apiRequest } from './config';
import { Agent, ChildEntry } from './types';

export const agentService = {
  getAll: () =>
    apiRequest<Agent[]>('/users/agents'),

  getById: (id: number) =>
    apiRequest<Agent>(`/users/agents/${id}`),

  create: (agentData: Partial<Agent>) =>
    apiRequest<Agent>('/users/agents', {
      method: 'POST',
      body: JSON.stringify(agentData),
    }),

  update: (id: number, agentData: Partial<Agent>) =>
    apiRequest<Agent>(`/users/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(agentData),
    }),

  delete: (id: number) =>
    apiRequest(`/users/agents/${id}`, {
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
    apiRequest<{ entry: ChildEntry; warnings?: string[] }>('/agents/scan-qr-code', {
      method: 'POST',
      body: JSON.stringify(scanData),
    }),
};
