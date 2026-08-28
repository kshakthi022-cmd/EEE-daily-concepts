import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI with User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const EEE_CATEGORIES = [
  "Circuit Theory",
  "Power Electronics",
  "Digital Systems",
  "Electromagnetics",
  "Electrical Machines & Power Systems",
  "Analog & Semiconductor Devices",
  "Signals & Systems / Control",
];

const DAILY_TOPIC_POOL = [
  "Ohm's Law & Power Dissipation",
  "Kirchhoff's Current Law (KCL)",
  "Kirchhoff's Voltage Law (KVL)",
  "Thevenin's Theorem",
  "Norton's Theorem",
  "RC Circuit Time Constant",
  "RLC Resonant Frequency & Q-Factor",
  "Buck Converter Voltage Conversion",
  "Boost Converter Output Voltage",
  "Operational Amplifier Inverting Gain",
  "Operational Amplifier Non-Inverting Gain",
  "Faraday's Law of Electromagnetic Induction",
  "Skin Effect & Skin Depth",
  "Transformer Turns Ratio & Efficiency",
  "3-Phase Real and Reactive Power",
  "Power Factor Correction Capacitor Sizing",
  "BJT Common-Emitter Voltage Gain",
  "MOSFET Conduction Loss ($R_{DS(on)}$)",
  "Nyquist Sampling Rate & Aliasing",
  "Bode Plot Cutoff Frequency for Low-Pass Filter",
  "Flip-Flop Setup and Hold Time",
  "ADC Quantization Error & Resolution (ENOB)",
  "Maximum Power Transfer Theorem",
  "Capacitive Reactance ($X_C$)",
  "Inductive Reactance ($X_L$)",
];

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/generate-topic", async (req: Request, res: Response): Promise<void> => {
  try {
    let { topic } = req.body;

    if (!topic || topic.trim() === "" || topic.toLowerCase().includes("generate daily topic")) {
      // Pick a daily topic based on the day of the year or random
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
      topic = DAILY_TOPIC_POOL[dayOfYear % DAILY_TOPIC_POOL.length];
    }

    const systemInstruction = `You are the content generator for a "Daily EEE (Electrical & Electronics Engineering) Learning App". Your job is to break down electrical concepts into micro-learning modules for students and beginners.

Whenever generating a topic, adhere strictly to this structured format:

---
### ⚡ Topic: [Concept Name]
*Category:* [e.g., Circuit Theory, Power Electronics, Digital Systems, Electromagnetics, Electrical Machines & Power Systems, Analog & Semiconductor Devices, Signals & Systems / Control]

#### 📖 1. Short Explanation
Provide 2-3 clear, jargon-free sentences explaining what the concept is and why it matters in real-world electrical systems.

#### 📐 2. Formula & Units
* Primary Equation: [LaTeX equation formatted cleanly with $...$, e.g., $V = I \\cdot R$]
* *Where:*
  * Variable 1 = Description (Unit)
  * Variable 2 = Description (Unit)
  * Variable 3 = Description (Unit)

#### 💡 3. Worked Example
* *Scenario:* A practical, real-world electrical problem.
* *Given:* State the input values clearly (with units).
* *Calculation:* Show the step-by-step math clearly with intermediate substitutions.
* *Solution:* Highlight the final calculated answer with clear units and 1-sentence engineering takeaway.
---

Also provide structured interactive metadata for parameter recalculation and a 1-question concept check quiz.`;

    const prompt = `Create a complete EEE micro-learning module for the topic: "${topic}".
Adhere to the exact required markdown format and also provide the JSON fields.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topicName: { type: Type.STRING, description: "The exact name of the concept" },
            category: { type: Type.STRING, description: "Category name e.g. Circuit Theory" },
            shortExplanation: { type: Type.STRING, description: "2-3 clear sentences explaining concept and real-world importance" },
            primaryEquationLatex: { type: Type.STRING, description: "LaTeX formula e.g. V = I \\cdot R" },
            variables: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  symbol: { type: Type.STRING, description: "Variable symbol e.g. V" },
                  description: { type: Type.STRING, description: "Description e.g. Voltage" },
                  unit: { type: Type.STRING, description: "Unit e.g. Volts (V)" },
                  defaultValue: { type: Type.NUMBER, description: "Default numeric value used in example" },
                },
                required: ["symbol", "description", "unit"],
              },
            },
            workedExample: {
              type: Type.OBJECT,
              properties: {
                scenario: { type: Type.STRING, description: "Realistic practical engineering scenario" },
                given: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of given parameters with units" },
                calculationSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Step-by-step mathematical steps" },
                solution: { type: Type.STRING, description: "Final answer with units and quick takeaway" },
                targetVariable: { type: Type.STRING, description: "Symbol of the variable being solved for e.g. V or I or R" },
                formulaExpression: { type: Type.STRING, description: "JavaScript math expression to recalculate result dynamically (e.g. '(given.I * given.R)' or '(given.V / given.R)')" },
                inputVariables: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: "Variable key e.g. V or I or R" },
                      label: { type: Type.STRING, description: "Label e.g. Current (I)" },
                      unit: { type: Type.STRING, description: "Unit e.g. A or mA" },
                      defaultValue: { type: Type.NUMBER },
                      min: { type: Type.NUMBER },
                      max: { type: Type.NUMBER },
                      step: { type: Type.NUMBER },
                    },
                    required: ["name", "label", "unit", "defaultValue"],
                  },
                },
              },
              required: ["scenario", "given", "calculationSteps", "solution"],
            },
            formattedMarkdown: {
              type: Type.STRING,
              description: "The EXACT markdown string following the required prompt template with headers, emojis, bullet points, and LaTeX equations.",
            },
            quiz: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
              required: ["question", "options", "correctIndex", "explanation"],
            },
            relatedTopics: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 to 4 related EEE topics to explore next",
            },
          },
          required: [
            "topicName",
            "category",
            "shortExplanation",
            "primaryEquationLatex",
            "variables",
            "workedExample",
            "formattedMarkdown",
            "quiz",
            "relatedTopics",
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from Gemini API");
    }

    const data = JSON.parse(text);
    res.json(data);
  } catch (error: any) {
    console.error("Error generating topic:", error);
    res.status(500).json({
      error: error.message || "Failed to generate learning card",
    });
  }
});

// Vite middleware in dev or static files in prod
async function setupApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`⚡ Daily EEE Learning Server running on http://0.0.0.0:${PORT}`);
  });
}

setupApp();
