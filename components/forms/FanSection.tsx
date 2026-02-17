"use client";

import { TowerInputModel } from "@/lib/models/input";

type Props = {
  input: TowerInputModel;
  setInput: React.Dispatch<React.SetStateAction<TowerInputModel>>;
};

export default function FanSection({ input, setInput }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Fan</h2>

      <div className="grid grid-cols-2 gap-4">
        <NumberField
          label="Total Efficiency (%)"
          value={input.fan.totalEfficiency}
          onChange={(v) =>
            setInput((prev) => ({
              ...prev,
              fan: { ...prev.fan, totalEfficiency: v },
            }))
          }
        />

        <NumberField
          label="Transmission Efficiency (%)"
          value={input.fan.transmissionEfficiency}
          onChange={(v) =>
            setInput((prev) => ({
              ...prev,
              fan: { ...prev.fan, transmissionEfficiency: v },
            }))
          }
        />

        <NumberField
          label="Tip Clearance"
          value={input.fan.tipClearance}
          onChange={(v) =>
            setInput((prev) => ({
              ...prev,
              fan: { ...prev.fan, tipClearance: v },
            }))
          }
        />
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full border rounded px-3 py-2"
      />
    </div>
  );
}
