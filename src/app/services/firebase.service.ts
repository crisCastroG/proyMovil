import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile } from '@firebase/auth'
import { User } from '../models/user.model';
import { getFirestore, setDoc, doc, getDoc, collection, addDoc, collectionData, query } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { UserService } from './user.service';
import { AsignaturaAlumno } from '../models/asignatura_alumno.model';
import { AsistenciasPendientes } from '../models/asistenciasPendientes';
import { Asistente } from '../models/asistente.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {


  auth = inject(AngularFireAuth);
  firestore = inject(AngularFireAuth);
  utilsSvc = inject(UtilsService);


  getAuth() {
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
  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    this.utilsSvc.routerLink('/login');
  }

  // Actualizar usuario
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  // Base de datos

  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  getCollectionData(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery), { idField: 'id' });
  }

  async getAsignatura(userId: string, asignaturaId: string) {
    return (await getDoc(doc(getFirestore(), `users/${userId}/asignaturas_profesor/${asignaturaId}`))).data();
  }
  async getSeccion(userId: string, asignaturaId: string, seccionId: string) {
    return (await getDoc(doc(getFirestore(), `users/${userId}/asignaturas_profesor/${asignaturaId}/secciones/${seccionId}`))).data();
  }

  async cargarAsistenciasPendientes(uid: string, username: string) {
    let asistenciasPendientes: AsistenciasPendientes = this.utilsSvc.getFromLocalStorage("asistenciasPendientes_" + uid) as AsistenciasPendientes;
    try {
      for(let asisPend of asistenciasPendientes.asistencias){
        let asignaturaDocument = await getDoc(doc(getFirestore(), `users/${uid}/asignaturas_alumno/${asisPend.idAsignatura}`));

        let asignaturaAlumno: AsignaturaAlumno = {
          idAsignatura: asisPend.idAsignatura,
          idSeccion: asisPend.idSeccion,
          idProfesor: asisPend.idProfesor,
          nombreAsignatura: asisPend.nombreAsignatura,
          siglaAsignatura: asisPend.siglaAsignatura,
          nombreSeccion: asisPend.nombreSeccion,
          nombreProfesor: asisPend.nombreprofesor
        }

        if (!asignaturaDocument.exists()) // Si no existe la asignatura, agregarla
        {
          await this.setDocument(`users/${uid}/asignaturas_alumno/${asignaturaAlumno.idAsignatura}`, asignaturaAlumno);
        }
        else {
          let asignaturaDetalleData = asignaturaDocument.data()
          if (asignaturaDetalleData["idSeccion"] !== asisPend.idSeccion) {
            return;
          }
        }

        // Registrar al alumno en la lista de asistentes
        let asistente: Asistente = {
          uid: uid,
          nombreCompleto: username,
          hora: this.getFormattedTime(new Date())
        }

        await this.setDocument(`users/${asisPend.idProfesor}/asignaturas_profesor/${asisPend.idAsignatura}/secciones/${asisPend.idSeccion}/asistencias/${asisPend.idAsistencia}/asistentes/${uid}`, asistente);
      }
      this.utilsSvc.saveInLocalStorage("asistenciasPendientes_" + uid, null)
      this.utilsSvc.presentToast({
        message: 'Asistencias actualizadas',
        duration: 2500,
        color: 'primary',
        position: 'middle'
      });
      return;
    } catch (error) {
      this.utilsSvc.presentToast({
        message: 'Error de conexión, intente nuevamente.',
        duration: 2500,
        color: 'primary',
        position: 'middle'
      });
      throw new Error("Error de conexión");
    }

  }

  getFormattedTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }



}
