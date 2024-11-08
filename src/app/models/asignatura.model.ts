import { Seccion } from "./seccion.model";

export interface Asignatura {
    codAsig: string;          
    nombAsig: string;
    id : string;          
    secciones: Seccion[];    
  }