export * from './express';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface IAnalysisResult {
  language: string;
  meaning: string;
  historyId?: string;
}
