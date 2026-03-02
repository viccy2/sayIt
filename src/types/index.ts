// Export the Express augmentation (though .d.ts files are usually picked up globally)
export * from './express';

/**
 * Shared interfaces for API Responses
 * This helps keep your Frontend and Backend types in sync.
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Analysis Result Interface
 */
export interface IAnalysisResult {
  language: string;
  meaning: string;
  historyId?: string;
}
