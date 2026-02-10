'use client';

interface FormInputProps {
  label: string;
  type: 'text' | 'email' | 'tel' | 'date';
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  min?: string;
  max?: string;
}

export default function FormInput({
  label,
  type,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder,
  min,
  max,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-white">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        className={`
          w-full px-4 py-3 rounded-lg
          bg-neutral-900 text-white
          border transition-colors
          placeholder:text-neutral-500
          focus:outline-none focus:ring-2 focus:ring-primary/50
          ${
            error
              ? 'border-red-500 focus:border-red-500'
              : 'border-neutral-700 focus:border-primary'
          }
        `}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
