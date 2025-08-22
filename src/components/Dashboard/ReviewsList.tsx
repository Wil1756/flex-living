import React, { useState } from 'react';
import { Eye, EyeOff, Calendar, User, Building, ChevronDown, ChevronUp } from 'lucide-react';
import { useReviews } from '../../contexts/ReviewsContext';
import { formatDistanceToNow, format } from 'date-fns';
import RatingDisplay from '../common/RatingDisplay';

type SortField = 'submittedAt' | 'overallRating' | 'guestName' | 'listingName';
type SortDirection = 'asc' | 'desc';

const ReviewsList: React.FC = () => {
  const { getFilteredReviews, toggleReviewSelection } = useReviews();
  const [sortField, setSortField] = useState<SortField>('submittedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  const filteredReviews = getFilteredReviews();

  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === 'submittedAt') {
      aValue = a.submittedAt.getTime();
      bValue = b.submittedAt.getTime();
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const toggleReviewExpansion = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'published':
        return 'badge badge--success';
      case 'draft':
        return 'badge badge--warning';
      case 'pending':
        return 'badge badge--secondary';
      default:
        return 'badge badge--secondary';
    }
  };

  const getChannelBadgeClass = (channel: string) => {
    switch (channel) {
      case 'hostaway':
        return 'badge badge--primary';
      case 'google':
        return 'badge badge--success';
      case 'airbnb':
        return 'badge badge--error';
      default:
        return 'badge badge--secondary';
    }
  };



  const SortButton: React.FC<{ field: SortField; children: React.ReactNode }> = ({ field, children }) => (
    <button
      className={`sort-button ${sortField === field ? 'sort-button--active' : ''}`}
      onClick={() => handleSort(field)}
    >
      {children}
      {sortField === field && (
        sortDirection === 'asc' ? <ChevronUp className="sort-icon" /> : <ChevronDown className="sort-icon" />
      )}
    </button>
  );

  return (
    <div className="reviews-list card">
      <div className="card__header">
        <div className="reviews-list__header">
          <h3>Reviews ({sortedReviews.length})</h3>
          <p>Manage and select reviews for public display</p>
        </div>

        <div className="reviews-list__controls">
          <div className="sort-controls">
            <span className="sort-controls__label">Sort by:</span>
            <div className="sort-buttons">
              <SortButton field="submittedAt">Date</SortButton>
              <SortButton field="overallRating">Rating</SortButton>
              <SortButton field="guestName">Guest</SortButton>
              <SortButton field="listingName">Property</SortButton>
            </div>
          </div>
        </div>
      </div>

      <div className="card__content">
        {sortedReviews.length === 0 ? (
          <div className="empty-state">
            <Eye className="empty-state__icon" />
            <p>No reviews match your current filters</p>
          </div>
        ) : (
          <div className="reviews-grid">
            {sortedReviews.map((review) => {
              const isExpanded = expandedReviews.has(review.id);
              const reviewTextPreview = review.reviewText.length > 150 
                ? review.reviewText.substring(0, 150) + '...'
                : review.reviewText;

              return (
                <div key={review.id} className="review-card">
                  <div className="review-card__header">
                    <div className="review-card__meta">
                      <div className="review-card__rating">
                      <RatingDisplay 
                        rating={review.overallRating} 
                        size="sm" 
                        showStars={true}
                      />
                    </div>
                      
                      <div className="review-card__badges">
                        <span className={getStatusBadgeClass(review.isSelected ? 'published' : 'draft')}>
                          {review.isSelected ? 'published' : 'draft'}
                        </span>
                        <span className={getChannelBadgeClass(review.channel)}>
                          {review.channel}
                        </span>
                      </div>
                    </div>

                    <div className="review-card__actions">
                      <button
                        className={`btn btn--sm ${review.isSelected ? 'btn--success' : 'btn--secondary'}`}
                        onClick={() => toggleReviewSelection(review.id)}
                      >
                        {review.isSelected ? <Eye /> : <EyeOff />}
                        {review.isSelected ? 'Published' : 'Publish'}
                      </button>
                    </div>
                  </div>

                  <div className="review-card__content">
                    <div className="review-card__guest">
                      <User className="guest-icon" />
                      <span>{review.guestName}</span>
                    </div>

                    <div className="review-card__property">
                      <Building className="property-icon" />
                      <span>{review.listingName}</span>
                    </div>

                    <div className="review-card__date">
                      <Calendar className="date-icon" />
                      <span>{format(review.submittedAt, 'MMM dd, yyyy')}</span>
                      <span className="relative-date">
                        ({formatDistanceToNow(review.submittedAt, { addSuffix: true })})
                      </span>
                    </div>

                    <div className="review-card__text">
                      <p>{isExpanded ? review.reviewText : reviewTextPreview}</p>
                      
                      {review.reviewText.length > 150 && (
                        <button
                          className="expand-button"
                          onClick={() => toggleReviewExpansion(review.id)}
                        >
                          {isExpanded ? 'Show less' : 'Show more'}
                        </button>
                      )}
                    </div>

                    {review.categories.length > 0 && (
                      <div className="review-card__categories">
                        <h5>Category Ratings:</h5>
                        <div className="category-ratings">
                          {review.categories.map((category, index) => (
                            <div key={index} className="category-rating">
                              <span className="category-name">
                                {category.category.replace('_', ' ')}
                              </span>
                              <div className="category-rating-value">
                                <span className="category-rating-number">{category.rating}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsList;
