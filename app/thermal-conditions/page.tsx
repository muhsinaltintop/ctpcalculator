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
import { UnitNumberField } from "@/components/UnitNumberField";

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

  const unitSystem = project.projectInformation.units;

  // 🔒 HER ZAMAN SI
  const [form, setForm] = useState<ThermalConditions>(
    project.thermalConditions ?? THERMAL_DEFAULTS,
  );

  function update<K extends keyof ThermalConditions>(
    key: K,
    value: number,
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  /* ---------- Derived (SI) ---------- */

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
      thermalConditions: form, // SI
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
          <UnitNumberField
            label="Cold Water Temperature"
            quantity="temperature"
            siValue={form.coldWater}
            unitSystem={unitSystem}
            onChangeSI={(v) => update("coldWater", v)}
          />

          <UnitNumberField
            label="Total Water Flow"
            quantity="waterFlow"
            siValue={form.totalFlow}
            unitSystem={unitSystem}
            onChangeSI={(v) => update("totalFlow", v)}
          />

          <UnitNumberField
            label="Wet Bulb Temperature"
            quantity="temperature"
            siValue={form.wetBulb}
            unitSystem={unitSystem}
            onChangeSI={(v) => update("wetBulb", v)}
          />

          {/* RH – unitless, klasik input */}
          <SimpleNumberField
            label="Relative Humidity (%)"
            value={form.relativeHumidity}
            onChange={(v) => update("relativeHumidity", v)}
          />

          <UnitNumberField
            label="Range"
            quantity="temperature"
            siValue={form.range}
            unitSystem={unitSystem}
            onChangeSI={(v) => update("range", v)}
          />

          <UnitNumberField
            label="Altitude"
            quantity="length"
            siValue={form.altitude}
            unitSystem={unitSystem}
            onChangeSI={(v) => update("altitude", v)}
          />
        </div>

        {/* Derived */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <ReadOnlyField
            label={`Hot Water Temperature (${
              unitSystem === "SI" ? "°C" : "°F"
            })`}
            value={hotWater}
            unitSystem={unitSystem}
            quantity="temperature"
          />
          <ReadOnlyField
            label={`Approach (${
              unitSystem === "SI" ? "°C" : "°F"
            })`}
            value={approach}
            unitSystem={unitSystem}
            quantity="temperature"
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

function ReadOnlyField({
  label,
  value,
  quantity,
  unitSystem,
}: {
  label: string;
  value: number;
  quantity: "temperature" | "length";
  unitSystem: "SI" | "IP";
}) {
  // reuse UnitNumberField logic without input
  const display =
    unitSystem === "SI"
      ? value
      : quantity === "temperature"
      ? value * 9 / 5 + 32
      : value * 3.28084;

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        disabled
        value={display.toFixed(2)}
        className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-slate-600"
      />
    </div>
  );
}
