"use client";

import {
  loadProject,
  saveProject,
  resetProject,
  resetFanPlenum,
  FanPlenum,
  FAN_PLENUM_DEFAULTS,
} from "@/lib/projectStorage";
import { useState } from "react";

export default function FanPlenumPage() {
  const project = loadProject();

  if (
    !project.projectInformation ||
    !project.thermalConditions ||
    !project.towerGeometry ||
    !project.fillSection
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

  const [form, setForm] = useState<FanPlenum>(
    project.fanPlenum ?? FAN_PLENUM_DEFAULTS,
  );

  function update<K extends keyof FanPlenum>(
    key: K,
    value: FanPlenum[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onContinue() {
    saveProject({
      ...project,
      fanPlenum: form,
    });

    window.location.href = "/results";
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Fan & Plenum</h1>
          <p className="text-sm text-slate-600">
            Project: {project.projectInformation.projectName}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              resetFanPlenum();
              setForm(FAN_PLENUM_DEFAULTS);
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
            label="Fan Type"
            value={form.fanType}
            options={[
              { value: "Axial", label: "Axial Fan" },
              { value: "Centrifugal", label: "Centrifugal Fan" },
            ]}
            onChange={(v) =>
              update("fanType", v as FanPlenum["fanType"])
            }
          />

          <NumberField
            label="Air Flow Rate (m³/s)"
            value={form.airFlowRate}
            onChange={(v) => update("airFlowRate", v)}
          />

          <NumberField
            label="Fan Efficiency (%)"
            value={form.fanEfficiency}
            onChange={(v) => update("fanEfficiency", v)}
          />

          <NumberField
            label="Plenum Loss Coefficient"
            value={form.plenumLossCoeff}
            onChange={(v) => update("plenumLossCoeff", v)}
          />

          <NumberField
            label="Fan Static Pressure (Pa)"
            value={form.staticPressure}
            onChange={(v) => update("staticPressure", v)}
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
