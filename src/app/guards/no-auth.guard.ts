import { CanActivateFn } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';
import { inject } from '@angular/core';
import { User } from '../models/user.model';

export const noAuthGuard: CanActivateFn = (route, state) => {

  const utilsSvc = inject(UtilsService);


  let user = localStorage.getItem('user');
  let userType = localStorage.getItem('userType');

  return new Promise((resolve) => {

      if (!user) {
        resolve(true);
      }
      else {
        if(userType === "profesor"){
          utilsSvc.routerLink('/home');
          resolve(false);
        }else{
          utilsSvc.routerLink('/home-alumno');
          resolve(false);
          
        }
        

      }


  });
};
