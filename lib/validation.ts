/**
 * @deprecated This validation module was used by the old 3-step booking flow (DetailsStep.tsx).
 * The OTC iframe embed handles its own form validation internally.
 * Safe to remove once iframe integration is confirmed stable in production.
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim();

  if (!trimmed) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
}

export function validatePhone(phone: string): ValidationResult {
  const trimmed = phone.trim();

  // Phone is optional, so empty is valid
  if (!trimmed) {
    return { isValid: true };
  }

  // Remove common formatting characters
  const digitsOnly = trimmed.replace(/[\s\-\(\)\.]/g, '');

  // Check if it contains only digits and has a reasonable length
  if (!/^\d+$/.test(digitsOnly)) {
    return { isValid: false, error: 'Phone number should contain only digits' };
  }

  if (digitsOnly.length < 10) {
    return { isValid: false, error: 'Phone number is too short' };
  }

  if (digitsOnly.length > 15) {
    return { isValid: false, error: 'Phone number is too long' };
  }

  return { isValid: true };
}

export function validateRequired(value: string, fieldName: string): ValidationResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (trimmed.length < 2) {
    return { isValid: false, error: `${fieldName} is too short` };
  }

  return { isValid: true };
}

export function validateGroupSize(size: number, min: number, max: number): ValidationResult {
  if (size < min) {
    return { isValid: false, error: `Group size must be at least ${min}` };
  }

  if (size > max) {
    return { isValid: false, error: `Group size cannot exceed ${max}` };
  }

  return { isValid: true };
}

export interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export function validateCustomerForm(data: CustomerFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  const firstNameResult = validateRequired(data.firstName, 'First name');
  if (!firstNameResult.isValid) {
    errors.firstName = firstNameResult.error!;
  }

  const lastNameResult = validateRequired(data.lastName, 'Last name');
  if (!lastNameResult.isValid) {
    errors.lastName = lastNameResult.error!;
  }

  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.error!;
  }

  const phoneResult = validatePhone(data.phone);
  if (!phoneResult.isValid) {
    errors.phone = phoneResult.error!;
  }

  return errors;
}
