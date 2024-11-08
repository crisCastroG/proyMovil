import { Alumno } from "./alumno.model";

export interface Asistencia {
    fecha: string;                   
    alumnosAsistentes: Alumno[];     
  }