"use client";

import { TowerInputModel } from "@/lib/models/input";

type Props = {
  input: TowerInputModel;
  setInput: React.Dispatch<React.SetStateAction<TowerInputModel>>;
};

export default function GeometrySection({ input, setInput }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Geometry</h2>

      <div className="grid grid-cols-2 gap-4">
        <NumberField
          label="Fan Diameter"
          value={input.geometry.fanDiameter}
          onChange={(v) =>
            setInput((prev) => ({
              ...prev,
              geometry: { ...prev.geometry, fanDiameter: v },
            }))
          }
        />

        <NumberField
          label="Fill Height"
          value={input.geometry.fillHeight}
          onChange={(v) =>
            setInput((prev) => ({
              ...prev,
              geometry: { ...prev.geometry, fillHeight: v },
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
