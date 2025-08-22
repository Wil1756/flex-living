import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { NormalizedReview, PropertyPerformance, ReviewFilters } from '../types/review';
import { ApiService } from '../services/api';

// State Interface
interface ReviewsState {
  reviews: NormalizedReview[];
  selectedReviews: NormalizedReview[];
  propertyPerformance: PropertyPerformance[];
  filters: ReviewFilters;
  isLoading: boolean;
  error: string | null;
}

// Action Types
type ReviewsAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_REVIEWS'; payload: NormalizedReview[] }
  | { type: 'SET_SELECTED_REVIEWS'; payload: NormalizedReview[] }
  | { type: 'SET_PROPERTY_PERFORMANCE'; payload: PropertyPerformance[] }
  | { type: 'SET_FILTERS'; payload: ReviewFilters }
  | { type: 'TOGGLE_REVIEW_SELECTION'; payload: string }
  | { type: 'RESET_FILTERS' };

// Initial State
const initialState: ReviewsState = {
  reviews: [],
  selectedReviews: [],
  propertyPerformance: [],
  filters: {},
  isLoading: false,
  error: null
};

// Reducer
const reviewsReducer = (state: ReviewsState, action: ReviewsAction): ReviewsState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_REVIEWS':
      return { ...state, reviews: action.payload, isLoading: false };
    
    case 'SET_SELECTED_REVIEWS':
      return { ...state, selectedReviews: action.payload };
    
    case 'SET_PROPERTY_PERFORMANCE':
      return { ...state, propertyPerformance: action.payload };
    
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    
    case 'TOGGLE_REVIEW_SELECTION':
      return {
        ...state,
        reviews: state.reviews.map(review =>
          review.id === action.payload
            ? { ...review, isSelected: !review.isSelected }
            : review
        )
      };
    
    case 'RESET_FILTERS':
      return { ...state, filters: {} };
    
    default:
      return state;
  }
};

// Context Interface
interface ReviewsContextType {
  state: ReviewsState;
  fetchReviews: () => Promise<void>;
  fetchSelectedReviews: () => Promise<void>;
  fetchPropertyPerformance: () => Promise<void>;
  toggleReviewSelection: (reviewId: string) => Promise<void>;
  setFilters: (filters: Partial<ReviewFilters>) => void;
  resetFilters: () => void;
  getFilteredReviews: () => NormalizedReview[];
}

// Create Context
const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

// Provider Component
interface ReviewsProviderProps {
  children: ReactNode;
}

export const ReviewsProvider: React.FC<ReviewsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reviewsReducer, initialState);
  const apiService = ApiService.getInstance();

  // Fetch all reviews
  const fetchReviews = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const reviews = await apiService.getAllReviews();
      dispatch({ type: 'SET_REVIEWS', payload: reviews });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch reviews' });
      console.error('Error fetching reviews:', error);
    }
  };

  // Fetch selected reviews
  const fetchSelectedReviews = async (): Promise<void> => {
    try {
      const selectedReviews = await apiService.getSelectedReviews();
      dispatch({ type: 'SET_SELECTED_REVIEWS', payload: selectedReviews });
    } catch (error) {
      console.error('Error fetching selected reviews:', error);
    }
  };

  // Fetch property performance
  const fetchPropertyPerformance = async (): Promise<void> => {
    try {
      const performance = await apiService.getPropertyPerformance();
      dispatch({ type: 'SET_PROPERTY_PERFORMANCE', payload: performance });
    } catch (error) {
      console.error('Error fetching property performance:', error);
    }
  };

  // Toggle review selection
  const toggleReviewSelection = async (reviewId: string): Promise<void> => {
    try {
      await apiService.toggleReviewSelection(reviewId);
      dispatch({ type: 'TOGGLE_REVIEW_SELECTION', payload: reviewId });
      
      // Refresh selected reviews and property performance
      await fetchSelectedReviews();
      await fetchPropertyPerformance();
    } catch (error) {
      console.error('Error toggling review selection:', error);
    }
  };

  // Set filters
  const setFilters = (filters: Partial<ReviewFilters>): void => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  // Reset filters
  const resetFilters = (): void => {
    dispatch({ type: 'RESET_FILTERS' });
  };

  // Get filtered reviews based on current filters
  const getFilteredReviews = (): NormalizedReview[] => {
    let filtered = [...state.reviews];

    // Filter by rating
    if (state.filters.rating && state.filters.rating.length > 0) {
      filtered = filtered.filter(review => 
        state.filters.rating!.some(rating => Math.ceil(review.overallRating / 2) === rating)
      );
    }

    // Filter by category (reviews that have any of the selected categories)
    if (state.filters.category && state.filters.category.length > 0) {
      filtered = filtered.filter(review =>
        review.categories.some(cat => state.filters.category!.includes(cat.category))
      );
    }

    // Filter by channel
    if (state.filters.channel && state.filters.channel.length > 0) {
      filtered = filtered.filter(review => state.filters.channel!.includes(review.channel));
    }

    // Filter by status
    if (state.filters.status && state.filters.status.length > 0) {
      filtered = filtered.filter(review => state.filters.status!.includes(review.status));
    }

    // Filter by property
    if (state.filters.property && state.filters.property.length > 0) {
      filtered = filtered.filter(review => state.filters.property!.includes(review.propertyId));
    }

    // Filter by date range
    if (state.filters.dateRange) {
      const { start, end } = state.filters.dateRange;
      filtered = filtered.filter(review => 
        review.submittedAt >= start && review.submittedAt <= end
      );
    }

    return filtered;
  };

  // Load initial data
  useEffect(() => {
    fetchReviews();
  }, []);

  // Update dependent data when reviews change
  useEffect(() => {
    if (state.reviews.length > 0) {
      fetchSelectedReviews();
      fetchPropertyPerformance();
    }
  }, [state.reviews]);

  const contextValue: ReviewsContextType = {
    state,
    fetchReviews,
    fetchSelectedReviews,
    fetchPropertyPerformance,
    toggleReviewSelection,
    setFilters,
    resetFilters,
    getFilteredReviews
  };

  return (
    <ReviewsContext.Provider value={contextValue}>
      {children}
    </ReviewsContext.Provider>
  );
};

// Custom hook to use the context
export const useReviews = (): ReviewsContextType => {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};
