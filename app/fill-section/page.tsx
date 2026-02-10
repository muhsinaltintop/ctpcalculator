"use client";

import {
  loadProject,
  saveProject,
  resetProject,
  resetFillSection,
  FillSection,
  FILL_SECTION_DEFAULTS,
} from "@/lib/projectStorage";
import { useState } from "react";
import { UnitNumberField } from "@/components/UnitNumberField";

export default function FillSectionPage() {
  const project = loadProject();

  if (
    !project.projectInformation ||
    !project.thermalConditions ||
    !project.towerGeometry
  ) {
    return (
      <main className="p-6">
        <p className="text-red-600">
          Önceki adımlar eksik. Lütfen sırayla ilerleyin.
        </p>
        <a
          href="/"
          className="mt-4 inline-block rounded-xl bg-slate-900 px-4 py-2 text-white"
        >
          Go to Start
        </a>
      </main>
    );
  }

  const unitSystem = project.projectInformation.units;

  // 🔒 HER ZAMAN SI
  const [form, setForm] = useState<FillSection>(
    project.fillSection ?? FILL_SECTION_DEFAULTS,
  );

  function update<K extends keyof FillSection>(
    key: K,
    value: FillSection[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onContinue() {
    saveProject({
      ...project,
      fillSection: form, // SI
    });

    window.location.href = "/fan-plenum";
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Fill Section</h1>
          <p className="text-sm text-slate-600">
            Project: {project.projectInformation.projectName}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              resetFillSection();
              setForm(FILL_SECTION_DEFAULTS);
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
          <SelectField
            label="Fill Type"
            value={form.fillType}
            options={[
              { value: "Film", label: "Film Fill" },
              { value: "Splash", label: "Splash Fill" },
            ]}
            onChange={(v) =>
              update("fillType", v as FillSection["fillType"])
            }
          />

          {/* Unit-aware */}
          <UnitNumberField
            label="Fill Height"
            quantity="length"
            siValue={form.fillHeight}
            unitSystem={unitSystem}
            onChangeSI={(v) => update("fillHeight", v)}
          />

          {/* Unitless */}
          <SimpleNumberField
            label="Effective Surface Factor"
            value={form.surfaceFactor}
            onChange={(v) => update("surfaceFactor", v)}
          />

          <SimpleNumberField
            label="Merkel Constant (kₐ)"
            value={form.merkelKa}
            onChange={(v) => update("merkelKa", v)}
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
