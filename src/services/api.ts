import { NormalizedReview, PropertyPerformance } from '../types/review';
import { HostawayService } from './hostaway';
import { GoogleReviewsService } from './google';

/**
 * API Service to simulate endpoints
 */
export class ApiService {
  private static instance: ApiService;
  private hostawayService: HostawayService;
  private googleService: GoogleReviewsService;
  private reviewsCache: NormalizedReview[] | null = null;
  private selectedReviewIds: Set<string> = new Set();

  private constructor() {
    this.hostawayService = HostawayService.getInstance();
    this.googleService = GoogleReviewsService.getInstance();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  /**
   * GET /api/reviews/hostaway
   * Fetch and normalize reviews from Hostaway
   */
  public async getHostawayReviews(): Promise<NormalizedReview[]> {
    if (this.reviewsCache) {
      return this.reviewsCache;
    }

    try {
      const reviews = await this.hostawayService.getReviews();
      this.reviewsCache = reviews;
      return reviews;
    } catch (error) {
      console.error('Error fetching Hostaway reviews:', error);
      throw new Error('Failed to fetch reviews from Hostaway');
    }
  }

  /**
   * GET /api/reviews/google
   * Fetch Google reviews for properties (limited data)
   */
  public async getGoogleReviews(): Promise<NormalizedReview[]> {
    try {
      // Get unique property names from Hostaway data to search for Google reviews
      const hostawayReviews = await this.getHostawayReviews();
      const propertyNames = Array.from(new Set(hostawayReviews.map(r => r.listingName)));
      
      const allGoogleReviews: NormalizedReview[] = [];
      
      // Fetch Google reviews for each property (if available)
      for (const propertyName of propertyNames) {
        const googleReviews = await this.googleService.getPropertyReviews(propertyName);
        allGoogleReviews.push(...googleReviews);
      }
      
      return allGoogleReviews;
    } catch (error) {
      console.error('Error fetching Google reviews:', error);
      return [];
    }
  }

  /**
   * GET /api/reviews
   * Get all reviews from all sources
   */
  public async getAllReviews(): Promise<NormalizedReview[]> {
    const hostawayReviews = await this.getHostawayReviews();
    
    // Add Google Reviews if available
    let googleReviews: NormalizedReview[] = [];
    if (this.googleService.isAvailable()) {
      googleReviews = await this.getGoogleReviews();
    }
    
    const allReviews = [...hostawayReviews, ...googleReviews];
    
    return allReviews.map(review => ({
      ...review,
      isSelected: this.selectedReviewIds.has(review.id)
    }));
  }

  /**
   * GET /api/reviews/selected
   * Get only reviews selected for public display
   */
  public async getSelectedReviews(): Promise<NormalizedReview[]> {
    const allReviews = await this.getAllReviews();
    return allReviews.filter(review => review.isSelected);
  }

  /**
   * POST /api/reviews/select
   * Toggle review selection for public display
   */
  public async toggleReviewSelection(reviewId: string): Promise<boolean> {
    if (this.selectedReviewIds.has(reviewId)) {
      this.selectedReviewIds.delete(reviewId);
      return false;
    } else {
      this.selectedReviewIds.add(reviewId);
      return true;
    }
  }

  /**
   * GET /api/properties/performance
   * Calculate property performance metrics
   */
  public async getPropertyPerformance(): Promise<PropertyPerformance[]> {
    const reviews = await this.getAllReviews();
    const propertiesMap = new Map<string, NormalizedReview[]>();

    // Group reviews by property
    reviews.forEach(review => {
      if (!propertiesMap.has(review.propertyId)) {
        propertiesMap.set(review.propertyId, []);
      }
      propertiesMap.get(review.propertyId)!.push(review);
    });

    // Calculate performance metrics for each property
    const performance: PropertyPerformance[] = [];

    propertiesMap.forEach((propertyReviews, propertyId) => {
      const totalReviews = propertyReviews.length;
      const selectedReviews = propertyReviews.filter(r => r.isSelected).length;
      
      // Calculate average rating
      const averageRating = propertyReviews.reduce((sum, review) => sum + review.overallRating, 0) / totalReviews;
      
      // Calculate category ratings
      const categoryRatings: Record<string, number> = {};
      const categoryTotals: Record<string, { sum: number; count: number }> = {};
      
      propertyReviews.forEach(review => {
        review.categories.forEach(cat => {
          if (!categoryTotals[cat.category]) {
            categoryTotals[cat.category] = { sum: 0, count: 0 };
          }
          categoryTotals[cat.category].sum += cat.rating;
          categoryTotals[cat.category].count += 1;
        });
      });
      
      Object.entries(categoryTotals).forEach(([category, data]) => {
        categoryRatings[category] = data.sum / data.count;
      });

      // Determine trend 
      const recentReviews = propertyReviews
        .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
        .slice(0, Math.min(3, Math.floor(totalReviews / 2)));
      
      const olderReviews = propertyReviews
        .sort((a, b) => a.submittedAt.getTime() - b.submittedAt.getTime())
        .slice(0, Math.min(3, Math.floor(totalReviews / 2)));

      const recentAvg = recentReviews.reduce((sum, r) => sum + r.overallRating, 0) / Math.max(recentReviews.length, 1);
      const olderAvg = olderReviews.reduce((sum, r) => sum + r.overallRating, 0) / Math.max(olderReviews.length, 1);
      
      let recentTrend: 'up' | 'down' | 'stable' = 'stable';
      if (recentAvg > olderAvg + 0.5) recentTrend = 'up';
      else if (recentAvg < olderAvg - 0.5) recentTrend = 'down';

      // Get the most recent review date
      const lastReviewDate = propertyReviews.reduce((latest, review) => 
        review.submittedAt > latest ? review.submittedAt : latest, 
        new Date(0)
      );

      performance.push({
        propertyId,
        propertyName: propertyReviews[0].listingName,
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        selectedReviews,
        categoryRatings,
        recentTrend,
        lastReviewDate
      });
    });

    return performance.sort((a, b) => b.totalReviews - a.totalReviews);
  }

  /**
   * GET /api/integrations/google
   * Get Google Reviews integration status and information
   */
  public getGoogleIntegrationInfo() {
    return this.googleService.getIntegrationInfo();
  }

  /**
   * Clear cache 
   */
  public clearCache(): void {
    this.reviewsCache = null;
  }
}
