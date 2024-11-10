import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})

export class UserService {
  private userDataSource = new BehaviorSubject<User | null>(null);
  userData$ = this.userDataSource.asObservable();

  setUserData(user: User) {
    this.userDataSource.next(user);
  }

  clearUserData() {
    this.userDataSource.next(null);
  }
}
