export interface EnglishTeacherInput {
  nivel: string;
  tema: string;
  tipoEjercicio: string;
  dificultad: string;
  descripcion?: string;
}

export interface EnglishTeacherOutput {
  explicacion: string;
  ejercicios: string[];
  recursos: string[];
  consejos: string[];
}

export interface MathTeacherInput {
  materia: string;
  tema: string;
  nivel: string;
  tipoEjercicio: string;
  descripcion?: string;
}

export interface MathTeacherOutput {
  explicacion: string;
  ejercicios: string[];
  pasos: string[];
  recursos: string[];
}

export type StudentToolName = 'maestroIngles' | 'maestroMatematicas';

export type StudentToolInput = 
  | { tool: 'maestroIngles'; input: EnglishTeacherInput }
  | { tool: 'maestroMatematicas'; input: MathTeacherInput };

export type StudentToolOutput = 
  | { tool: 'maestroIngles'; output: EnglishTeacherOutput }
  | { tool: 'maestroMatematicas'; output: MathTeacherOutput };

export type StudentToolComponentProps = {
  onSubmit: (data: EnglishTeacherInput | MathTeacherInput) => void;
  isLoading?: boolean;
};

export interface StudentToolData {
  name: StudentToolName;
  title: string;
  description: string;
  icon: string;
  component: React.ComponentType<StudentToolComponentProps>;
}

export type StudentTools = StudentToolData[]; 