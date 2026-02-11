/* ===================================================== */
/* ================= SIMPLE NUMBER FIELD ================ */

export function SimpleNumberField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">
        {label}
      </label>

      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full rounded-xl border px-3 py-2 ${
          error ? "border-red-500" : "border-slate-300"
        }`}
      />

      {error && (
        <p className="text-xs text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
