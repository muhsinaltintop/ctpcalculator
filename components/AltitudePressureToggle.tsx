
import { UnitNumberField } from "./UnitNumberField";

export function AltitudePressureToggle({
  form,
  update,
  unitSystem,
  errors,
}: {
  form: ThermalConditions;
  update: <K extends keyof ThermalConditions>(
    key: K,
    value: ThermalConditions[K]
  ) => void;
  unitSystem: "SI" | "IP";
  errors: Record<string, string>;
}) {
  const usingAltitude = form.altitude !== undefined;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">
        Select one:
      </label>

      <div className="flex gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={usingAltitude}
            onChange={() => {
              update("barometricPressure", undefined);
              update("altitude", 0);
            }}
          />
          Altitude
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={!usingAltitude}
            onChange={() => {
              update("altitude", undefined);
              update("barometricPressure", 101.325);
            }}
          />
          Barometric Pressure
        </label>
      </div>

      {usingAltitude ? (
        <UnitNumberField
          label="Altitude"
          quantity="length"
          siValue={form.altitude ?? 0}
          unitSystem={unitSystem}
          onChangeSI={(v) => update("altitude", v)}
          error={errors.altitude}
        />
      ) : (
        <UnitNumberField
          label="Barometric Pressure"
          quantity="pressure"
          siValue={form.barometricPressure ?? 101.325}
          unitSystem={unitSystem}
          onChangeSI={(v) => update("barometricPressure", v)}
          error={errors.barometricPressure}
        />
      )}

      {errors.pressure && (
        <p className="text-xs text-red-600">{errors.pressure}</p>
      )}
    </div>
  );
}
