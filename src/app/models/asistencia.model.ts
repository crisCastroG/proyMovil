import { Asistente } from "./asistente.model";

export interface Asistencia {
    id?: string; 
    fecha?: string;
    hora?: string;
    localizacion?: string;
    numeroAsistentes?: number;                  
    alumnosAsistentes?: Asistente[];     
  }