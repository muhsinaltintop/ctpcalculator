"use client";

import { useState } from "react";
import {
  loadProject,
  saveProject,
  resetProject,
  resetThermalConditions,
  THERMAL_DEFAULTS,
  ThermalConditions,
  SolveFor,
} from "@/lib/projectStorage";
import { UnitNumberField } from "@/components/UnitNumberField";
import Link from "next/link";
import { AltitudePressureToggle } from "@/components/AltitudePressureToggle";
import { SolveForSelector } from "@/components/SolveForSelector";
import { SimpleNumberField } from "@/components/SimpleNumberField";
import { ReadOnlyField } from "@/components/ReadOnlyField";

/* ===================================================== */

export default function ThermalConditionsPage() {
  const project = loadProject();

  if (!project.projectInformation) {
    return (
      <main className="p-6">
        <p className="text-red-600">Project Information bulunamadı.</p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-xl bg-slate-900 px-4 py-2 text-white"
        >
          Go to Project Information
        </Link>
      </main>
    );
  }

  const unitSystem = project.projectInformation.units;

  const [form, setForm] = useState<ThermalConditions>(
    project.thermalConditions ?? THERMAL_DEFAULTS,
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  function update<K extends keyof ThermalConditions>(
    key: K,
    value: ThermalConditions[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  /* ================= REQUIRED MATRIX ================= */

  const needPower = form.solveFor !== "power";

  const needColdWater = form.solveFor !== "coldWater";

  const needFlow = form.solveFor !== "waterFlow";

  /* ================= VALIDATION ================= */

  function validate() {
    const e: Record<string, string> = {};

    if (needPower && (!form.power || form.power <= 0))
      e.power = "Power required";

    if (needColdWater && (!form.coldWater || form.coldWater <= 0))
      e.coldWater = "Cold Water required";

    if (needFlow && (!form.totalFlow || form.totalFlow <= 0))
      e.totalFlow = "Water Flow required";

    if (form.wetBulb < -40 || form.wetBulb > 93.33)
      e.wetBulb = "Wet Bulb out of range";

    if (!form.range || form.range < 0.56 || form.range > 55.56)
      e.range = "Range must be 0.56–55.56 °C";

    if (form.relativeHumidity < 0 || form.relativeHumidity > 100)
      e.relativeHumidity = "RH must be 0–100%";

    if (form.altitude === undefined && form.barometricPressure === undefined)
      e.pressure = "Select Altitude or Pressure";

    if (
      form.altitude !== undefined &&
      (form.altitude < -305 || form.altitude > 7620)
    )
      e.altitude = "Altitude out of range";

    if (
      form.barometricPressure !== undefined &&
      (form.barometricPressure < 37.6 || form.barometricPressure > 105)
    )
      e.barometricPressure = "Pressure out of range";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onContinue() {
    if (!validate()) return;

    saveProject({
      ...project,
      thermalConditions: form,
    });

    window.location.href = "/tower-geometry";
  }

  /* ================= CALCULATED ================= */

  const hotWater =
    form.coldWater && form.range ? form.coldWater + form.range : undefined;

  const approach =
    form.coldWater && form.wetBulb ? form.coldWater - form.wetBulb : undefined;

  /* ================= UI ================= */

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Step 1: Thermal Conditions</h1>
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
            className="rounded-xl border px-3 py-2 text-sm"
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
      </div>

      <section className="rounded-2xl border bg-white p-6 shadow-sm space-y-6">
        <SolveForSelector
          value={form.solveFor}
          onChange={(v) => update("solveFor", v)}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {needPower && (
            <UnitNumberField
              label="Power"
              quantity="power"
              siValue={form.power ?? 0}
              unitSystem={unitSystem}
              onChangeSI={(v) => update("power", v)}
              error={errors.power}
            />
          )}

          {needColdWater && (
            <UnitNumberField
              label="Cold Water"
              quantity="temperature"
              siValue={form.coldWater ?? 0}
              unitSystem={unitSystem}
              onChangeSI={(v) => update("coldWater", v)}
              error={errors.coldWater}
            />
          )}

          {needFlow && (
            <UnitNumberField
              label="Total Water Flow"
              quantity="waterFlow"
              siValue={form.totalFlow ?? 0}
              unitSystem={unitSystem}
              onChangeSI={(v) => update("totalFlow", v)}
              error={errors.totalFlow}
            />
          )}

          <UnitNumberField
            label="Wet Bulb"
            quantity="temperature"
            siValue={form.wetBulb}
            unitSystem={unitSystem}
            onChangeSI={(v) => update("wetBulb", v)}
            error={errors.wetBulb}
          />

          <SimpleNumberField
            label="Relative Humidity (%)"
            value={form.relativeHumidity}
            onChange={(v) => update("relativeHumidity", v)}
            error={errors.relativeHumidity}
          />

          <UnitNumberField
            label="Range"
            quantity="temperature"
            siValue={form.range ?? 0}
            unitSystem={unitSystem}
            onChangeSI={(v) => update("range", v)}
            error={errors.range}
          />
        </div>

        <AltitudePressureToggle
          form={form}
          update={update}
          unitSystem={unitSystem}
          errors={errors}
        />

        {form.solveFor !== "coldWater" && hotWater !== undefined && (
          <div className="grid gap-4 sm:grid-cols-2">
            <ReadOnlyField
              label="Hot Water"
              value={hotWater}
              unitSystem={unitSystem}
            />
            <ReadOnlyField
              label="Approach"
              value={approach}
              unitSystem={unitSystem}
            />
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onContinue}
            className="rounded-xl bg-slate-900 px-6 py-2 text-sm font-medium text-white"
          >
            Continue
          </button>
        </div>
      </section>
    </div>
  );
}
