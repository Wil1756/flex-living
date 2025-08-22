import React from 'react';
import { Star } from 'lucide-react';
import './RatingDisplay.css';

interface RatingDisplayProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  showStars?: boolean;
  className?: string;
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({ 
  rating, 
  size = 'md', 
  showValue = true, 
  showStars = true,
  className = '' 
}) => {
  // Ensure rating is valid and within bounds
  const validRating = Math.max(0, Math.min(10, rating || 0));
  
  // Convert 10-point scale to 5-star scale for display
  const starRating = validRating / 2;
  const fullStars = Math.floor(starRating);
  const hasHalfStar = starRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // Get color based on rating
  const getRatingColor = (rating: number): string => {
    if (rating >= 9) return 'var(--rating-excellent)';
    if (rating >= 8) return 'var(--rating-good)';
    if (rating >= 7) return 'var(--rating-average)';
    if (rating >= 6) return 'var(--rating-poor)';
    return 'var(--rating-very-poor)';
  };

  const getRatingLabel = (rating: number): string => {
    if (rating >= 9) return 'Excellent';
    if (rating >= 8) return 'Very Good';
    if (rating >= 7) return 'Good';
    if (rating >= 6) return 'Fair';
    return 'Poor';
  };

  const sizeClasses = {
    sm: 'rating-display--sm',
    md: 'rating-display--md',
    lg: 'rating-display--lg'
  };

  return (
    <div className={`rating-display ${sizeClasses[size]} ${className}`}>
      {showStars && (
        <div className="rating-display__stars">
          {fullStars > 0 && [...Array(fullStars)].map((_, i) => (
            <Star key={`full-${i}`} className="star star--filled" />
          ))}
          {hasHalfStar && <Star className="star star--half" />}
          {emptyStars > 0 && [...Array(emptyStars)].map((_, i) => (
            <Star key={`empty-${i}`} className="star star--empty" />
          ))}
        </div>
      )}
      
      {showValue && (
        <div className="rating-display__value">
          <span 
            className="rating-number" 
            style={{ color: getRatingColor(validRating) }}
          >
            {validRating.toFixed(1)}
          </span>
          <span className="rating-label">
            {getRatingLabel(validRating)}
          </span>
        </div>
      )}
    </div>
  );
};

export default RatingDisplay;
