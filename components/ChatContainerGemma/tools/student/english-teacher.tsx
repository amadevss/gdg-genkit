'use client';

import { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EnglishTeacherInput } from './types';

interface EnglishTeacherProps {
  onSubmit: (data: EnglishTeacherInput) => void;
  isLoading?: boolean;
}

export function EnglishTeacher({ onSubmit, isLoading }: EnglishTeacherProps) {
  const [formData, setFormData] = useState<EnglishTeacherInput>({
    nivel: '',
    tema: '',
    tipoEjercicio: '',
    dificultad: '',
    descripcion: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nivel">Nivel</Label>
        <Select
          value={formData.nivel}
          onValueChange={(value) => setFormData({ ...formData, nivel: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona tu nivel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="principiante">Principiante</SelectItem>
            <SelectItem value="intermedio">Intermedio</SelectItem>
            <SelectItem value="avanzado">Avanzado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tema">Tema</Label>
        <Input
          id="tema"
          value={formData.tema}
          onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
          placeholder="Ej: Verbos irregulares, Presente perfecto, etc."
        />
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
            <SelectItem value="gramatica">Gramática</SelectItem>
            <SelectItem value="vocabulario">Vocabulario</SelectItem>
            <SelectItem value="pronunciacion">Pronunciación</SelectItem>
            <SelectItem value="conversacion">Conversación</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dificultad">Dificultad</Label>
        <Select
          value={formData.dificultad}
          onValueChange={(value) => setFormData({ ...formData, dificultad: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona la dificultad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="facil">Fácil</SelectItem>
            <SelectItem value="medio">Medio</SelectItem>
            <SelectItem value="dificil">Difícil</SelectItem>
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