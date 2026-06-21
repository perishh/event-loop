export default function StatusCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white border border-violet-100 rounded-xl p-4">
      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
        <Icon size={14} />
        <span>{label}</span>
      </div>
      <p className="text-sm font-semibold text-gray-900 truncate">{value}</p>
    </div>
  );
}
