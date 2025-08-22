import React, { useState } from 'react';
import { Filter, X, Calendar, Star, Building, Tag } from 'lucide-react';
import { useReviews } from '../../contexts/ReviewsContext';
import { ReviewFilters as IReviewFilters } from '../../types/review';

const ReviewFilters: React.FC = () => {
  const { state, setFilters, resetFilters } = useReviews();
  const { filters, reviews, propertyPerformance } = state;
  
  const [isExpanded, setIsExpanded] = useState(true);

  const uniqueCategories = Array.from(
    new Set(reviews.flatMap(review => review.categories.map(cat => cat.category)))
  );
  
  const uniqueChannels = Array.from(
    new Set(reviews.map(review => review.channel))
  );
  
  const uniqueStatuses = Array.from(
    new Set(reviews.map(review => review.status))
  );

  const handleRatingChange = (rating: number, checked: boolean) => {
    const currentRatings = filters.rating || [];
    const newRatings = checked 
      ? [...currentRatings, rating]
      : currentRatings.filter(r => r !== rating);
    
    setFilters({ rating: newRatings.length > 0 ? newRatings : undefined });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const currentCategories = filters.category || [];
    const newCategories = checked
      ? [...currentCategories, category]
      : currentCategories.filter(c => c !== category);
    
    setFilters({ category: newCategories.length > 0 ? newCategories : undefined });
  };

  const handleChannelChange = (channel: string, checked: boolean) => {
    const currentChannels = filters.channel || [];
    const newChannels = checked
      ? [...currentChannels, channel]
      : currentChannels.filter(c => c !== channel);
    
    setFilters({ channel: newChannels.length > 0 ? newChannels : undefined });
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    const currentStatuses = filters.status || [];
    const newStatuses = checked
      ? [...currentStatuses, status]
      : currentStatuses.filter(s => s !== status);
    
    setFilters({ status: newStatuses.length > 0 ? newStatuses : undefined });
  };

  const handlePropertyChange = (propertyId: string, checked: boolean) => {
    const currentProperties = filters.property || [];
    const newProperties = checked
      ? [...currentProperties, propertyId]
      : currentProperties.filter(p => p !== propertyId);
    
    setFilters({ property: newProperties.length > 0 ? newProperties : undefined });
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    const currentRange = filters.dateRange || { start: new Date(), end: new Date() };
    const newRange = {
      ...currentRange,
      [field]: new Date(value)
    };
    
    setFilters({ dateRange: newRange });
  };

  const getActiveFiltersCount = (): number => {
    let count = 0;
    if (filters.rating?.length) count++;
    if (filters.category?.length) count++;
    if (filters.channel?.length) count++;
    if (filters.status?.length) count++;
    if (filters.property?.length) count++;
    if (filters.dateRange) count++;
    return count;
  };

  const hasActiveFilters = getActiveFiltersCount() > 0;

  return (
    <div className="review-filters card">
      <div className="card__header">
        <div className="review-filters__header">
          <div className="review-filters__title">
            <Filter className="review-filters__icon" />
            <h3>Filters</h3>
            {hasActiveFilters && (
              <span className="badge badge--primary">{getActiveFiltersCount()}</span>
            )}
          </div>
          
          <div className="review-filters__actions">
            <button
              className="btn btn--secondary btn--sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
            
            {hasActiveFilters && (
              <button
                className="btn btn--icon btn--sm"
                onClick={resetFilters}
                title="Clear all filters"
              >
                <X />
              </button>
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="card__content">
          {/* Rating Filter */}
          <div className="filter-group">
            <div className="filter-group__header">
              <Star className="filter-group__icon" />
              <h4>Rating</h4>
            </div>
            
            <div className="filter-options">
              {[5, 4, 3, 2, 1].map(rating => (
                <label key={rating} className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.rating?.includes(rating) || false}
                    onChange={(e) => handleRatingChange(rating, e.target.checked)}
                  />
                  <span className="filter-option__label">
                    {rating} Star{rating !== 1 ? 's' : ''}
                  </span>
                  <span className="filter-option__count">
                    ({reviews.filter(r => Math.ceil(r.overallRating / 2) === rating).length})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <div className="filter-group__header">
              <Tag className="filter-group__icon" />
              <h4>Categories</h4>
            </div>
            
            <div className="filter-options">
              {uniqueCategories.map(category => (
                <label key={category} className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.category?.includes(category) || false}
                    onChange={(e) => handleCategoryChange(category, e.target.checked)}
                  />
                  <span className="filter-option__label">
                    {category.replace('_', ' ')}
                  </span>
                  <span className="filter-option__count">
                    ({reviews.filter(r => r.categories.some(c => c.category === category)).length})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Channel Filter */}
          <div className="filter-group">
            <div className="filter-group__header">
              <Building className="filter-group__icon" />
              <h4>Channel</h4>
            </div>
            
            <div className="filter-options">
              {uniqueChannels.map(channel => (
                <label key={channel} className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.channel?.includes(channel) || false}
                    onChange={(e) => handleChannelChange(channel, e.target.checked)}
                  />
                  <span className="filter-option__label">
                    {channel.charAt(0).toUpperCase() + channel.slice(1)}
                  </span>
                  <span className="filter-option__count">
                    ({reviews.filter(r => r.channel === channel).length})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="filter-group">
            <div className="filter-group__header">
              <Filter className="filter-group__icon" />
              <h4>Status</h4>
            </div>
            
            <div className="filter-options">
              {uniqueStatuses.map(status => (
                <label key={status} className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.status?.includes(status) || false}
                    onChange={(e) => handleStatusChange(status, e.target.checked)}
                  />
                  <span className="filter-option__label">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                  <span className="filter-option__count">
                    ({reviews.filter(r => r.status === status).length})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Property Filter */}
          <div className="filter-group">
            <div className="filter-group__header">
              <Building className="filter-group__icon" />
              <h4>Properties</h4>
            </div>
            
            <div className="filter-options">
              {propertyPerformance.map(property => (
                <label key={property.propertyId} className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.property?.includes(property.propertyId) || false}
                    onChange={(e) => handlePropertyChange(property.propertyId, e.target.checked)}
                  />
                  <span className="filter-option__label">
                    {property.propertyName}
                  </span>
                  <span className="filter-option__count">
                    ({property.totalReviews})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="filter-group">
            <div className="filter-group__header">
              <Calendar className="filter-group__icon" />
              <h4>Date Range</h4>
            </div>
            
            <div className="date-range-inputs">
              <div className="form-group">
                <label className="form-label">From</label>
                <input
                  type="date"
                  className="form-input"
                  value={filters.dateRange?.start.toISOString().split('T')[0] || ''}
                  onChange={(e) => handleDateRangeChange('start', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">To</label>
                <input
                  type="date"
                  className="form-input"
                  value={filters.dateRange?.end.toISOString().split('T')[0] || ''}
                  onChange={(e) => handleDateRangeChange('end', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewFilters;
