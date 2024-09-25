import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EscanearQrAlumnoPage } from './escanear-qr-alumno.page';

describe('EscanearQrAlumnoPage', () => {
  let component: EscanearQrAlumnoPage;
  let fixture: ComponentFixture<EscanearQrAlumnoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EscanearQrAlumnoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
