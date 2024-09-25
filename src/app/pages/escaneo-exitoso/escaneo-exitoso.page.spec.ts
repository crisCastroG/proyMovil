import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EscaneoExitosoPage } from './escaneo-exitoso.page';

describe('EscaneoExitosoPage', () => {
  let component: EscaneoExitosoPage;
  let fixture: ComponentFixture<EscaneoExitosoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EscaneoExitosoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
