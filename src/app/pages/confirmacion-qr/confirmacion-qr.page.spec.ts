import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmacionQrPage } from './confirmacion-qr.page';

describe('ConfirmacionQrPage', () => {
  let component: ConfirmacionQrPage;
  let fixture: ComponentFixture<ConfirmacionQrPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacionQrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
