import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EscaneoFallidoPage } from './escaneo-fallido.page';

describe('EscaneoFallidoPage', () => {
  let component: EscaneoFallidoPage;
  let fixture: ComponentFixture<EscaneoFallidoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EscaneoFallidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
