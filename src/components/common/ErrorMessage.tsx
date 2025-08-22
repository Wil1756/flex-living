import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  className = '' 
}) => {
  return (
    <div className={`error-message ${className}`}>
      <div className="error-message__content">
        <AlertCircle className="error-message__icon" />
        <div>
          <h3>Something went wrong</h3>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
