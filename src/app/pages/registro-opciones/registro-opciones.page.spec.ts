import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroOpcionesPage } from './registro-opciones.page';

describe('RegistroOpcionesPage', () => {
  let component: RegistroOpcionesPage;
  let fixture: ComponentFixture<RegistroOpcionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroOpcionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
