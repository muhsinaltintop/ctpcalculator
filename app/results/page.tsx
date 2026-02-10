"use client";

import { loadProject, resetProject } from "@/lib/projectStorage";
import { useMemo } from "react";
import {
  C_to_F,
  m3s_to_cfm,
  Pa_to_inH2O,
  m_to_ft,
} from "@/lib/units";

export default function ResultsPage() {
  const project = loadProject();

  if (
    !project.projectInformation ||
    !project.thermalConditions ||
    !project.towerGeometry ||
    !project.fillSection ||
    !project.fanPlenum
  ) {
    return (
      <main className="p-6">
        <p className="text-red-600">
          Proje eksik. Lütfen tüm adımları tamamlayın.
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

  const {
    thermalConditions,
    fanPlenum,
    projectInformation,
  } = project;

  const unitSystem = projectInformation.units;

  /* ---------- Calculations (SI) ---------- */

  const approachSI =
    thermalConditions.coldWater - thermalConditions.wetBulb;

  const fanPowerKW = useMemo(() => {
    const eff = fanPlenum.fanEfficiency / 100;
    if (eff <= 0) return 0;
    return (
      (fanPlenum.airFlowRate * fanPlenum.staticPressure) /
      (eff * 1000)
    );
  }, [fanPlenum]);

  /* ---------- Unit-aware display values ---------- */

  const displayTemp = (v: number) =>
    unitSystem === "SI" ? v : C_to_F(v);

  const displayApproach = (v: number) =>
    unitSystem === "SI" ? v : C_to_F(v);

  const displayAirFlow = (v: number) =>
    unitSystem === "SI" ? v : m3s_to_cfm(v);

  const displayPressure = (v: number) =>
    unitSystem === "SI" ? v : Pa_to_inH2O(v);

  const tempUnit = unitSystem === "SI" ? "°C" : "°F";
  const airUnit = unitSystem === "SI" ? "m³/s" : "cfm";
  const pressureUnit = unitSystem === "SI" ? "Pa" : "inH₂O";

  /* ---------- Flags (SI logic) ---------- */

  const approachStatus =
    approachSI < 3
      ? "critical"
      : approachSI < 5
      ? "warning"
      : "ok";

  const flags: string[] = [];

  if (thermalConditions.relativeHumidity > 70) {
    flags.push("High relative humidity may reduce cooling efficiency.");
  }

  if (thermalConditions.altitude > 1000) {
    flags.push("High altitude reduces air density and fan performance.");
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Results</h1>
          <p className="text-sm text-slate-600">
            Project: {projectInformation.projectName}
          </p>
          <p className="text-xs text-slate-500">
            Display units: {unitSystem}
          </p>
        </div>

        <button
          onClick={() => {
            resetProject();
            window.location.href = "/";
          }}
          className="rounded-xl border border-red-300 px-3 py-2 text-sm text-red-600"
        >
          Reset Project
        </button>
      </header>

      {/* Summary */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* Thermal */}
        <Card title="Thermal Performance">
          <Row
            label={`Cold Water (${tempUnit})`}
            value={displayTemp(thermalConditions.coldWater).toFixed(2)}
          />
          <Row
            label={`Wet Bulb (${tempUnit})`}
            value={displayTemp(thermalConditions.wetBulb).toFixed(2)}
          />
          <Row
            label={`Approach (${tempUnit})`}
            value={displayApproach(approachSI).toFixed(2)}
          />

          <StatusBadge status={approachStatus}>
            {approachStatus === "ok"
              ? "Approach acceptable"
              : approachStatus === "warning"
              ? "Low approach – careful design"
              : "Very low approach – high risk"}
          </StatusBadge>
        </Card>

        {/* Fan */}
        <Card title="Fan Performance">
          <Row
            label={`Air Flow Rate (${airUnit})`}
            value={displayAirFlow(fanPlenum.airFlowRate).toFixed(2)}
          />
          <Row
            label={`Static Pressure (${pressureUnit})`}
            value={displayPressure(fanPlenum.staticPressure).toFixed(2)}
          />
          <Row
            label="Fan Efficiency (%)"
            value={fanPlenum.fanEfficiency.toFixed(1)}
          />
          <Row
            label="Estimated Fan Power (kW)"
            value={fanPowerKW.toFixed(2)}
          />
        </Card>
      </section>

      {/* Flags */}
      <section className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-medium">Design Notes</h2>

        {flags.length === 0 ? (
          <p className="text-green-600">
            No critical issues detected in initial checks.
          </p>
        ) : (
          <ul className="list-disc space-y-1 pl-5 text-amber-700">
            {flags.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

/* ---------- Small components ---------- */

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-medium">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function StatusBadge({
  status,
  children,
}: {
  status: "ok" | "warning" | "critical";
  children: React.ReactNode;
}) {
  const color =
    status === "ok"
      ? "bg-green-100 text-green-700"
      : status === "warning"
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";

  return (
    <div
      className={`mt-3 inline-block rounded-xl px-3 py-1 text-sm ${color}`}
    >
      {children}
    </div>
  );
}
