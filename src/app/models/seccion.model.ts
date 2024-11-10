import { Asistencia } from "./asistencia.model";

export interface Seccion {
    id: string;                      
    nombSeccion: string;                  
    asistencia: Asistencia[];        
  }