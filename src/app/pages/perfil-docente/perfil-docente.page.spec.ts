import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilDocentePage } from './perfil-docente.page';

describe('PerfilDocentePage', () => {
  let component: PerfilDocentePage;
  let fixture: ComponentFixture<PerfilDocentePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilDocentePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
