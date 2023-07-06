import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
    private toastr: ToastrService,
    private router: Router
  ) {}

  uploadImage(image: any, postData: any, formStatus: any, id: any) {
    const filePath = `postIMG/${Date.now()}`;

    this.storage.upload(filePath, image).then(() => {
      this.storage
        .ref(filePath)
        .getDownloadURL()
        .subscribe((url) => {
          postData.postImgPath = url;
          if (formStatus == 'Edit') {
            this.updateData(id, postData);
          } else {
            this.saveData(postData);
          }
        });
    });
  }

  saveData(postData: any) {
    this.firestore
      .collection('posts')
      .add(postData)
      .then((docRef) => {
        this.toastr.success('Uploaded Successfully');
        this.router.navigate(['posts']);
      });
  }

  loadData() {
    return this.firestore
      .collection('posts')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc['id'];
            return { id, data };
          });
        })
      );
  }

  loadOneData(id: any) {
    return this.firestore.doc(`posts/${id}`).valueChanges();
  }

  updateData(id: any, postData: any) {
    this.firestore
      .doc(`posts/${id}`)
      .update(postData)
      .then(() => {
        this.toastr.success('Updated Post Successfully');
        this.router.navigate(['/posts']);
      });
  }

  deleteImage(postImgPath: string, id: any) {
    this.storage.storage
      .refFromURL(postImgPath)
      .delete()
      .then(() => {
        this.deleteData(id);
      });
  }

  deleteData(id: any) {
    this.firestore
      .doc(`posts/${id}`)
      .delete()
      .then(() => {
        this.toastr.warning('Deleted Successfully');
      });
  }

  markFeatured(id: any, featuredData: any) {
    this.firestore
      .doc(`posts/${id}`)
      .update(featuredData)
      .then(() => {
        this.toastr.info('Featured Status Changed');
      });
  }
}
