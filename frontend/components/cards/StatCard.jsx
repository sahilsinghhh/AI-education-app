export default function StatCard({ title, value, icon, bgColor = "bg-white", textColor = "text-blue-600" }) {
  return (
    <div className={`p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between transition-all hover:shadow-md ${bgColor}`}>
      <div>
        <p className="text-gray-500 font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-extrabold text-gray-900">{value}</h3>
      </div>
      <div className={`p-4 rounded-xl bg-opacity-10 bg-current ${textColor}`}>
        {icon}
      </div>
    </div>
  );
}
