"use client";
import {
  loadProject,
  saveProject,
  resetProject,
  resetProjectInformation,
} from "@/lib/projectStorage";

import { useMemo, useState } from "react";

type Units = "SI" | "IP";
type TowerType = "Counterflow";

type ProjectInformation = {
  projectName: string;
  units: Units;
  towerType: TowerType;
  country: string;
  city: string;
};

const DEFAULTS: ProjectInformation = {
  projectName: "ctp Calculator Project",
  units: "SI",
  towerType: "Counterflow",
  country: "Turkey",
  city: "Istanbul",
};

function clampText(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

export default function ProjectInformationPage() {
  const [form, setForm] = useState<ProjectInformation>(() => {
    const project = loadProject();
    return project.projectInformation ?? DEFAULTS;
  });

  const [touched, setTouched] = useState(false);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!clampText(form.projectName)) e.projectName = "Project name gerekli.";
    return e;
  }, [form]);

  const canContinue = Object.keys(errors).length === 0;

  function update<K extends keyof ProjectInformation>(
    key: K,
    value: ProjectInformation[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onContinue() {
    setTouched(true);
    if (!canContinue) return;

    const project = loadProject();

    saveProject({
      ...project,
      projectInformation: form,
    });

    window.location.href = "/thermal-conditions";
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="mb-6 flex items-center justify-between">
  <div>
    <h1 className="text-2xl font-semibold">ctp Calculator</h1>
    <p className="mt-1 text-sm text-slate-600">
      Step 0 / 5 — Project Information
    </p>
  </div>

  <div className="flex gap-2">
    <button
      type="button"
      onClick={() => {
        resetProjectInformation();
        setForm(DEFAULTS);
        setTouched(false);
      }}
      className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
    >
      Reset This Page
    </button>

    <button
      type="button"
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


      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5">
          {/* Project Name */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Project Name
            </label>
            <input
              value={form.projectName}
              onChange={(e) => update("projectName", e.target.value)}
              onBlur={() => setTouched(true)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="e.g. istanbul kule"
            />
            {touched && errors.projectName ? (
              <p className="mt-1 text-sm text-red-600">{errors.projectName}</p>
            ) : null}
          </div>

          {/* Units + Tower Type */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Selected Unit
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => update("units", "SI")}
                  className={`flex-1 rounded-xl border px-3 py-2 text-sm ${
                    form.units === "SI"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  SI
                </button>
                <button
                  type="button"
                  onClick={() => update("units", "IP")}
                  className={`flex-1 rounded-xl border px-3 py-2 text-sm ${
                    form.units === "IP"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  IP
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                SI = metric, IP = imperial.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Tower Type
              </label>
              <input
                value={form.towerType}
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-600"
              />
              <p className="mt-1 text-xs text-slate-500">
                Şimdilik Counterflow sabit.
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Country</label>
              <input
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">City</label>
              <input
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-2">


            <button
              type="button"
              onClick={onContinue}
              className={`rounded-xl px-5 py-2 text-sm font-medium ${
                canContinue
                  ? "bg-slate-900 text-white"
                  : "cursor-not-allowed bg-slate-200 text-slate-500"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </section>

      <footer className="mt-6 text-xs text-slate-500">
        Bu adım proje boyunca sabit kalacak temel bilgileri toplar.
      </footer>
    </main>
  );
}
