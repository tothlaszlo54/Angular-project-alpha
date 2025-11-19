import { Injectable } from "@angular/core";
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  DocumentData,
  Firestore,
  getDocs,
  query,
  setDoc,
  where,
} from "@angular/fire/firestore";
import { UserModel } from "../models/user.model";
import { Observable, from, map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export default class UserService {
  private readonly userCollectionRef = collection(this.firestore, "users");
  constructor(private firestore: Firestore) {}

  public checkIfUserExists (email:string) {
    const q = query(this.userCollectionRef, where("email", "==", email));
    return from(getDocs(q)).pipe(map((res) => !res.empty));
  }

  //* CREATE
  createUser(user: UserModel): Observable<DocumentData> {
    return from(addDoc(this.userCollectionRef, user));
  }

  //*READ ONE
  // folyamatos kapcsolatot terem - sok olvasás
  getUser(id: string): Observable<UserModel> {
    const customerDoc = doc(this.firestore, `users/${id}`);
    return docData(customerDoc, { idField: "id" }) as Observable<UserModel>;
  }

  //* DELETE
  deleteUser(userId: string): Observable<void> {
    const userDoc = doc(this.firestore, `user/${userId}`);
    return from(deleteDoc(userDoc));
  }

  //* UPDATE
  updateCustomer(customer: UserModel): Observable<void> {
    const customerDoc = doc(this.firestore, `users/${customer.id}`);
    return from(setDoc(customerDoc, customer));
  }
}
