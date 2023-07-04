import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  constructor(private firestore: AngularFirestore) {}
  ngOnInit(): void {}
  onSubmit(formData: any) {
    let categoryData = {
      category: formData.value.category,
    };
    this.firestore
      .collection('category')
      .add(categoryData)
      .then((docRef) => {
        console.log(docRef);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
