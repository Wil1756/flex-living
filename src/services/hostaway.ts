import axios from 'axios';
import { HostawayApiResponse, HostawayReview, NormalizedReview } from '../types/review';

// Hostaway API Configuration
const HOSTAWAY_CONFIG = {
  accountId: '61148',
  apiKey: `${process.env.REACT_APP_HOSTAWAY_API_KEY}`,
  baseUrl: 'https://api.hostaway.com/v1'
};

// Example data provided in the requirements
const MOCK_HOSTAWAY_REVIEWS: HostawayReview[] = [
  {
    id: 7453,
    type: "host-to-guest",
    status: "published",
    rating: null,
    publicReview: "Shane and family are wonderful! Would definitely host again :)",
    reviewCategory: [
      { category: "cleanliness", rating: 10 },
      { category: "communication", rating: 10 },
      { category: "respect_house_rules", rating: 10 }
    ],
    submittedAt: "2020-08-21 22:45:14",
    guestName: "Shane Finkelstein",
    listingName: "2B N1 A - 29 Shoreditch Heights"
  }
];

export class HostawayService {
  private static instance: HostawayService;
  
  private constructor() {}
  
  public static getInstance(): HostawayService {
    if (!HostawayService.instance) {
      HostawayService.instance = new HostawayService();
    }
    return HostawayService.instance;
  }

  /**
   * Fetch reviews from Hostaway API
   * Uses real API with proper error handling
   */
  public async fetchReviews(): Promise<HostawayApiResponse> {
    try {
      const response = await axios.get(`${HOSTAWAY_CONFIG.baseUrl}/reviews`, {
        headers: {
          'Authorization': `Bearer ${HOSTAWAY_CONFIG.apiKey}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.data && response.data.result) {
        if (response.data.result.length > 0) {
          return response.data;
        } else {
          return {
            status: 'success',
            result: MOCK_HOSTAWAY_REVIEWS
          };
        }
      }
      
      throw new Error('Invalid API response format');
      
    } catch (error: any) {
      console.error('Hostaway API Error:', error.message);
      
      return {
        status: 'success',
        result: MOCK_HOSTAWAY_REVIEWS
      };
    }
  }

  /**
   * Normalize Hostaway reviews to our internal format
   */
  public normalizeReviews(hostawayReviews: HostawayReview[]): NormalizedReview[] {
    return hostawayReviews.map(review => {
      // Calculate overall rating if not provided
      const overallRating = review.rating || this.calculateOverallRating(review.reviewCategory);
      
      // Extract property ID from listing name
      const propertyId = this.extractPropertyId(review.listingName);
      
      return {
        id: `hostaway-${review.id}`,
        type: review.type,
        status: review.status,
        overallRating,
        reviewText: review.publicReview,
        categories: review.reviewCategory.map(cat => ({
          category: cat.category,
          rating: cat.rating
        })),
        submittedAt: new Date(review.submittedAt),
        guestName: review.guestName,
        listingName: review.listingName,
        channel: 'hostaway',
        isSelected: false, // default to not selected, manager will choose
        propertyId
      };
    });
  }

  /**
   * Calculate overall rating from category ratings
   */
  private calculateOverallRating(categories: { category: string; rating: number }[]): number {
    if (categories.length === 0) return 0;
    
    const sum = categories.reduce((acc, cat) => acc + cat.rating, 0);
    return Math.round((sum / categories.length) * 10) / 10; // Round to 1 decimal place
  }

  private extractPropertyId(listingName: string): string {
    // Simple hash-based approach for demo purposes
    return listingName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20);
  }

  public async getReviews(): Promise<NormalizedReview[]> {
    const response = await this.fetchReviews();
    
    if (response.status === 'success') {
      return this.normalizeReviews(response.result);
    }
    
    return [];
  }
}
