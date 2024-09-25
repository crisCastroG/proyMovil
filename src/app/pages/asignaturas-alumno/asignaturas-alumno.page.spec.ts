import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsignaturasAlumnoPage } from './asignaturas-alumno.page';

describe('AsignaturasAlumnoPage', () => {
  let component: AsignaturasAlumnoPage;
  let fixture: ComponentFixture<AsignaturasAlumnoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignaturasAlumnoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
