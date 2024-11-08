import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile } from '@firebase/auth'
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, collection, addDoc, collectionData, query} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFireAuth);
  utilsSvc = inject(UtilsService);

  getAuth(){
    return getAuth();
  }

  // Autenticacion
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // Creacion de usuario
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // Cerrar sesión
  signOut(){
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/login');
  }

  // Actualizar usuario
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  // Base de datos
  
  setDocument(path: string, data: any){
    return setDoc(doc(getFirestore(), path), data);
  }
  addDocument(path: string, data: any){
    return addDoc(collection(getFirestore(), path), data);
  }

  async getDocument(path: string){
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  getCollectionData(path: string, collectionQuery?: any){
    const ref = collection(getFirestore(),path);
    return collectionData(query(ref,collectionQuery), {idField: 'id'});
  }

}
