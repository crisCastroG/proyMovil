import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsignaturasAlumnoDetallePage } from './asignaturas-alumno-detalle.page';

describe('AsignaturasAlumnoDetallePage', () => {
  let component: AsignaturasAlumnoDetallePage;
  let fixture: ComponentFixture<AsignaturasAlumnoDetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignaturasAlumnoDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
