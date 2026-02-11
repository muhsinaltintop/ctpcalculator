/* ===================================================== */
/* ================= SOLVE FOR SELECTOR ================= */

export function SolveForSelector({
  value,
  onChange,
}: {
  value: SolveFor;
  onChange: (v: SolveFor) => void;
}) {
  const options: { value: SolveFor; label: string }[] = [
    { value: "towerCapability", label: "Tower Capability" },
    { value: "power", label: "Power" },
    { value: "coldWater", label: "Cold Water" },
    { value: "waterFlow", label: "Water Flow" },
  ];

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Solve For
      </label>

      <div className="flex flex-wrap gap-6 text-sm">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name="solveFor"
              checked={value === o.value}
              onChange={() => onChange(o.value)}
            />
            {o.label}
          </label>
        ))}
      </div>
    </div>
  );
}
