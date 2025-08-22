import { NormalizedReview } from '../types/review'

const GOOGLE_PLACES_CONFIG = {
  apiKey: '', 
  baseUrl: 'https://maps.googleapis.com/maps/api/place'
};

// Google Places API response types
interface GooglePlaceReview {
  author_name: string;
  author_url: string;
  language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string; 
  time: number; 
}

interface GooglePlaceDetailsResponse {
  result: {
    place_id: string;
    name: string;
    rating: number;
    reviews: GooglePlaceReview[];
    user_ratings_total: number;
  };
  status: string;
}

export class GoogleReviewsService {
  private static instance: GoogleReviewsService;
  
  private constructor() {}
  
  public static getInstance(): GoogleReviewsService {
    if (!GoogleReviewsService.instance) {
      GoogleReviewsService.instance = new GoogleReviewsService();
    }
    return GoogleReviewsService.instance;
  }

  /**
   * Search for a place to get its place_id
   */
  public async searchPlace(query: string): Promise<string | null> {
    try {
      // const response = await fetch(
      //   `${GOOGLE_PLACES_CONFIG.baseUrl}/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_PLACES_CONFIG.apiKey}`
      // );
      
      // For demo purposes, return a mock place_id
      // console.log(`Searching place: ${query}`);
      return 'ChIJN1t_tDeuEmsRUsoyG83frY4'; // Mock place_id for demo
    } catch (error) {
      console.error('Error searching for place:', error);
      return null;
    }
  }

  /**
   * Fetch reviews for a specific place using place_id
   */
  public async fetchPlaceReviews(placeId: string): Promise<GooglePlaceReview[]> {
    try {
      // const response = await fetch(
      //   `${GOOGLE_PLACES_CONFIG.baseUrl}/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${GOOGLE_PLACES_CONFIG.apiKey}`
      // );
      // const data: GooglePlaceDetailsResponse = await response.json();
      // return data.result.reviews || [];
      
      // For demo purposes, return mock limited Google reviews
      const mockGoogleReviews: GooglePlaceReview[] = [
        {
          author_name: "John Smith",
          author_url: "https://www.google.com/maps/contrib/123",
          language: "en",
          profile_photo_url: "https://lh3.googleusercontent.com/a/default-user",
          rating: 5,
          relative_time_description: "2 months ago",
          text: "Excellent property! Clean, modern, and great location. Would definitely recommend to anyone visiting London.",
          time: 1640995200
        },
        {
          author_name: "Sarah Wilson",
          author_url: "https://www.google.com/maps/contrib/456", 
          language: "en",
          profile_photo_url: "https://lh3.googleusercontent.com/a/default-user",
          rating: 4,
          relative_time_description: "3 months ago",
          text: "Good apartment but had some minor issues with heating. Overall pleasant stay.",
          time: 1638316800
        }
      ];
      
      return mockGoogleReviews;
    } catch (error) {
      console.error('Error fetching Google reviews:', error);
      return [];
    }
  }

  /**
   * Normalize Google reviews to our internal format
   */
  public normalizeGoogleReviews(
    googleReviews: GooglePlaceReview[], 
    propertyName: string
  ): NormalizedReview[] {
    return googleReviews.map((review, index) => ({
      id: `google-${review.time}-${index}`,
      type: 'guest-to-host' as const,
      status: 'published' as const,
      overallRating: review.rating,
      reviewText: review.text,
      categories: [], 
      submittedAt: new Date(review.time * 1000),
      guestName: review.author_name,
      listingName: propertyName,
      channel: 'google' as const,
      isSelected: false,
      propertyId: this.generatePropertyId(propertyName)
    }));
  }

  /**
   * Generate a property ID from property name
   */
  private generatePropertyId(propertyName: string): string {
    return propertyName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20);
  }

  /**
   * Get Google reviews for a property by searching and fetching
   */
  public async getPropertyReviews(propertyName: string): Promise<NormalizedReview[]> {
    try {
      const placeId = await this.searchPlace(propertyName);
      if (!placeId) {
        console.warn(`Could not find Google place for: ${propertyName}`);
        return [];
      }

      const googleReviews = await this.fetchPlaceReviews(placeId);
      return this.normalizeGoogleReviews(googleReviews, propertyName);
    } catch (error) {
      console.error('Error getting Google reviews:', error);
      return [];
    }
  }

  /**
   * Check if Google Reviews integration is available
   */
  public isAvailable(): boolean {
    return Boolean(GOOGLE_PLACES_CONFIG.apiKey);
  }

  /**
   * Get integration status and limitations
   */
  public getIntegrationInfo() {
    return {
      available: this.isAvailable(),
      limitations: [
        'Only 5 most recent reviews available',
        'Review text limited to ~200 characters',
        'No category ratings provided',
        'Requires Google Places API key',
        'Rate limited to 100 requests per 100 seconds',
        'Full reviews only available via Google My Business API (business owner access)'
      ],
      alternatives: [
        'Google My Business API (business owner only)',
        'Third-party review management platforms',
        'Direct Google Business Profile integration',
        'Review tracking services (ReviewTrackers, Podium, etc.)'
      ],
      recommendation: 'For comprehensive review management, consider using Google My Business API (requires business verification) or a third-party review management platform.'
    };
  }
}
