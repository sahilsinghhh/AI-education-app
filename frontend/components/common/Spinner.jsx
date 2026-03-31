export default function Spinner({ size = 'md' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4'
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-gray-300 border-t-blue-600 ${sizes[size]}`}></div>
    </div>
  );
}
