import React, { useState, useEffect } from "react";
import { WorkedExample } from "../types";
import { Calculator, RefreshCw, Sparkles, CheckCircle2 } from "lucide-react";

interface InteractiveCalculatorProps {
  workedExample: WorkedExample;
}

export const InteractiveCalculator: React.FC<InteractiveCalculatorProps> = ({ workedExample }) => {
  const inputVars = workedExample.inputVariables || [];
  
  // State for variables
  const [values, setValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    inputVars.forEach((v) => {
      initial[v.name] = v.defaultValue;
    });
    return initial;
  });

  // Re-sync when workedExample changes
  useEffect(() => {
    const initial: Record<string, number> = {};
    (workedExample.inputVariables || []).forEach((v) => {
      initial[v.name] = v.defaultValue;
    });
    setValues(initial);
  }, [workedExample]);

  if (inputVars.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-slate-400 text-xs text-center flex flex-col items-center justify-center min-h-[220px]">
        <Calculator className="w-8 h-8 text-slate-600 mb-2" />
        <p className="font-semibold text-slate-300">Deterministic Worked Example</p>
        <p className="text-[11px] text-slate-500 mt-1">
          This topic's example is fully evaluated above with step-by-step math.
        </p>
      </div>
    );
  }

  // Calculate dynamic result based on formula expression
  let calculatedResult: string | number = "—";
  try {
    if (workedExample.formulaExpression) {
      const given = values;
      // eslint-disable-next-line no-new-func
      const fn = new Function("given", "Math", `return (${workedExample.formulaExpression});`);
      const res = fn(given, Math);
      if (typeof res === "number" && !isNaN(res) && isFinite(res)) {
        calculatedResult = res < 0.01 && res > -0.01 ? res.toExponential(3) : parseFloat(res.toFixed(3));
      } else {
        calculatedResult = String(res);
      }
    }
  } catch (err) {
    console.warn("Calculation evaluation failed:", err);
  }

  const handleReset = () => {
    const initial: Record<string, number> = {};
    inputVars.forEach((v) => {
      initial[v.name] = v.defaultValue;
    });
    setValues(initial);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 sm:p-6 text-slate-200 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-cyan-200">
              Interactive Parameter Sandbox
            </h4>
            <p className="text-[11px] text-slate-400">
              Adjust variables to recalculate the circuit model in real-time
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 transition-colors px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer font-medium"
          title="Reset to default values"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-3 mb-4">
        {inputVars.map((v) => {
          const val = values[v.name] !== undefined ? values[v.name] : v.defaultValue;
          const min = v.min !== undefined ? v.min : 0;
          const max = v.max !== undefined ? v.max : val * 4 || 100;
          const step = v.step !== undefined ? v.step : (max - min) / 100 || 0.1;

          return (
            <div key={v.name} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-200">{v.label}</span>
                <span className="font-mono font-bold text-cyan-300">
                  {val} <span className="text-slate-400 font-normal">{v.unit}</span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={val}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [v.name]: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="number"
                  min={min}
                  max={max}
                  step={step}
                  value={val}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [v.name]: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-20 px-2 py-1 text-right font-mono text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          );
        })}
      </div>

      {workedExample.targetVariable && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-200 uppercase tracking-wider">
              Dynamic Solution ({workedExample.targetVariable}):
            </span>
          </div>
          <div className="text-sm font-mono font-black text-cyan-300 flex items-center gap-1.5">
            <span>{calculatedResult}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      )}
    </div>
  );
};
