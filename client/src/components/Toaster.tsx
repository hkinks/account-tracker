import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Toast types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
};

// Styled components
const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const ToasterContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ToastWrapper = styled.div<{ type: string }>`
  min-width: 250px;
  max-width: 350px;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  animation: ${slideIn} 0.3s ease-out;
  
  ${({ type }) => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return `
          background-color: #d4edda;
          border-left: 4px solid #28a745;
          color: #155724;
        `;
      case TOAST_TYPES.ERROR:
        return `
          background-color: #f8d7da;
          border-left: 4px solid #dc3545;
          color: #721c24;
        `;
      case TOAST_TYPES.INFO:
        return `
          background-color: #d1ecf1;
          border-left: 4px solid #17a2b8;
          color: #0c5460;
        `;
      default:
        return '';
    }
  }}
`;

const ToastContent = styled.div`
  flex: 1;
`;

const ToastMessage = styled.span`
  font-size: 14px;
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  margin-left: 10px;
  opacity: 0.5;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

// Define TypeScript interfaces
interface ToastProps {
  id: number;
  type: string;
  message: string;
  onClose: (id: number) => void;
}

interface ToastItem {
  id: number;
  type: string;
  message: string;
}

// Create a proper declaration for the window object
declare global {
  interface Window {
    toaster?: {
      success: (message: string) => number;
      error: (message: string) => number;
      info: (message: string) => number;
      remove: (id: number) => void;
    };
  }
}

// Toast component for individual notifications
const Toast: React.FC<ToastProps> = ({ id, type, message, onClose }) => {
  useEffect(() => {
    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <ToastWrapper type={type}>
      <ToastContent>
        <ToastMessage>{message}</ToastMessage>
      </ToastContent>
      <CloseButton onClick={() => onClose(id)}>
        ×
      </CloseButton>
    </ToastWrapper>
  );
};

// Main Toaster component that manages multiple toasts
const Toaster: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Function to add a new toast
  const addToast = (type: string, message: string): number => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, type, message }]);
    return id;
  };

  // Function to remove a toast
  const removeToast = (id: number): void => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  // Expose methods to the window for global access
  useEffect(() => {
    window.toaster = {
      success: (message: string) => addToast(TOAST_TYPES.SUCCESS, message),
      error: (message: string) => addToast(TOAST_TYPES.ERROR, message),
      info: (message: string) => addToast(TOAST_TYPES.INFO, message),
      remove: removeToast,
    };

    return () => {
      delete window.toaster;
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <ToasterContainer>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={removeToast}
        />
      ))}
    </ToasterContainer>
  );
};

export default Toaster; 