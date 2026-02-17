import { solveForPower } from "@/lib/solver/solveForPower";
import { computeTotalPressure } from "@/lib/hydraulics/system";
import { computeEffectiveEfficiencies } from "@/lib/fan/efficiency";
import { solveForAirflowForPower } from "@/lib/solver/solveForPower";


export default function ResultsSection({ input }: Props) {
  let power = 0;
  let airflow = 0;
  let error: string | null = null;

  try {
    airflow = solveForAirflowForPower(input);


    const totalPressure = computeTotalPressure(airflow);

    const eff = computeEffectiveEfficiencies({
      totalFanEfficiency: input.fan.totalEfficiency,
      transmissionEfficiency: input.fan.transmissionEfficiency,
      tipClearance: input.fan.tipClearance,
      fanDiameter: input.geometry.fanDiameter,
    });

    power =
      (airflow * totalPressure) /
      (eff.effectiveFanEfficiency *
        eff.effectiveTransmissionEfficiency *
        1000);
  } catch (e: any) {
    error = e.message;
  }

  return (
    <div className="bg-blue-50 p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">
        Results
      </h2>

      {error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="space-y-2">
          <p>
            Airflow:{" "}
            <strong>{airflow.toFixed(0)}</strong>
          </p>
          <p>
            Power:{" "}
            <strong>{power.toFixed(2)} kW</strong>
          </p>
        </div>
      )}
    </div>
  );
}
