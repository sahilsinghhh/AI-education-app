export default function Button({ children, onClick, variant = 'primary', className = '', ...props }) {
  const baseStyle = "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none";
  let variantStyle = "";

  if (variant === 'primary') {
    variantStyle = "bg-blue-600 text-white hover:bg-blue-700";
  } else if (variant === 'secondary') {
    variantStyle = "bg-gray-200 text-gray-800 hover:bg-gray-300";
  } else if (variant === 'outline') {
    variantStyle = "border border-blue-600 text-blue-600 hover:bg-blue-50";
  }

  return (
    <button onClick={onClick} className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
      {children}
    </button>
  );
}
