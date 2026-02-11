/* ===================================================== */
/* ================= READ ONLY FIELD ==================== */

export function ReadOnlyField({
  label,
  value,
  unitSystem,
}: {
  label: string;
  value?: number;
  unitSystem: "SI" | "IP";
}) {
  // undefined gelirse render etme
  if (value === undefined || value === null) return null;

  // SI içerde tutuluyor → IP gerekiyorsa dönüştür
  const display =
    unitSystem === "SI"
      ? value
      : value * 9 / 5 + 32; // sadece temperature için kullanıyoruz

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">
        {label}
      </label>

      <input
        disabled
        value={display.toFixed(2)}
        className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-slate-600"
      />
    </div>
  );
}
