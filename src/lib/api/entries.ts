
import { apiRequest } from './config';
import { ChildEntry } from './types';

export const entryService = {
  getAll: () =>
    apiRequest<ChildEntry[]>('/users/entries/all'),

  create: (entryData: Partial<ChildEntry>) =>
    apiRequest<ChildEntry>('/users/entries', {
      method: 'POST',
      body: JSON.stringify(entryData),
    }),
};
