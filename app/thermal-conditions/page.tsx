"use client";

import {
  loadProject,
  saveProject,
  resetProject,
  resetThermalConditions,
  THERMAL_DEFAULTS,
  ThermalConditions,
} from "@/lib/projectStorage";
import { useMemo, useState } from "react";

export default function ThermalConditionsPage() {
  const project = loadProject();

  if (!project.projectInformation) {
    return (
      <main className="p-6">
        <p className="text-red-600">
          Project Information bulunamadı. Lütfen ilk adıma dönün.
        </p>
        <a
          href="/"
          className="mt-4 inline-block rounded-xl bg-slate-900 px-4 py-2 text-white"
        >
          Go to Project Information
        </a>
      </main>
    );
  }

  const [form, setForm] = useState<ThermalConditions>(
    project.thermalConditions ?? THERMAL_DEFAULTS,
  );

  function update<K extends keyof ThermalConditions>(
    key: K,
    value: number,
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // 🔢 Derived values
  const hotWater = useMemo(
    () => form.coldWater + form.range,
    [form.coldWater, form.range],
  );

  const approach = useMemo(
    () => form.coldWater - form.wetBulb,
    [form.coldWater, form.wetBulb],
  );

  function onContinue() {
  saveProject({
    ...project,
    thermalConditions: form,
  });

  window.location.href = "/tower-geometry";
}


  return (
    <main className="mx-auto max-w-3xl p-6">
      {/* Header + Resetler */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Thermal Conditions</h1>
          <p className="text-sm text-slate-600">
            Project: {project.projectInformation.projectName}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              resetThermalConditions();
              setForm(THERMAL_DEFAULTS);
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
          <NumberField
            label="Cold Water Temperature (°C)"
            value={form.coldWater}
            onChange={(v) => update("coldWater", v)}
          />
          <NumberField
            label="Total Water Flow (m³/h)"
            value={form.totalFlow}
            onChange={(v) => update("totalFlow", v)}
          />
          <NumberField
            label="Wet Bulb Temperature (°C)"
            value={form.wetBulb}
            onChange={(v) => update("wetBulb", v)}
          />
          <NumberField
            label="Relative Humidity (%)"
            value={form.relativeHumidity}
            onChange={(v) => update("relativeHumidity", v)}
          />
          <NumberField
            label="Range (°C)"
            value={form.range}
            onChange={(v) => update("range", v)}
          />
          <NumberField
            label="Altitude (m)"
            value={form.altitude}
            onChange={(v) => update("altitude", v)}
          />
        </div>

        {/* Derived */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <ReadOnlyField
            label="Hot Water Temperature (°C)"
            value={hotWater}
          />
          <ReadOnlyField label="Approach (°C)" value={approach} />
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

/* ---------- Small Components ---------- */

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

function ReadOnlyField({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        disabled
        value={value.toFixed(2)}
        className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-slate-600"
      />
    </div>
  );
}
