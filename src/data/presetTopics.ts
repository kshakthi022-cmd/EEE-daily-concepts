import { LearningCard } from "../types";

export const PRESET_CARDS: LearningCard[] = [
  {
    id: "ohms-law",
    topicName: "Ohm's Law & Power Dissipation",
    category: "Circuit Theory",
    shortExplanation:
      "Ohm's Law defines the fundamental relationship between voltage, current, and resistance across an electrical conductor. It allows engineers to predict how much current will flow for a given potential difference and size current-limiting components. In real-world power systems and consumer electronics, it prevents thermal overload and component destruction.",
    primaryEquationLatex: "V = I \\cdot R \\quad \\text{and} \\quad P = I^2 \\cdot R = \\frac{V^2}{R}",
    variables: [
      { symbol: "V", description: "Electrical Potential Difference / Voltage", unit: "Volts (V)", defaultValue: 12 },
      { symbol: "I", description: "Electric Current", unit: "Amperes (A)", defaultValue: 2 },
      { symbol: "R", description: "Electrical Resistance", unit: "Ohms (\\Omega)", defaultValue: 6 },
      { symbol: "P", description: "Dissipated Power", unit: "Watts (W)", defaultValue: 24 },
    ],
    workedExample: {
      scenario: "An automotive LED headlamp module operates on a 12V DC vehicle rail and draws a steady 2.5A current. Determine the equivalent DC resistance of the module and the electrical power dissipated as heat and light.",
      given: [
        "Supply Voltage (V) = 12.0 V",
        "Operating Current (I) = 2.5 A",
      ],
      calculationSteps: [
        "Step 1: Apply Ohm's Law to calculate DC resistance: $R = \\frac{V}{I} = \\frac{12.0\\text{ V}}{2.5\\text{ A}} = 4.8\\;\\Omega$",
        "Step 2: Calculate electrical power: $P = V \\cdot I = 12.0\\text{ V} \\times 2.5\\text{ A} = 30.0\\text{ W}$",
        "Step 3: Verify power via $I^2 R$: $P = (2.5\\text{ A})^2 \\times 4.8\\;\\Omega = 6.25 \\times 4.8 = 30.0\\text{ W}$",
      ],
      solution: "The module has an equivalent resistance of 4.8 Ω and dissipates 30.0 W of total power.",
      targetVariable: "R & P",
      formulaExpression: "given.V / given.I",
      inputVariables: [
        { name: "V", label: "Voltage (V)", unit: "V", defaultValue: 12, min: 1, max: 240, step: 0.5 },
        { name: "I", label: "Current (I)", unit: "A", defaultValue: 2.5, min: 0.1, max: 50, step: 0.1 },
      ],
    },
    formattedMarkdown: `---
### ⚡ Topic: Ohm's Law & Power Dissipation
*Category:* Circuit Theory

#### 📖 1. Short Explanation
Ohm's Law defines the fundamental linear relationship between voltage, current, and resistance across an electrical conductor. It allows engineers to calculate current flow and size components accurately in power supplies, microcontrollers, and distribution grids. In real-world designs, calculating the associated power loss ($P = I^2 R$) is vital to prevent thermal runaway and circuit burnouts.

#### 📐 2. Formula & Units
* Primary Equation: $V = I \\cdot R \\quad \\text{and} \\quad P = V \\cdot I = I^2 \\cdot R$
* *Where:*
  * $V$ = Electric Potential / Voltage (Volts, $\\text{V}$)
  * $I$ = Electric Current (Amperes, $\\text{A}$)
  * $R$ = Electrical Resistance (Ohms, $\\Omega$)
  * $P$ = Electrical Power (Watts, $\\text{W}$)

#### 💡 3. Worked Example
* *Scenario:* An automotive LED headlight circuit connects directly to a 12.0 V automotive battery and draws 2.5 A of steady current.
* *Given:* Supply Voltage $V = 12.0\\text{ V}$, Current $I = 2.5\\text{ A}$.
* *Calculation:*
  1. Calculate resistance: $R = \\frac{V}{I} = \\frac{12.0\\text{ V}}{2.5\\text{ A}} = 4.8\\;\\Omega$
  2. Calculate power consumption: $P = V \\cdot I = 12.0\\text{ V} \\times 2.5\\text{ A} = 30.0\\text{ W}$
* *Solution:* Equivalent resistance is **4.8 Ω** with a continuous power draw of **30.0 W**.
---`,
    quiz: {
      question: "If the voltage across a fixed resistor is doubled, what happens to the power dissipated by the resistor?",
      options: ["Power stays the same", "Power doubles (2x)", "Power quadruples (4x)", "Power is halved (0.5x)"],
      correctIndex: 2,
      explanation: "Because P = V² / R, power is proportional to the square of voltage. Doubling V results in (2)² = 4 times the power.",
    },
    relatedTopics: ["Kirchhoff's Current Law (KCL)", "Thevenin's Theorem", "RC Circuit Time Constant", "Maximum Power Transfer"],
  },
  {
    id: "buck-converter",
    topicName: "Buck Converter (Step-Down DC-DC)",
    category: "Power Electronics",
    shortExplanation:
      "A Buck Converter is a high-efficiency switch-mode DC-DC converter that steps down an input voltage to a lower output voltage using an inductor, diode/synchronous MOSFET, capacitor, and PWM switching. Unlike linear regulators that burn excess voltage as heat, buck converters achieve 90-98% energy efficiency. They are ubiquitous in laptops, smartphones, and electric vehicles.",
    primaryEquationLatex: "V_{out} = D \\cdot V_{in} \\quad \\text{where} \\quad D = \\frac{T_{on}}{T_s} = \\frac{V_{out}}{V_{in}}",
    variables: [
      { symbol: "V_{out}", description: "Regulated Output DC Voltage", unit: "Volts (V)", defaultValue: 3.3 },
      { symbol: "V_{in}", description: "Input DC Supply Voltage", unit: "Volts (V)", defaultValue: 12 },
      { symbol: "D", description: "PWM Duty Cycle (fraction between 0 and 1)", unit: "Unitless / %", defaultValue: 0.275 },
      { symbol: "T_{on}", description: "Switch ON Time", unit: "Microseconds (\\mu s)", defaultValue: 2.75 },
      { symbol: "f_s", description: "Switching Frequency (1 / T_s)", unit: "Kilohertz (kHz)", defaultValue: 100 },
    ],
    workedExample: {
      scenario: "A smartphone motherboard power management IC (PMIC) steps down a 12V Li-ion battery charging rail to 3.3V to power an ARM microcontroller at a switching frequency of 250 kHz in continuous conduction mode (CCM).",
      given: [
        "Input Voltage (V_in) = 12.0 V",
        "Target Output Voltage (V_out) = 3.3 V",
        "Switching Frequency (f_s) = 250 kHz (Period T_s = 4.0 µs)",
      ],
      calculationSteps: [
        "Step 1: Calculate the ideal duty cycle: $D = \\frac{V_{out}}{V_{in}} = \\frac{3.3\\text{ V}}{12.0\\text{ V}} = 0.275\\; (27.5\\%)$",
        "Step 2: Calculate the total period: $T_s = \\frac{1}{f_s} = \\frac{1}{250\\text{ kHz}} = 4.0\\;\\mu\\text{s}$",
        "Step 3: Determine the high-side MOSFET ON-time: $T_{on} = D \\cdot T_s = 0.275 \\times 4.0\\;\\mu\\text{s} = 1.1\\;\\mu\\text{s}$",
      ],
      solution: "The required duty cycle is 27.5% with a switch conduction ON-time of 1.1 µs per 4.0 µs switching cycle.",
      targetVariable: "Duty Cycle (D)",
      formulaExpression: "(given.Vout / given.Vin) * 100",
      inputVariables: [
        { name: "Vin", label: "Input Voltage (Vin)", unit: "V", defaultValue: 12, min: 3.5, max: 60, step: 0.5 },
        { name: "Vout", label: "Output Voltage (Vout)", unit: "V", defaultValue: 3.3, min: 0.8, max: 24, step: 0.1 },
      ],
    },
    formattedMarkdown: `---
### ⚡ Topic: Buck Converter (Step-Down DC-DC)
*Category:* Power Electronics

#### 📖 1. Short Explanation
A Buck Converter is a switch-mode DC-to-DC converter that efficiently steps down a higher input voltage to a lower regulated output voltage. By rapidly chopping the DC input via a transistor switch and smoothing it through an LC filter, it achieves up to 95%+ efficiency without massive heat sinks. It powers modern microprocessors, battery-operated IoT gadgets, and EV motor controllers.

#### 📐 2. Formula & Units
* Primary Equation: $V_{out} = D \\cdot V_{in} = \\frac{T_{on}}{T_s} \\cdot V_{in}$
* *Where:*
  * $V_{out}$ = Output DC Voltage (Volts, $\\text{V}$)
  * $V_{in}$ = Input DC Voltage (Volts, $\\text{V}$)
  * $D$ = Duty Cycle (Unitless ratio $0 \\le D \\le 1$ or $\%$)
  * $T_{on}$ = High-side switch conduction duration (Seconds, $\\text{s}$)
  * $T_s$ = Switching period ($\\,T_s = 1/f_s\\,$) (Seconds, $\\text{s}$)

#### 💡 3. Worked Example
* *Scenario:* Designing a step-down converter stage to supply a $3.3\\text{ V}$ microcontroller rail from a $12.0\\text{ V}$ industrial bus operating at $250\\text{ kHz}$.
* *Given:* Input Voltage $V_{in} = 12.0\\text{ V}$, Output Voltage $V_{out} = 3.3\\text{ V}$, Frequency $f_s = 250\\text{ kHz}$.
* *Calculation:*
  1. Determine duty cycle: $D = \\frac{V_{out}}{V_{in}} = \\frac{3.3\\text{ V}}{12.0\\text{ V}} = 0.275\\; (27.5\\%)$
  2. Compute switching period: $T_s = \\frac{1}{250 \\times 10^3\\text{ Hz}} = 4.0\\;\\mu\\text{s}$
  3. Calculate MOSFET conduction ON-time: $T_{on} = D \\cdot T_s = 0.275 \\times 4.0\\;\\mu\\text{s} = 1.10\\;\\mu\\text{s}$
* *Solution:* The controller must pulse the gate with a **27.5% duty cycle** ($T_{on} = 1.10\\;\\mu\\text{s}$).
---`,
    quiz: {
      question: "In continuous conduction mode (CCM), what is the relationship between the duty cycle D and the output voltage of a Buck converter?",
      options: ["V_out = V_in / D", "V_out = D * V_in", "V_out = V_in / (1 - D)", "V_out = D * (1 - D) * V_in"],
      correctIndex: 1,
      explanation: "For an ideal buck converter in CCM, V_out is directly proportional to the duty cycle: V_out = D * V_in.",
    },
    relatedTopics: ["Boost Converter Output Voltage", "MOSFET Switching Losses", "Inductor Sizing & Ripple Current", "Synchronous Rectification"],
  },
  {
    id: "faradays-law",
    topicName: "Faraday's Law of Electromagnetic Induction",
    category: "Electromagnetics",
    shortExplanation:
      "Faraday's Law states that a changing magnetic flux through a closed conducting loop induces an electromotive force (EMF) or voltage proportional to the rate of change of the flux. Lenz's law (the negative sign) establishes that the induced current creates an opposing magnetic field. This principle is the operational cornerstone of electrical generators, transformers, inductors, and induction motors.",
    primaryEquationLatex: "\\mathcal{E} = -N \\frac{d\\Phi_B}{dt} \\quad \\text{where} \\quad \\Phi_B = B \\cdot A \\cdot \\cos(\\theta)",
    variables: [
      { symbol: "\\mathcal{E}", description: "Induced Electromotive Force / Voltage", unit: "Volts (V)", defaultValue: 24 },
      { symbol: "N", description: "Number of coil wire turns", unit: "Turns (dimensionless)", defaultValue: 200 },
      { symbol: "\\Phi_B", description: "Magnetic Flux", unit: "Webers (Wb = T·m²)", defaultValue: 0.05 },
      { symbol: "B", description: "Magnetic Flux Density", unit: "Tesla (T)", defaultValue: 1.2 },
      { symbol: "A", description: "Area of the coil loop", unit: "Square meters (m²)", defaultValue: 0.01 },
      { symbol: "dt", description: "Time interval of flux transition", unit: "Seconds (s)", defaultValue: 0.02 },
    ],
    workedExample: {
      scenario: "A 500-turn pickup coil in a turbine speed sensor has a cross-sectional area of 0.008 m². The magnetic flux through the coil changes uniformly from 0.04 Webers to 0.01 Webers in a time span of 15 milliseconds.",
      given: [
        "Coil turns (N) = 500 turns",
        "Initial Flux (Φ_1) = 0.04 Wb",
        "Final Flux (Φ_2) = 0.01 Wb",
        "Time duration (Δt) = 15 ms = 0.015 s",
      ],
      calculationSteps: [
        "Step 1: Calculate change in magnetic flux: $\\Delta \\Phi_B = \\Phi_2 - \\Phi_1 = 0.01\\text{ Wb} - 0.04\\text{ Wb} = -0.03\\text{ Wb}$",
        "Step 2: Compute rate of change of flux: $\\frac{\\Delta \\Phi_B}{\\Delta t} = \\frac{-0.03\\text{ Wb}}{0.015\\text{ s}} = -2.0\\text{ Wb/s}$",
        "Step 3: Calculate induced EMF using Faraday's Law: $\\mathcal{E} = -N \\frac{\\Delta \\Phi_B}{\\Delta t} = -(500) \\times (-2.0\\text{ V}) = +1000\\text{ V}$",
      ],
      solution: "An instantaneous electromotive force (EMF) of 1,000 V (1.0 kV) is induced across the coil terminals.",
      targetVariable: "Induced EMF (E)",
      formulaExpression: "given.N * (given.deltaPhi / (given.dt / 1000))",
      inputVariables: [
        { name: "N", label: "Coil Turns (N)", unit: "turns", defaultValue: 500, min: 10, max: 2000, step: 10 },
        { name: "deltaPhi", label: "Flux Change (ΔΦ)", unit: "Wb", defaultValue: 0.03, min: 0.001, max: 1, step: 0.005 },
        { name: "dt", label: "Time Interval (Δt)", unit: "ms", defaultValue: 15, min: 1, max: 200, step: 1 },
      ],
    },
    formattedMarkdown: `---
### ⚡ Topic: Faraday's Law of Electromagnetic Induction
*Category:* Electromagnetics

#### 📖 1. Short Explanation
Faraday's Law establishes that whenever the magnetic flux linking an electrical circuit changes over time, a proportional electromotive force (voltage) is induced across the conductors. The negative sign (Lenz's Law) dictates that the induced current creates an opposing magnetic field conserving energy. It powers the modern electrical grid by enabling power generation in turbines, step-up transformers, and wireless charging coils.

#### 📐 2. Formula & Units
* Primary Equation: $\\mathcal{E} = -N \\frac{d\\Phi_B}{dt} = -N \\frac{d(B \\cdot A \\cdot \\cos\\theta)}{dt}$
* *Where:*
  * $\\mathcal{E}$ = Induced Electromotive Force / EMF (Volts, $\\text{V}$)
  * $N$ = Number of tightly wound coil turns (Dimensionless integer)
  * $\\Phi_B$ = Magnetic flux through the loop (Webers, $\\text{Wb} = \\text{T}\\cdot\\text{m}^2$)
  * $B$ = Magnetic field flux density (Tesla, $\\text{T}$)
  * $t$ = Elapsed time (Seconds, $\\text{s}$)

#### 💡 3. Worked Example
* *Scenario:* A 500-turn sensor coil experiences a uniform magnetic flux collapse from $0.04\\text{ Wb}$ down to $0.01\\text{ Wb}$ in $15\\text{ ms}$ inside a high-voltage disconnect switch.
* *Given:* Coil turns $N = 500$, Initial Flux $\\Phi_1 = 0.04\\text{ Wb}$, Final Flux $\\Phi_2 = 0.01\\text{ Wb}$, Time $\\Delta t = 15\\text{ ms} = 0.015\\text{ s}$.
* *Calculation:*
  1. Change in flux: $\\Delta\\Phi_B = 0.01 - 0.04 = -0.03\\text{ Wb}$
  2. Rate of change: $\\frac{\\Delta\\Phi_B}{\\Delta t} = \\frac{-0.03\\text{ Wb}}{0.015\\text{ s}} = -2.0\\text{ Wb/s}$
  3. Induced EMF: $\\mathcal{E} = -(500) \\times (-2.0\\text{ V}) = +1000\\text{ V}$
* *Solution:* The induced terminal voltage across the coil is **1,000 V (1.0 kV)**.
---`,
    quiz: {
      question: "What physical principle accounts for the negative sign in Faraday's Law (E = -N dΦ/dt)?",
      options: ["Ohm's Law", "Lenz's Law (Conservation of Energy)", "Gauss's Law", "Coulomb's Law"],
      correctIndex: 1,
      explanation: "Lenz's Law explains the negative sign: the induced current produces a magnetic field that opposes the change in flux that created it.",
    },
    relatedTopics: ["Transformer Turns Ratio", "Inductance & Magnetic Energy", "Skin Effect & Skin Depth", "Maxwell's Equations"],
  },
  {
    id: "thevenin-theorem",
    topicName: "Thevenin's Theorem",
    category: "Circuit Theory",
    shortExplanation:
      "Thevenin's Theorem states that any linear electrical network containing voltage sources, current sources, and resistors can be replaced at its two output terminals by an equivalent single ideal voltage source (Vth) in series with a single resistance (Rth). This simplifies complex multisource circuits into an elementary one-loop circuit for rapid load analysis. Engineers rely on it for impedance matching and power distribution design.",
    primaryEquationLatex: "V_{L} = V_{th} \\cdot \\left(\\frac{R_L}{R_{th} + R_L}\\right) \\quad \\text{and} \\quad I_L = \\frac{V_{th}}{R_{th} + R_L}",
    variables: [
      { symbol: "V_{th}", description: "Thevenin Open-Circuit Voltage across terminals", unit: "Volts (V)", defaultValue: 10 },
      { symbol: "R_{th}", description: "Thevenin Equivalent Resistance looking into dead network", unit: "Ohms (\\Omega)", defaultValue: 50 },
      { symbol: "R_L", description: "Connected Load Resistance", unit: "Ohms (\\Omega)", defaultValue: 50 },
      { symbol: "V_L", description: "Voltage drop delivered across Load resistor", unit: "Volts (V)", defaultValue: 5 },
      { symbol: "I_L", description: "Current flowing through load resistor", unit: "Amperes (A)", defaultValue: 0.1 },
    ],
    workedExample: {
      scenario: "A sensor conditioning circuit has an open-circuit voltage Vth = 5.0 V and internal Thevenin impedance Rth = 100 Ω. Determine the voltage delivered and power dissipated when connected to an ADC input load of 400 Ω.",
      given: [
        "Thevenin Voltage (V_th) = 5.0 V",
        "Thevenin Resistance (R_th) = 100 Ω",
        "Load Resistance (R_L) = 400 Ω",
      ],
      calculationSteps: [
        "Step 1: Calculate load current: $I_L = \\frac{V_{th}}{R_{th} + R_L} = \\frac{5.0\\text{ V}}{100\\,\\Omega + 400\\,\\Omega} = \\frac{5.0\\text{ V}}{500\\,\\Omega} = 10.0\\text{ mA} = 0.010\\text{ A}$",
        "Step 2: Calculate load voltage via voltage divider: $V_L = V_{th} \\left(\\frac{R_L}{R_{th} + R_L}\\right) = 5.0\\text{ V} \\times \\frac{400}{500} = 4.0\\text{ V}$",
        "Step 3: Calculate power delivered to load: $P_L = I_L^2 \\cdot R_L = (0.010\\text{ A})^2 \\times 400\\,\\Omega = 0.040\\text{ W} = 40.0\\text{ mW}$",
      ],
      solution: "The ADC receives 4.0 V across its input terminals and dissipates 40.0 mW of signal power.",
      targetVariable: "Load Voltage (VL)",
      formulaExpression: "given.Vth * (given.RL / (given.Rth + given.RL))",
      inputVariables: [
        { name: "Vth", label: "Thevenin Voltage (Vth)", unit: "V", defaultValue: 5.0, min: 0.5, max: 48, step: 0.5 },
        { name: "Rth", label: "Thevenin Resistance (Rth)", unit: "Ω", defaultValue: 100, min: 1, max: 2000, step: 10 },
        { name: "RL", label: "Load Resistance (RL)", unit: "Ω", defaultValue: 400, min: 1, max: 5000, step: 25 },
      ],
    },
    formattedMarkdown: `---
### ⚡ Topic: Thevenin's Theorem
*Category:* Circuit Theory

#### 📖 1. Short Explanation
Thevenin's Theorem establishes that any complex linear network of resistors, independent sources, and dependent sources can be modeled at two terminals as a single voltage source ($V_{th}$) in series with an equivalent resistance ($R_{th}$). This drastically reduces the complexity of analyzing circuits under varying loads without re-solving the entire network. It is widely used in power distribution, analog signal conditioning, and maximum power transfer optimization.

#### 📐 2. Formula & Units
* Primary Equation: $V_{th} = V_{oc}, \\quad R_{th} = \\frac{V_{oc}}{I_{sc}}, \\quad V_L = V_{th} \\left(\\frac{R_L}{R_{th} + R_L}\\right)$
* *Where:*
  * $V_{th}$ = Open-circuit terminal voltage (Volts, $\\text{V}$)
  * $R_{th}$ = Equivalent internal resistance with independent sources zeroed (Ohms, $\\Omega$)
  * $R_L$ = Load resistor connected between terminals (Ohms, $\\Omega$)
  * $V_L$ = Terminal voltage under load (Volts, $\\text{V}$)
  * $I_L$ = Current supplied to load (Amperes, $\\text{A}$)

#### 💡 3. Worked Example
* *Scenario:* A telemetry sensor bridge output with Thevenin parameters $V_{th} = 5.0\\text{ V}$ and $R_{th} = 100\\;\\Omega$ is connected to an analog-to-digital converter load of $R_L = 400\\;\\Omega$.
* *Given:* $V_{th} = 5.0\\text{ V}$, $R_{th} = 100\\;\\Omega$, $R_L = 400\\;\\Omega$.
* *Calculation:*
  1. Determine load current: $I_L = \\frac{5.0\\text{ V}}{100\\;\\Omega + 400\\;\\Omega} = \\frac{5.0\\text{ V}}{500\\;\\Omega} = 10.0\\text{ mA}$
  2. Compute voltage drop across load: $V_L = 5.0\\text{ V} \\times \\left(\\frac{400}{500}\\right) = 4.0\\text{ V}$
  3. Determine load power: $P_L = (10\\times 10^{-3}\\text{ A})^2 \\times 400\\;\\Omega = 40.0\\text{ mW}$
* *Solution:* Output voltage is **4.0 V** with **40.0 mW** dissipated across the load.
---`,
    quiz: {
      question: "According to the Maximum Power Transfer Theorem, maximum power is delivered to RL when:",
      options: ["RL = 0 (short circuit)", "RL = infinity (open circuit)", "RL = Rth", "RL = 2 * Rth"],
      correctIndex: 2,
      explanation: "Maximum power is transferred from source to load when the load resistance equals the Thevenin equivalent resistance (RL = Rth).",
    },
    relatedTopics: ["Norton's Theorem", "Maximum Power Transfer Theorem", "Superposition Theorem", "Nodal & Mesh Analysis"],
  },
  {
    id: "rc-time-constant",
    topicName: "RC Circuit Time Constant (Tau)",
    category: "Circuit Theory",
    shortExplanation:
      "The RC time constant (τ = R·C) represents the time required for a capacitor to charge to approximately 63.2% of its maximum applied voltage or discharge down to 36.8% of its initial value. It characterizes transient behavior in analog filters, debounce circuits, oscillators, and timing delay networks. Understanding τ ensures microcontrollers properly filter signal noise without introducing excessive delay.",
    primaryEquationLatex: "\\tau = R \\cdot C \\quad \\text{and} \\quad v_C(t) = V_{in} \\left(1 - e^{-t / \\tau}\\right)",
    variables: [
      { symbol: "\\tau", description: "Time Constant", unit: "Seconds (s)", defaultValue: 0.01 },
      { symbol: "R", description: "Series Resistance", unit: "Ohms (\\Omega)", defaultValue: 10000 },
      { symbol: "C", description: "Capacitance", unit: "Farads (F)", defaultValue: 0.000001 },
      { symbol: "v_C(t)", description: "Instantaneous Capacitor Voltage at time t", unit: "Volts (V)", defaultValue: 3.16 },
      { symbol: "V_{in}", description: "Step Input Voltage", unit: "Volts (V)", defaultValue: 5 },
    ],
    workedExample: {
      scenario: "A tactile push-button switch input to an ESP32 microcontroller uses a hardware RC low-pass filter with a 10 kΩ pull-up resistor and a 1.0 µF ceramic capacitor to eliminate mechanical contact chatter. Calculate the time constant τ and the capacitor voltage after 15 ms from a 3.3V step input.",
      given: [
        "Resistance (R) = 10 kΩ = 10,000 Ω",
        "Capacitance (C) = 1.0 µF = 1.0 × 10⁻⁶ F",
        "Supply Voltage (V_in) = 3.3 V",
        "Time elapsed (t) = 15 ms = 0.015 s",
      ],
      calculationSteps: [
        "Step 1: Calculate the time constant: $\\tau = R \\times C = 10\\,000\\,\\Omega \\times 1.0 \\times 10^{-6}\\text{ F} = 0.010\\text{ s} = 10.0\\text{ ms}$",
        "Step 2: Calculate ratio $t / \\tau$: $\\frac{t}{\\tau} = \\frac{15.0\\text{ ms}}{10.0\\text{ ms}} = 1.5$",
        "Step 3: Calculate exponential term: $e^{-1.5} \\approx 0.2231$",
        "Step 4: Compute capacitor voltage: $v_C(15\\text{ ms}) = 3.3\\text{ V} \\times (1 - 0.2231) = 3.3\\text{ V} \\times 0.7769 = 2.56\\text{ V}$",
      ],
      solution: "The circuit time constant is 10.0 ms, and the capacitor charges to 2.56 V (77.7% of 3.3V) after 15 ms.",
      targetVariable: "Time Constant (tau) & vC(t)",
      formulaExpression: "given.R * (given.C / 1000000)",
      inputVariables: [
        { name: "R", label: "Resistance (R)", unit: "kΩ", defaultValue: 10, min: 0.1, max: 1000, step: 1 },
        { name: "C", label: "Capacitance (C)", unit: "µF", defaultValue: 1.0, min: 0.01, max: 470, step: 0.1 },
        { name: "Vin", label: "Step Voltage (Vin)", unit: "V", defaultValue: 3.3, min: 1, max: 24, step: 0.1 },
      ],
    },
    formattedMarkdown: `---
### ⚡ Topic: RC Circuit Time Constant (Tau)
*Category:* Circuit Theory

#### 📖 1. Short Explanation
The RC time constant ($\\tau = R \\cdot C$) defines the temporal charging and discharging rate of a capacitor through a resistor. Within one time constant ($1\\tau$), a charging capacitor reaches $63.2\\%$ of its final voltage, and is considered fully steady-state after approximately $5\\tau$ ($99.3\\%$). It governs filter response times, analog hardware switch debouncing, and timing pulse generation across all electronic systems.

#### 📐 2. Formula & Units
* Primary Equation: $\\tau = R \\cdot C \\quad \\text{and} \\quad v_C(t) = V_0 \\left(1 - e^{-t/\\tau}\\right)$
* *Where:*
  * $\\tau$ = Time constant (Seconds, $\\text{s}$)
  * $R$ = Resistance in path (Ohms, $\\Omega$)
  * $C$ = Capacitance (Farads, $\\text{F}$)
  * $v_C(t)$ = Capacitor voltage at time $t$ (Volts, $\\text{V}$)
  * $V_0$ = Step source voltage (Volts, $\\text{V}$)

#### 💡 3. Worked Example
* *Scenario:* Designing a button debouncing filter for an embedded microcontroller utilizing a $10\\text{ k}\\Omega$ resistor and a $1.0\\;\\mu\\text{F}$ capacitor powered by a $3.3\\text{ V}$ logic supply.
* *Given:* $R = 10\\text{ k}\\Omega = 10^4\\;\\Omega$, $C = 1.0\\;\\mu\\text{F} = 10^{-6}\\text{ F}$, $V_0 = 3.3\\text{ V}$, elapsed time $t = 15\\text{ ms}$.
* *Calculation:*
  1. Calculate time constant: $\\tau = 10^4\\;\\Omega \\times 10^{-6}\\text{ F} = 0.010\\text{ s} = 10.0\\text{ ms}$
  2. Compute exponent: $\\frac{t}{\\tau} = \\frac{15\\text{ ms}}{10\\text{ ms}} = 1.5 \\implies e^{-1.5} \\approx 0.2231$
  3. Compute instantaneous voltage: $v_C(15\\text{ ms}) = 3.3\\text{ V} \\times (1 - 0.2231) = 3.3 \\times 0.7769 = 2.56\\text{ V}$
* *Solution:* Time constant is **10.0 ms**, reaching **2.56 V** after 15 ms.
---`,
    quiz: {
      question: "Approximately what percentage of the total supply voltage does a capacitor reach after 5 time constants (5τ)?",
      options: ["63.2%", "86.5%", "95.0%", "99.3%"],
      correctIndex: 3,
      explanation: "After 5τ, the capacitor reaches (1 - e^-5) ≈ 99.3%, which is considered fully charged in engineering practice.",
    },
    relatedTopics: ["RL Circuit Time Constant (L/R)", "RLC Second-Order Transient Response", "Passive Low-Pass Filters", "Capacitive Reactance"],
  },
  {
    id: "opamp-inverting",
    topicName: "Operational Amplifier (Inverting Configuration)",
    category: "Analog & Semiconductor Devices",
    shortExplanation:
      "An inverting operational amplifier circuit amplifies an input voltage while flipping its polarity by 180 degrees using negative feedback. The closed-loop gain is set purely by the ratio of the feedback resistor (Rf) to the input resistor (Rin). Because of the virtual ground concept at the inverting terminal, it provides predictable, stable gain that is immune to component aging and temperature drift.",
    primaryEquationLatex: "V_{out} = -\\left(\\frac{R_f}{R_{in}}\\right) V_{in} \\quad \\text{and} \\quad A_v = -\\frac{R_f}{R_{in}}",
    variables: [
      { symbol: "V_{out}", description: "Amplified Output Voltage", unit: "Volts (V)", defaultValue: -5 },
      { symbol: "V_{in}", description: "Input Analog Signal Voltage", unit: "Volts (V)", defaultValue: 0.5 },
      { symbol: "R_f", description: "Feedback Resistor", unit: "Ohms (\\Omega)", defaultValue: 100000 },
      { symbol: "R_{in}", description: "Input Resistor", unit: "Ohms (\\Omega)", defaultValue: 10000 },
      { symbol: "A_v", description: "Closed-Loop Voltage Gain", unit: "Dimensionless (V/V)", defaultValue: -10 },
    ],
    workedExample: {
      scenario: "A thermocouple temperature sensor outputs a small DC signal of 50 mV (0.050 V). You need to amplify it to -1.0 V to feed an ADC using an inverting op-amp stage with an input resistor Rin = 4.7 kΩ. Determine the required feedback resistor Rf.",
      given: [
        "Input Signal (V_in) = 50 mV = 0.050 V",
        "Target Output (V_out) = -1.00 V",
        "Input Resistor (R_in) = 4.7 kΩ = 4,700 Ω",
      ],
      calculationSteps: [
        "Step 1: Calculate required voltage gain: $A_v = \\frac{V_{out}}{V_{in}} = \\frac{-1.00\\text{ V}}{0.050\\text{ V}} = -20.0\\text{ V/V}$",
        "Step 2: Relate gain to resistors: $A_v = -\\frac{R_f}{R_{in}} \\implies -20.0 = -\\frac{R_f}{4,700\\,\\Omega}$",
        "Step 3: Solve for feedback resistor Rf: $R_f = 20.0 \\times 4,700\\,\\Omega = 94,000\\,\\Omega = 94.0\\text{ k}\\Omega$",
      ],
      solution: "A feedback resistor of 94.0 kΩ (or closest standard value 93.1 kΩ / 95.3 kΩ 1% metal film) provides the desired -20x inverting gain.",
      targetVariable: "Feedback Resistor (Rf)",
      formulaExpression: "Math.abs(given.Vout / given.Vin) * given.Rin",
      inputVariables: [
        { name: "Vin", label: "Input Signal (Vin)", unit: "mV", defaultValue: 50, min: 1, max: 1000, step: 5 },
        { name: "Vout", label: "Target Output (Vout)", unit: "V", defaultValue: 1.0, min: 0.1, max: 15, step: 0.1 },
        { name: "Rin", label: "Input Resistor (Rin)", unit: "kΩ", defaultValue: 4.7, min: 0.5, max: 100, step: 0.1 },
      ],
    },
    formattedMarkdown: `---
### ⚡ Topic: Operational Amplifier (Inverting Configuration)
*Category:* Analog & Semiconductor Devices

#### 📖 1. Short Explanation
The inverting operational amplifier amplifier uses negative feedback to provide highly precise, linear signal amplification with an inverted ($180^\\circ$ phase shift) output. Because the non-inverting pin is grounded, the inverting pin is held at a "virtual ground" ($0\\text{ V}$), making the gain determined exclusively by two external passive resistors. It is foundational in analog instrumentation, audio preamplifiers, and active audio filters.

#### 📐 2. Formula & Units
* Primary Equation: $V_{out} = -\\left(\\frac{R_f}{R_{in}}\\right) V_{in} \\quad \\implies \\quad A_v = -\\frac{R_f}{R_{in}}$
* *Where:*
  * $V_{out}$ = Output signal voltage (Volts, $\\text{V}$)
  * $V_{in}$ = Input signal voltage (Volts, $\\text{V}$)
  * $R_f$ = Feedback resistance (Ohms, $\\Omega$)
  * $R_{in}$ = Input resistance connected to inverting terminal (Ohms, $\\Omega$)
  * $A_v$ = Closed-loop voltage amplification factor (Dimensionless)

#### 💡 3. Worked Example
* *Scenario:* Amplifying a $50\\text{ mV}$ sensor voltage up to $-1.00\\text{ V}$ for an analog data acquisition channel using an inverting op-amp with $R_{in} = 4.7\\text{ k}\\Omega$.
* *Given:* $V_{in} = 50\\text{ mV} = 0.050\\text{ V}$, $V_{out} = -1.00\\text{ V}$, $R_{in} = 4.7\\text{ k}\\Omega = 4,700\\;\\Omega$.
* *Calculation:*
  1. Determine required gain magnitude: $|A_v| = \\frac{1.00\\text{ V}}{0.050\\text{ V}} = 20.0$
  2. Apply formula: $20.0 = \\frac{R_f}{4,700\\;\\Omega}$
  3. Solve for $R_f$: $R_f = 20.0 \\times 4,700\\;\\Omega = 94,000\\;\\Omega = 94.0\\text{ k}\\Omega$
* *Solution:* The required feedback resistor is **94.0 kΩ** to produce the $-20\\times$ voltage gain.
---`,
    quiz: {
      question: "Why is the inverting terminal called a 'virtual ground' in an ideal op-amp circuit with the non-inverting pin grounded?",
      options: [
        "Because it is directly wired to Earth ground",
        "Because open-loop gain is infinite, forcing the differential input voltage (V+ - V-) to 0V",
        "Because the op-amp has zero input impedance",
        "Because current flows into the op-amp input pins to ground them",
      ],
      correctIndex: 1,
      explanation: "With enormous open-loop gain and negative feedback, the op-amp maintains V- = V+ = 0V, acting like a ground potential without sinking current directly into ground.",
    },
    relatedTopics: ["Op-Amp Non-Inverting Configuration", "Op-Amp Slew Rate & Bandwidth (GBW)", "Summing Amplifier", "Active Low-Pass Sallen-Key Filter"],
  },
];

export const CATEGORIES = [
  "All Topics",
  "Circuit Theory",
  "Power Electronics",
  "Digital Systems",
  "Electromagnetics",
  "Analog & Semiconductor Devices",
  "Electrical Machines & Power Systems",
  "Signals & Systems / Control",
];

export const POPULAR_PROMPTS = [
  "Generate Daily Topic",
  "Ohm's Law & Power Dissipation",
  "Buck Converter",
  "Faraday's Law",
  "Thevenin's Theorem",
  "RC Circuit Time Constant",
  "Op-Amp Inverting Configuration",
  "RLC Resonant Frequency",
  "3-Phase Power Triangle",
  "Transformer Turns Ratio",
  "Skin Effect in AC Conductors",
  "Nyquist Sampling Theorem",
  "MOSFET Rds(on) Conduction Loss",
  "Flip-Flop Setup and Hold Time",
];
