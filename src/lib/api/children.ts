
import { apiRequest } from './config';
import { Child } from './types';

export const childService = {
  getAll: () =>
    apiRequest<Child[]>('/users/children'),

  getById: (id: number) =>
    apiRequest<Child>(`/users/children/${id}`),

  create: (childData: Partial<Child>) =>
    apiRequest<Child>('/users/children', {
      method: 'POST',
      body: JSON.stringify(childData),
    }),

  update: (id: number, childData: Partial<Child>) =>
    apiRequest<Child>(`/users/children/${id}`, {
      method: 'PUT',
      body: JSON.stringify(childData),
    }),

  delete: (id: number) =>
    apiRequest(`/users/children/${id}`, {
      method: 'DELETE',
    }),
};
