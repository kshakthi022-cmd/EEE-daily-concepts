export interface FormulaVariable {
  symbol: string;
  description: string;
  unit: string;
  defaultValue?: number;
}

export interface InputVariableConfig {
  name: string;
  label: string;
  unit: string;
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface WorkedExample {
  scenario: string;
  given: string[];
  calculationSteps: string[];
  solution: string;
  targetVariable?: string;
  formulaExpression?: string;
  inputVariables?: InputVariableConfig[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LearningCard {
  id?: string;
  topicName: string;
  category: string;
  shortExplanation: string;
  primaryEquationLatex: string;
  variables: FormulaVariable[];
  workedExample: WorkedExample;
  formattedMarkdown: string;
  quiz?: QuizQuestion;
  relatedTopics?: string[];
  timestamp?: number;
  isBookmarked?: boolean;
  isMastered?: boolean;
}

export interface DailyStreak {
  currentStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  historyDates: string[]; // List of YYYY-MM-DD
  totalCardsLearned: number;
}
