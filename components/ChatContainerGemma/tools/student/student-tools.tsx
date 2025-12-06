'use client';

import { EnglishTeacher } from './english-teacher';
import { MathTeacher } from './math-teacher';
import { StudentTools } from './types';

export const studentTools: StudentTools = [
  {
    name: 'maestroIngles',
    title: 'Maestro de Inglés',
    description: 'Aprende inglés con ejercicios y explicaciones personalizadas',
    icon: '🇬🇧',
    component: EnglishTeacher
  },
  {
    name: 'maestroMatematicas',
    title: 'Maestro de Matemáticas',
    description: 'Resuelve problemas matemáticos y aprende conceptos paso a paso',
    icon: '📐',
    component: MathTeacher
  }
];