export interface DetalleAsistencia {
    idAsignatura?: string;
    idSeccion?: string;
    idAsistencia?: string;
    idProfesor?: string;
    nombreprofesor?: string;
    nombreAsignatura? : string;
    siglaAsignatura? : string;          
    nombreSeccion?: string;
    numeroAsistentes?: number;
    fecha?: string;
    hora?: string; 
  }