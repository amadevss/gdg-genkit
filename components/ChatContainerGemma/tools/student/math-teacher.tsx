'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MathTeacherInput } from './types';

interface MathTeacherProps {
  onSubmit: (data: MathTeacherInput) => void;
  isLoading?: boolean;
}

export function MathTeacher({ onSubmit, isLoading }: MathTeacherProps) {
  const [formData, setFormData] = useState<MathTeacherInput>({
    materia: '',
    tema: '',
    nivel: '',
    tipoEjercicio: '',
    descripcion: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="materia">Materia</Label>
        <Select
          value={formData.materia}
          onValueChange={(value) => setFormData({ ...formData, materia: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona la materia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="algebra">Álgebra</SelectItem>
            <SelectItem value="geometria">Geometría</SelectItem>
            <SelectItem value="trigonometria">Trigonometría</SelectItem>
            <SelectItem value="calculo">Cálculo</SelectItem>
            <SelectItem value="estadistica">Estadística</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tema">Tema</Label>
        <Input
          id="tema"
          value={formData.tema}
          onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
          placeholder="Ej: Ecuaciones cuadráticas, Teorema de Pitágoras, etc."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nivel">Nivel</Label>
        <Select
          value={formData.nivel}
          onValueChange={(value) => setFormData({ ...formData, nivel: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el nivel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basico">Básico</SelectItem>
            <SelectItem value="intermedio">Intermedio</SelectItem>
            <SelectItem value="avanzado">Avanzado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipoEjercicio">Tipo de Ejercicio</Label>
        <Select
          value={formData.tipoEjercicio}
          onValueChange={(value) => setFormData({ ...formData, tipoEjercicio: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el tipo de ejercicio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="teoria">Teoría</SelectItem>
            <SelectItem value="ejercicios">Ejercicios</SelectItem>
            <SelectItem value="problemas">Problemas</SelectItem>
            <SelectItem value="explicacion">Explicación paso a paso</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción (opcional)</Label>
        <Textarea
          id="descripcion"
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          placeholder="Describe lo que quieres aprender o practicar..."
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Procesando...' : 'Obtener Ayuda'}
      </Button>
    </form>
  );
} 