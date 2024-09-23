import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroAsignaturaPage } from './registro-asignatura.page';

describe('RegistroAsignaturaPage', () => {
  let component: RegistroAsignaturaPage;
  let fixture: ComponentFixture<RegistroAsignaturaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroAsignaturaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
