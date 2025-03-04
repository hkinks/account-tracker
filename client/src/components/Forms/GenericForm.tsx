import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Button from '../Buttons/Button';
import styled from 'styled-components';

// Styled components for forms
export const FormContainer = styled.div`
  width: 100%;
`;

export const FormGroup = styled.div`
  margin-bottom: 15px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  text-align: left;
  font-size: 12px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

export const Select = styled.select`
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  min-height: 80px;
`; 

// Define field types
export type FieldType = 'text' | 'number' | 'select' | 'textarea' | 'date';

// Define option type for select fields
export interface SelectOption {
  value: string;
  label: string;
}

// Define field configuration
export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: SelectOption[];
  step?: string;
  rows?: number;
  placeholder?: string;
  onChange?: (value: string) => Record<string, any> | void;
}

// Generic form props
export interface GenericFormProps<T> {
  fields: FormField[];
  initialData?: Partial<T>;
  onSubmit: (data: T) => void;
  submitButtonText?: string;
  isSubmitting?: boolean;
}

// Generic form component
export function GenericForm<T extends Record<string, any>>({
  fields,
  initialData = {},
  onSubmit,
  submitButtonText = 'Submit',
  isSubmitting = false
}: GenericFormProps<T>) {
  // Initialize form data from initialData or empty values
  const [formData, setFormData] = useState<T>(() => {
    const data: Record<string, any> = {};
    fields.forEach(field => {
      data[field.name] = initialData[field.name] !== undefined 
        ? initialData[field.name] 
        : field.type === 'number' ? 0 : '';
    });
    return data as T;
  });

  // Add this useEffect to update formData when initialData changes
  useEffect(() => {
    const updatedData: Record<string, any> = { ...formData };
    let hasChanges = false;
    
    fields.forEach(field => {
      if (initialData[field.name] !== undefined && initialData[field.name] !== formData[field.name]) {
        updatedData[field.name] = initialData[field.name];
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      setFormData(updatedData as T);
    }
  }, [initialData, fields]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const processedValue = type === 'number' ? parseFloat(value) : value;
    
    // Find the field definition to check for custom onChange handler
    const fieldDef = fields.find(field => field.name === name);
    
    setFormData(prev => {
      const updates = { ...prev, [name]: processedValue };
      
      // If this field has a custom onChange handler, apply additional updates
      if (fieldDef?.onChange) {
        const additionalUpdates = fieldDef.onChange(value);
        if (additionalUpdates) {
          return { ...updates, ...additionalUpdates };
        }
      }
      
      return updates;
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Render the appropriate field based on type
  const renderField = (field: FormField) => {
    const { name, type, required, options, step, rows, placeholder } = field;
    
    switch (type) {
      case 'select':
        return (
          <Select
            id={name}
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            required={required}
          >
            {!required && <option value="">Select an option</option>}
            {options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        );
      
      case 'textarea':
        return (
          <TextArea
            id={name}
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            required={required}
            rows={rows || 3}
            placeholder={placeholder}
          />
        );
      
      case 'number':
        return (
          <Input
            type="number"
            id={name}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            required={required}
            step={step || "1"}
            placeholder={placeholder}
          />
        );
      
      case 'date':
        return (
          <Input
            type="date"
            id={name}
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            required={required}
          />
        );
      
      default: // text
        return (
          <Input
            type="text"
            id={name}
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            required={required}
            placeholder={placeholder}
          />
        );
    }
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        {fields.map(field => (
          <FormGroup key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>
            {renderField(field)}
          </FormGroup>
        ))}
        <Button type="submit">{submitButtonText}</Button>
      </form>
    </FormContainer>
  );
} 