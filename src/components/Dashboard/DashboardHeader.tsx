import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Moon, Sun } from 'lucide-react';
import { useReviews } from '../../contexts/ReviewsContext';
import { useTheme } from '../../contexts/ThemeContext';

const DashboardHeader: React.FC = () => {
  const { fetchReviews, state } = useReviews();
  const { isDark, toggleTheme } = useTheme();
  
  const handleRefresh = async () => {
    await fetchReviews();
  };

  return (
    <header className="dashboard-header">
      <div className="dashboard-header__content">
        <div className="dashboard-header__title">
          <Link to="/dashboard" className="dashboard-header__logo-link">
            <img src="/theflexliving_logo.png" alt="Flex Living Logo" className="dashboard-header__logo" />
          </Link>
          <div>
            <h1>Flex Living</h1>
            <p>Reviews Dashboard - Manage and analyze property reviews across all channels</p>
          </div>
        </div>

        <div className="dashboard-header__actions">
          <button 
            className="btn btn--secondary"
            onClick={toggleTheme}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? <Sun /> : <Moon />}
            {isDark ? 'Light' : 'Dark'}
          </button>
          
          <button 
            className="btn btn--secondary"
            onClick={handleRefresh}
            disabled={state.isLoading}
            title="Refresh reviews"
          >
            <RefreshCw className={state.isLoading ? 'refresh-icon--spinning' : ''} />
            Refresh
          </button>
        </div>
      </div>

      <div className="dashboard-header__stats">
        <div className="stat-card">
          <div className="stat-card__value">{state.reviews.length}</div>
          <div className="stat-card__label">Total Reviews</div>
        </div>

        <div className="stat-card">
          <div className="stat-card__value">{state.selectedReviews.length}</div>
          <div className="stat-card__label">Published Reviews</div>
        </div>

        <div className="stat-card">
          <div className="stat-card__value">{state.propertyPerformance.length}</div>
          <div className="stat-card__label">Properties</div>
        </div>

        <div className="stat-card">
          <div className="stat-card__value">
            {state.reviews.length > 0 
              ? (state.reviews.reduce((sum, r) => sum + r.overallRating, 0) / state.reviews.length).toFixed(1)
              : '0.0'
            }
          </div>
          <div className="stat-card__label">Average Rating</div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
