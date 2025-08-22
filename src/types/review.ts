// Hostaway API Response Types
export interface HostawayReviewCategory {
  category: string;
  rating: number;
}

export interface HostawayReview {
  id: number;
  type: 'host-to-guest' | 'guest-to-host';
  status: 'published' | 'draft' | 'pending';
  rating: number | null;
  publicReview: string;
  reviewCategory: HostawayReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
}

export interface HostawayApiResponse {
  status: 'success' | 'error';
  result: HostawayReview[];
}

// Normalized Review Types for our application
export interface ReviewCategory {
  category: string;
  rating: number;
}

export interface NormalizedReview {
  id: string;
  type: 'host-to-guest' | 'guest-to-host';
  status: 'published' | 'draft' | 'pending';
  overallRating: number;
  reviewText: string;
  categories: ReviewCategory[];
  submittedAt: Date;
  guestName: string;
  listingName: string;
  channel: 'hostaway' | 'google' | 'airbnb';
  isSelected: boolean; // For manager to select which reviews to display publicly
  propertyId: string; // Extracted from listing name or separate field
}

// Dashboard Filter Types
export interface ReviewFilters {
  rating?: number[];
  category?: string[];
  channel?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: string[];
  property?: string[];
}

// Property Performance Types
export interface PropertyPerformance {
  propertyId: string;
  propertyName: string;
  totalReviews: number;
  averageRating: number;
  selectedReviews: number;
  categoryRatings: Record<string, number>;
  recentTrend: 'up' | 'down' | 'stable';
  lastReviewDate: Date;
}
