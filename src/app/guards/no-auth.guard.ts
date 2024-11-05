import { CanActivateFn } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';
import { inject } from '@angular/core';

export const noAuthGuard: CanActivateFn = (route, state) => {

  const firebaseSvc = inject(FirebaseService);
  const utilsSvc = inject(UtilsService);


  let user = localStorage.getItem('user');


  return new Promise((resolve) => {

    firebaseSvc.getAuth().onAuthStateChanged((auth) => {
      if (!auth) {
        resolve(true);
      }
      else {
        utilsSvc.routerLink('/home');
        resolve(false);
      }
    })

  });
};
