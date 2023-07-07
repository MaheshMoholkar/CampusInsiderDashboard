import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedInGuard: boolean = false;
  constructor(
    private auth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router
  ) {}

  login(email: any, password: any) {
    this.auth
      .signInWithEmailAndPassword(email, password)
      .then((logRef) => {
        this.toastr.success('Login Successful');
        this.loadUser();
        this.loggedIn.next(true);
        this.isLoggedInGuard = true;
        this.router.navigate(['']);
      })
      .catch((error) => {
        this.toastr.warning(error);
      });
  }

  loadUser() {
    this.auth.authState.subscribe((user) => {
      localStorage.setItem('user', JSON.stringify(user));
    });
  }

  logOut() {
    this.auth.signOut().then(() => {
      this.toastr.warning('Logged Out!');
      localStorage.removeItem('user');
      this.loggedIn.next(false);
      this.isLoggedInGuard = false;
      this.router.navigate(['/login']);
    });
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }
}
