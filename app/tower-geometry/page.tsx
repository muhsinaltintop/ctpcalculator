"use client";

import {
  loadProject,
  saveProject,
  resetProject,
  resetTowerGeometry,
  TOWER_GEOMETRY_DEFAULTS,
  TowerGeometry,
} from "@/lib/projectStorage";
import { useState } from "react";
import { UnitNumberField } from "@/components/UnitNumberField";
import Link from "next/link";

export default function TowerGeometryPage() {
  const project = loadProject();

  if (!project.projectInformation || !project.thermalConditions) {
    return (
      <main className="p-6">
        <p className="text-red-600">
          Önceki adımlar eksik. Lütfen sırayla ilerleyin.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-xl bg-slate-900 px-4 py-2 text-white"
        >
          Go to Start
        </Link>
      </main>
    );
  }

  const unitSystem = project.projectInformation.units;

  // 🔒 HER ZAMAN SI
  const [form, setForm] = useState<TowerGeometry>(
    project.towerGeometry ?? TOWER_GEOMETRY_DEFAULTS,
  );

  function update<K extends keyof TowerGeometry>(
    key: K,
    value: TowerGeometry[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onContinue() {
    saveProject({
      ...project,
      towerGeometry: form, // SI
    });

    window.location.href = "/fill-section";
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      {/* Header + resetler */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tower Geometry</h1>
          <p className="text-sm text-slate-600">
            Project: {project.projectInformation.projectName}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              resetTowerGeometry();
              setForm(TOWER_GEOMETRY_DEFAULTS);
            }}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          >
            Reset This Page
          </button>

          <button
            onClick={() => {
              resetProject();
              window.location.href = "/";
            }}
            className="rounded-xl border border-red-300 px-3 py-2 text-sm text-red-600"
          >
            Reset Project
          </button>
        </div>
      </header>

      {/* Form */}
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Unitless */}
          <SimpleNumberField
            label="Number of Cells"
            value={form.numberOfCells}
            onChange={(v) => update("numberOfCells", v)}
          />

          <SelectField
            label="Cell Arrangement"
            value={form.cellArrangement}
            options={[
              { value: "Inline", label: "Inline" },
              { value: "BackToBack", label: "Back-to-Back" },
            ]}
            onChange={(v) =>
              update(
                "cellArrangement",
                v as TowerGeometry["cellArrangement"],
              )
            }
          />

          <SelectField
            label="Air Inlet Configuration"
            value={form.airInletConfig}
            options={[
              { value: "BothEndsOpen", label: "Both Ends Open" },
              { value: "BothEndsClosed", label: "Both Ends Closed" },
              { value: "LeftEndClosed", label: "Left End Closed" },
              { value: "RightEndClosed", label: "Right End Closed" },
              { value: "ThreeSideClosed", label: "3 Side Closed" }
            ]}
            onChange={(v) =>
              update(
                "airInletConfig",
                v as TowerGeometry["airInletConfig"],
              )
            }
          />

          <SelectField
            label="Louver Type"
            value={form.louverType}
            options={[{ value: "CL80-3.2", label: 'CL80-3.2"' }]}
            onChange={(v) =>
              update("louverType", v as TowerGeometry["louverType"])
            }
          />

          <SimpleNumberField
            label="Louver Coefficient"
            value={form.louverCoefficient}
            onChange={(v) => update("louverCoefficient", v)}
          />

          <SimpleNumberField
            label="Inlet Obstruction (%)"
            value={form.inletObstruction}
            onChange={(v) => update("inletObstruction", v)}
          />

          {/* Unit-aware */}
          <UnitNumberField
            label="Inlet Height"
            quantity="length"
            siValue={form.inletHeight}
            unitSystem={unitSystem}
            onChangeSI={(v) => update("inletHeight", v)}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onContinue}
            className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-medium text-white"
          >
            Continue
          </button>
        </div>
      </section>
    </main>
  );
}

/* ---------- Small components ---------- */

function SimpleNumberField({
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
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
