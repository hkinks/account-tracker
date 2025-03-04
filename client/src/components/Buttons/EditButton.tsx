import React from 'react';
import Button from './Button';

interface EditButtonProps {
  onClick: () => void;
  title?: string;
}

const EditButton: React.FC<EditButtonProps> = ({ onClick, title = 'Edit' }) => {
  return (
    <Button 
      onClick={onClick} 
      title={title}
      variant="primary"
      size="small"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25Z" fill="currentColor" />
        <path d="M20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="currentColor" />
      </svg>
    </Button>
  );
};

export default EditButton; 