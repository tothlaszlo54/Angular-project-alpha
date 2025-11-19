import { Injectable } from "@angular/core";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "@angular/fire/firestore";
import { from, map, Observable } from "rxjs";
import { UserModel } from "../models/user.model";
import { RatingModel } from "../models/rating.model";

@Injectable({
  providedIn: "root",
})
export class FirestoreService {
  private readonly usersCollectionRef = collection(this.firestore, "users");
  private readonly ratingsCollectionRef = collection(this.firestore, "ratings");

  constructor(private firestore: Firestore) {}

  //USER COLLECTION
  //CREATE
  addUser(user: UserModel): Observable<DocumentData> {
    return from(addDoc(this.usersCollectionRef, user));
  }

  //READ ALL

  getUsers(): Observable<UserModel[]> {
    return from(getDocs(this.usersCollectionRef)).pipe(
      map((snapshot) => {
        const resultList = snapshot.docs.map((doc) => {
          const userData: UserModel = doc.data() as UserModel;
          userData.id = doc.id;
          return userData;
        });
        return resultList;
      })
    );
  }

  // READ ONE

  getUser(id: string): Observable<UserModel> {
    const q = query(this.usersCollectionRef, where("UId", "==", id));
    const userDoc = doc(this.firestore, `users/${id}`);
    return from(getDocs(q)).pipe(
      map((snapshot) => {
        const userData: UserModel = snapshot.docs[0].data() as UserModel;
        userData.id = snapshot.docs[0].id;
        return userData;
      })
    );
  }

  //DELETE

  deleteUser(userId: string): Observable<void> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    return from(deleteDoc(userDoc));
  }

  //UPDATE

  updateUser(user: UserModel): Observable<void> {
    const userDoc = doc(this.firestore, `users/${user.id}`);
    return from(setDoc(userDoc, user));
  }

  //RATING COLLECTION

  //CREATE
  addRating(rating: RatingModel): Observable<DocumentData> {
    return from(addDoc(this.ratingsCollectionRef, rating));
  }

  //READ ALL

  getRatings(): Observable<RatingModel[]> {
    return from(getDocs(this.ratingsCollectionRef)).pipe(
      map((snapshot) => {
        const resultList = snapshot.docs.map((doc) => {
          const ratingData: RatingModel = doc.data() as RatingModel;
          ratingData.id = doc.id;
          return ratingData;
        });
        return resultList;
      })
    );
  }

  // READ BY BOOK ID
  getRatingsByBookId(bookId: string): Observable<RatingModel[]> {
    return from(
      getDocs(query(this.ratingsCollectionRef, where("bookId", "==", bookId)))
    ).pipe(
      map((snapshot) => {
        const resultList = snapshot.docs.map((doc) => {
          const ratingData: RatingModel = doc.data() as RatingModel;
          ratingData.id = doc.id;
          return ratingData;
        });
        return resultList;
      })
    );
  }

  // READ ONE

  getRating(id: string): Observable<RatingModel> {
    const ratingDoc = doc(this.firestore, `ratings/${id}`);
    return from(getDoc(ratingDoc)).pipe(
      map((doc) => {
        const ratingData: RatingModel = doc.data() as RatingModel;
        ratingData.id = doc.id;
        return ratingData;
      })
    );
  }

  //DELETE

  deleteRating(ratingId: string): Observable<void> {
    const ratingDoc = doc(this.firestore, `ratings/${ratingId}`);
    return from(deleteDoc(ratingDoc));
  }

  //UPDATE

  updateRating(rating: RatingModel): Observable<void> {
    const ratingDoc = doc(this.firestore, `ratings/${rating.id}`);
    return from(setDoc(ratingDoc, rating));
  }
}
