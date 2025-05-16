/**
 * Analytics API client
 * Provides functions for interacting with the analytics API endpoints
 */

// Types
export interface AnalyticsStats {
  totalGenerations: number;
  websiteDescriptions: number;
  socialMediaContent: number;
  imagesProcessed: number;
  totalCreditsUsed: number;
  lastGeneratedAt?: string;
}

export interface ContentHistoryItem {
  id: string;
  contentType: string;
  platform: string | null;
  tone: string;
  createdAt: string;
  generatedContent: string;
  keywords: string[];
  isFavorite?: boolean;
}

export interface FavoriteItem {
  id: string;
  contentGenerationId: string;
  contentType: string;
  platform: string | null;
  tone: string;
  createdAt: string;
  generatedContent: string;
  keywords: string[];
  notes?: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// API functions

/**
 * Get analytics stats for the current user
 */
export async function getAnalyticsStats(): Promise<AnalyticsStats> {
  const response = await fetch('/api/analytics/stats');
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch analytics stats');
  }
  
  return response.json();
}

/**
 * Get content generation history for the current user
 */
export async function getContentHistory(page = 1, limit = 10): Promise<{
  history: ContentHistoryItem[];
  pagination: PaginationInfo;
}> {
  const response = await fetch(`/api/analytics/history?page=${page}&limit=${limit}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch content history');
  }
  
  return response.json();
}

/**
 * Get saved/favorite content for the current user
 */
export async function getFavorites(): Promise<FavoriteItem[]> {
  const response = await fetch('/api/analytics/favorites');
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch favorites');
  }
  
  return response.json();
}

/**
 * Add a content generation to favorites
 */
export async function addToFavorites(contentGenerationId: string, notes?: string): Promise<{
  id: string;
  contentGenerationId: string;
  isFavorite: boolean;
  notes: string | null;
  createdAt: string;
}> {
  const response = await fetch('/api/analytics/favorites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contentGenerationId,
      notes,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add to favorites');
  }
  
  return response.json();
}

/**
 * Remove a content generation from favorites
 */
export async function removeFromFavorites(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/analytics/favorites?id=${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to remove from favorites');
  }
  
  return response.json();
}

/**
 * Track a new content generation
 */
export async function trackContentGeneration(data: {
  contentType: string;
  platform?: string;
  tone: string;
  promptText?: string;
  generatedContent: string;
  keywords?: string[];
  mediaId?: string;
  creditsUsed?: number;
}): Promise<{
  success: boolean;
  id: string;
  trackedAt: string;
}> {
  const response = await fetch('/api/analytics/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to track content generation');
  }
  
  return response.json();
}
