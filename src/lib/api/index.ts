
// Export all types
export * from './types';

// Export all services
export { authService } from './auth';
export { userService } from './users';
export { agentService } from './agents';
export { parentService } from './parents';
export { childService } from './children';
export { recuperatorService } from './recuperators';
export { entryService } from './entries';
export { qrCodeService } from './qrcode';

// Export configuration utilities
export { API_BASE_URL, getAuthHeaders, apiRequest } from './config';

// Export new types
export type { ApiResponse } from '@/types/api';
export type { Agent, PaginatedAgentResponse } from '@/types/Agent';
