import React from 'react';
import { FaTrash } from 'react-icons/fa';
import Button from './Button';

interface DeleteButtonProps {
  onClick: () => void;
  disabled?: boolean;
  title?: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ 
  onClick, 
  disabled = false, 
  title = "Delete" 
}) => {
  return (
    <Button
      variant="secondary"
      size="small"
      onClick={onClick}
      disabled={disabled}
      title={title}
      icon={<FaTrash />}
    />
  );
};

export default DeleteButton; 