import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ReviewsProvider } from './contexts/ReviewsContext';
import Dashboard from './components/Dashboard/Dashboard';
import PropertyPage from './components/PropertyPage/PropertyPage';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <ReviewsProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/property/:propertyId" element={<PropertyPage />} />
            </Routes>
          </div>
        </Router>
      </ReviewsProvider>
    </ThemeProvider>
  );
}

export default App;
