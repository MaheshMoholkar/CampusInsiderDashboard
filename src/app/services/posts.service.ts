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

  uploadImage(image: any, postData: any) {
    const filePath = `postIMG/${Date.now()}`;

    this.storage.upload(filePath, image).then(() => {
      this.storage
        .ref(filePath)
        .getDownloadURL()
        .subscribe((url) => {
          postData.postImgPath = url;
          this.saveData(postData);
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
}
