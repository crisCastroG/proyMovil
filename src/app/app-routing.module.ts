import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule), canActivate:[authGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'botones',
    loadChildren: () => import('./pages/botones/botones.module').then( m => m.BotonesPageModule)
  },
  {
    path: 'alertas',
    loadChildren: () => import('./pages/alertas/alertas.module').then( m => m.AlertasPageModule)
  },
  {
    path: 'formulario',
    loadChildren: () => import('./pages/formulario/formulario.module').then( m => m.FormularioPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule), canActivate:[noAuthGuard]
  },
  {
    path: 'registro-asignatura',
    loadChildren: () => import('./pages/registro-asignatura/registro-asignatura.module').then( m => m.RegistroAsignaturaPageModule), canActivate:[authGuard]
  },
  {
    path: 'asignaturas',
    loadChildren: () => import('./pages/asignaturas/asignaturas.module').then( m => m.AsignaturasPageModule), canActivate:[authGuard]
  },
  {
    path: 'generar-qr',
    loadChildren: () => import('./pages/generar-qr/generar-qr.module').then( m => m.GenerarQrPageModule), canActivate:[authGuard]
  },
  {
    path: 'confirmacion-qr',
    loadChildren: () => import('./pages/confirmacion-qr/confirmacion-qr.module').then( m => m.ConfirmacionQrPageModule), canActivate:[authGuard]
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule), canActivate:[noAuthGuard]
  },
  {
    path: 'asignatura-detalle',
    loadChildren: () => import('./pages/asignatura-detalle/asignatura-detalle.module').then( m => m.AsignaturaDetallePageModule), canActivate:[authGuard]
  },
  {
    path: 'codigo-qr',
    loadChildren: () => import('./pages/codigo-qr/codigo-qr.module').then( m => m.CodigoQrPageModule), canActivate:[authGuard]
  },
  {
    path: 'home-alumno',
    loadChildren: () => import('./pages/home-alumno/home-alumno.module').then( m => m.HomeAlumnoPageModule), canActivate:[authGuard]
  },
  {
    path: 'asignaturas-alumno',
    loadChildren: () => import('./pages/asignaturas-alumno/asignaturas-alumno.module').then( m => m.AsignaturasAlumnoPageModule), canActivate:[authGuard]
  },
  {
    path: 'asignaturas-alumno-detalle',
    loadChildren: () => import('./pages/asignaturas-alumno-detalle/asignaturas-alumno-detalle.module').then( m => m.AsignaturasAlumnoDetallePageModule), canActivate:[authGuard]
  },
  {
    path: 'asistencia-detalle',
    loadChildren: () => import('./pages/asistencia-detalle/asistencia-detalle.module').then( m => m.AsistenciaDetallePageModule), canActivate:[authGuard]
  },
  {
    path: 'components',
    loadChildren: ()  => import('./components/components.module').then(m => m.ComponentsModule), canActivate:[authGuard]
  },
  {
    path: 'asistencia-detalle',
    loadChildren: () => import('./pages/asistencia-detalle/asistencia-detalle.module').then( m => m.AsistenciaDetallePageModule), canActivate:[authGuard]
  },
  {
    path: 'escanear-qr-alumno',
    loadChildren: () => import('./pages/escanear-qr-alumno/escanear-qr-alumno.module').then( m => m.EscanearQrAlumnoPageModule), canActivate:[authGuard]
  },
  {
    path: 'escaneo-exitoso',
    loadChildren: () => import('./pages/escaneo-exitoso/escaneo-exitoso.module').then( m => m.EscaneoExitosoPageModule), canActivate:[authGuard]
  },
  {
    path: 'escaneo-fallido',
    loadChildren: () => import('./pages/escaneo-fallido/escaneo-fallido.module').then( m => m.EscaneoFallidoPageModule), canActivate:[authGuard]
  },
  {
    path: 'registro-alumno',
    loadChildren: () => import('./pages/registro-alumno/registro-alumno.module').then( m => m.RegistroAlumnoPageModule)
  },
  {
    path: 'registro-opciones',
    loadChildren: () => import('./pages/registro-opciones/registro-opciones.module').then( m => m.RegistroOpcionesPageModule)
  },
  {
    path: 'perfil-alumno',
    loadChildren: () => import('./pages/perfil-alumno/perfil-alumno.module').then( m => m.PerfilAlumnoPageModule), canActivate:[authGuard]
  },
  {
    path: 'perfil-docente',
    loadChildren: () => import('./pages/perfil-docente/perfil-docente.module').then( m => m.PerfilDocentePageModule), canActivate:[authGuard]
  },




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
