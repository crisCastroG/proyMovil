import { Asistencia } from "./asistencia.model";

export interface Seccion {
    id: string;                      
    nombSeccion: number;                  
    asistencia: Asistencia[];        
  }