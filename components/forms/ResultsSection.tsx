"use client";

import { TowerInputModel } from "@/lib/models/input";
import { solveForPower } from "@/lib/solver/solveForPower";

type Props = {
  input: TowerInputModel;
};

export default function ResultsSection({ input }: Props) {
  let result: ReturnType<typeof solveForPower> | null = null;
  let error: string | null = null;

  try {
    result = solveForPower(input);
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error";
  }

  return (
    <div className="bg-blue-50 p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Results</h2>

      {error ? (
        <div className="text-red-600">{error}</div>
      ) : result ? (
        <div className="space-y-2">
          <p>
            Airflow: <strong>{result.airflow_kgps.toFixed(2)} kg/s</strong>
          </p>
          <p>
            ΔP Total: <strong>{result.pressureDrop_Pa.toFixed(2)} Pa</strong>
          </p>
          <p>
            Power: <strong>{result.power_kW.toFixed(3)} kW</strong>
          </p>
          {result.warnings.length > 0 && (
            <div>
              <p className="font-medium text-amber-700">Warnings:</p>
              <ul className="list-disc pl-6 text-amber-700">
                {result.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
