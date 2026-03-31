export default function Input({ label, type = 'text', value, onChange, placeholder, required = false, className = '' }) {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      {label && <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
      />
    </div>
  );
}
