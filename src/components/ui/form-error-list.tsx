interface FormErrorListProps {
  errors: string[];
  className?: string;
}

export function FormErrorList({ errors, className }: FormErrorListProps) {
  if (errors.length === 0) return null;

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className || ''}`}>
      <p className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</p>
      <ul className="list-disc pl-5 space-y-1">
        {errors.map((err, i) => (
          <li key={i} className="text-sm text-red-700">{err}</li>
        ))}
      </ul>
    </div>
  );
}
