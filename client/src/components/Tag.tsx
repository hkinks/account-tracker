import React, { useState } from 'react';
import styled from 'styled-components';
import { api } from '../services/api';

const TagInput = styled.input`
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  width: 120px;
`;

const TagDisplay = styled.span<{ color: string }>`
  padding: 4px 8px;
  background-color: ${(props) => props.color};
  border-radius: 4px;
  border: 1px solid #ccc;
  cursor: pointer;
  font-size: 14px;
  display: inline-block;
`;

interface TagManagerProps {
  tag?: string;
  transactionId?: number;
  onTagUpdate?: (transactionId: number, newTag: string) => void;
  tagColor?: string;
}

const Tag: React.FC<TagManagerProps> = ({
  tag,
  transactionId,
  tagColor = '#111',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tagValue, setTagValue] = useState(tag || '');

  // Function to update a transaction's tag
  const handleTagUpdate = (transactionId: number, newTag: string) => {
    api.updateTransactionTag(transactionId, newTag).catch((error) => {
      console.error('Error updating tag:', error);
      window.toaster?.error('Failed to update tag. Please try again.');
      setTagValue(tag || '');
    });
  };

  const handleTagClick = () => {
    setIsEditing(true);
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagValue(e.target.value);
  };

  const handleTagBlur = () => {
    setIsEditing(false);
    if (transactionId) {
      handleTagUpdate(transactionId, tagValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if (transactionId) {
        handleTagUpdate(transactionId, tagValue);
      }
    }
  };

  if (isEditing) {
    return (
      <TagInput
        type="text"
        value={tagValue}
        onChange={handleTagChange}
        onBlur={handleTagBlur}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    );
  }

  return (
    <TagDisplay onClick={handleTagClick} color={tag ? tagColor : 'transparent'}>
      {tagValue || '+'}
    </TagDisplay>
  );
};

export default Tag;
