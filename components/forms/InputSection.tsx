"use client";

import { TowerInputModel } from "@/lib/models/input";

type Props = {
  input: TowerInputModel;
  setInput: React.Dispatch<React.SetStateAction<TowerInputModel>>;
};

export default function InputSection({ input, setInput }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Thermal Conditions</h2>

      <div className="grid grid-cols-2 gap-4">
        <NumberField
          label="Water Flow"
          value={input.thermal.waterFlow}
          onChange={(v) =>
            setInput((prev) => ({
              ...prev,
              thermal: { ...prev.thermal, waterFlow: v },
            }))
          }
        />

        <NumberField
          label="Hot Water Temp"
          value={input.thermal.hotWaterTemp}
          onChange={(v) =>
            setInput((prev) => ({
              ...prev,
              thermal: { ...prev.thermal, hotWaterTemp: v },
            }))
          }
        />

        <NumberField
          label="Cold Water Temp"
          value={input.thermal.coldWaterTemp}
          onChange={(v) =>
            setInput((prev) => ({
              ...prev,
              thermal: { ...prev.thermal, coldWaterTemp: v },
            }))
          }
        />

        <NumberField
          label="Wet Bulb Temp"
          value={input.thermal.wetBulbTemp}
          onChange={(v) =>
            setInput((prev) => ({
              ...prev,
              thermal: { ...prev.thermal, wetBulbTemp: v },
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
