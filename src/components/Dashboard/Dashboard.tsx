import React from 'react';
import { useReviews } from '../../contexts/ReviewsContext';
import DashboardHeader from '../../components/Dashboard/DashboardHeader';
import PropertyPerformance from '../../components/Dashboard/PropertyPerformance';
import ReviewFilters from '../../components/Dashboard/ReviewFilters';
import ReviewsList from '../../components/Dashboard/ReviewsList';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { state } = useReviews();
  const { isLoading, error } = state;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard__container">
        <DashboardHeader />
        
        <div className="dashboard__grid">
          {/* Property Performance Overview */}
          <div className="dashboard__section dashboard__section--full">
            <PropertyPerformance />
          </div>

          {/* Filters and Reviews */}
          <div className="dashboard__section dashboard__section--sidebar">
            <ReviewFilters />
          </div>

          <div className="dashboard__section dashboard__section--main">
            <ReviewsList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
