"use client";

import { Quantity, QuantityMeta } from "@/lib/quantities";
import { toIP, toSI } from "@/lib/unitAdapters";

export function UnitNumberField({
  label,
  quantity,
  siValue,
  unitSystem,
  onChangeSI,
  error,
}: {
  label: string;
  quantity: Quantity;
  siValue: number;
  unitSystem: "SI" | "IP";
  onChangeSI: (v: number) => void;
  error?: string;
}) {
  const displayValue = unitSystem === "SI" ? siValue : toIP[quantity](siValue);

  const meta = QuantityMeta[quantity];

  console.log("quantity:", quantity);
  console.log("meta:", meta);

  const unitLabel =
    unitSystem === "SI"
      ? QuantityMeta[quantity]?.siUnit
      : QuantityMeta[quantity]?.ipUnit;

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">
        {label} ({unitLabel})
      </label>
      <input
        type="number"
        value={Number.isFinite(displayValue) ? displayValue : ""}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (!Number.isFinite(v)) return;

          onChangeSI(unitSystem === "SI" ? v : toSI[quantity](v));
        }}
        className={`w-full rounded-xl border px-3 py-2 ${
          error ? "border-red-500" : "border-slate-300"
        }`}
      />
    </div>
  );
}
