interface EventFieldErrorProps {
  error: string | undefined;
}

export default function EventFieldError({ error }: EventFieldErrorProps) {
  if (!error) return null;
  return (
    <p className="text-sm text-red-500 mt-1 flex items-center">
      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
      {error}
    </p>
  );
}
