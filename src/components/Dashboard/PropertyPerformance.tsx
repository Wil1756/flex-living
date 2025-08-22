import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, Calendar, MessageSquare } from 'lucide-react';
import { useReviews } from '../../contexts/ReviewsContext';
import { formatDistanceToNow } from 'date-fns';
import RatingDisplay from '../common/RatingDisplay';

const PropertyPerformance: React.FC = () => {
  const { state } = useReviews();
  const { propertyPerformance } = state;

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="trend-icon trend-icon--up" />;
      case 'down':
        return <TrendingDown className="trend-icon trend-icon--down" />;
      default:
        return <Minus className="trend-icon trend-icon--stable" />;
    }
  };

  const getTrendClass = (trend: 'up' | 'down' | 'stable') => {
    return `trend-indicator trend-indicator--${trend}`;
  };

  return (
    <div className="card">
      <div className="card__header">
        <h2>Property Performance Overview</h2>
        <p>Monitor performance across all your properties</p>
      </div>

      <div className="card__content">
        {propertyPerformance.length === 0 ? (
          <div className="empty-state">
            <MessageSquare className="empty-state__icon" />
            <p>No property performance data available</p>
          </div>
        ) : (
          <div className="property-performance">
            <div className="property-performance__grid">
              {propertyPerformance.map((property) => (
                <div key={property.propertyId} className="property-card">
                  <div className="property-card__header">
                    <div className="property-card__title">
                      <h3>{property.propertyName}</h3>
                      <div className={getTrendClass(property.recentTrend)}>
                        {getTrendIcon(property.recentTrend)}
                      </div>
                    </div>
                    
                    <RatingDisplay 
                      rating={property.averageRating} 
                      size="sm" 
                      showStars={false}
                    />
                  </div>

                  <div className="property-card__metrics">
                    <div className="metric">
                      <div className="metric__value">{property.totalReviews}</div>
                      <div className="metric__label">Total Reviews</div>
                    </div>

                    <div className="metric">
                      <div className="metric__value">{property.selectedReviews}</div>
                      <div className="metric__label">Published</div>
                    </div>

                    <div className="metric">
                      <div className="metric__value">
                        {Math.round((property.selectedReviews / property.totalReviews) * 100)}%
                      </div>
                      <div className="metric__label">Publish Rate</div>
                    </div>
                  </div>

                  <div className="property-card__categories">
                    {Object.entries(property.categoryRatings)
                      .slice(0, 3)
                      .map(([category, rating]) => (
                        <div key={category} className="category-rating">
                          <span className="category-rating__label">
                            {category.replace('_', ' ')}
                          </span>
                          <span className="category-rating__value">
                            {rating.toFixed(1)}
                          </span>
                        </div>
                      ))}
                  </div>

                  <div className="property-card__footer">
                    <div className="property-card__last-review">
                      <Calendar className="last-review-icon" />
                      <span>
                        {formatDistanceToNow(property.lastReviewDate, { addSuffix: true })}
                      </span>
                    </div>

                    <Link 
                      to={`/property/${property.propertyId}`}
                      className="btn btn--primary btn--sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyPerformance;
