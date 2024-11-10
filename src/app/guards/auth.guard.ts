import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UtilsService } from '../services/utils.service';

export const authGuard: CanActivateFn = (route, state) => {

  const utilsSvc = inject(UtilsService);

  let user = localStorage.getItem('user');
  let userType = localStorage.getItem('userType');

  return new Promise((resolve) => {

      if (user){
        resolve(true);
      } 
      else{
        utilsSvc.routerLink('/login');
        resolve(false);
      }


  });
};
