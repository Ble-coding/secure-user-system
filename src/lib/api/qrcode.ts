
import { apiRequest } from './config';
import { QRScanRequest, ChildEntry } from './types';

export const qrCodeService = {
  scanQRCode: (scanData: QRScanRequest) =>
    apiRequest<{ entry: ChildEntry; warnings?: string[] }>('/agents/scan-qr-code', {
      method: 'POST',
      body: JSON.stringify(scanData),
    }),

  validateChild: (childCode: string) =>
    apiRequest<{ valid: boolean; child?: any }>(`/children/validate/${childCode}`),

  validateAgent: (agentCode: string) =>
    apiRequest<{ valid: boolean; agent?: any }>(`/agents/validate/${agentCode}`),

  getRecentScans: (limit: number = 10) =>
    apiRequest<ChildEntry[]>(`/entries/recent?limit=${limit}`),
};
