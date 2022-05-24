import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from 'app/config/error.constants';
import { RegisterService } from './register.service';
import { Registration, RegistrationCompany, RegistrationInfluencer } from './register.model';

@Component({
  selector: 'jhi-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements AfterViewInit {
  @ViewChild('login', { static: false })
  login?: ElementRef;

  doNotMatch = false;
  error = false;
  errorEmailExists = false;
  errorUserExists = false;
  success = false;
  userType?: string;

  registerForm = this.fb.group({
    login: [
      '',
      [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$'),
      ],
    ],
    email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    nome: [],
    regiao: [],
    nicho: [],
    site: [],
    bio: [],
    redes: [],
  });

  constructor(private translateService: TranslateService, private registerService: RegisterService, private fb: FormBuilder) {}

  ngAfterViewInit(): void {
    if (this.login) {
      this.login.nativeElement.focus();
    }
  }

  register(): void {
    this.doNotMatch = false;
    this.error = false;
    this.errorEmailExists = false;
    this.errorUserExists = false;

    const password = this.registerForm.get(['password'])!.value;
    console.warn('cheguei aqui 1!');
    if (password !== this.registerForm.get(['confirmPassword'])!.value) {
      this.doNotMatch = true;
      console.warn('cheguei aqui 2!');
    } else {
      console.warn('cheguei aqui 3!');

      if (this.userType === 'empresa') {
        console.warn('cheguei aqui 4!');

        const user = this.createModelCompany();
        this.registerService.saveCompany(user).subscribe(
          () => (this.success = true),
          response => this.processError(response)
        );
      }
      if (this.userType === 'influenciador') {
        console.warn('cheguei aqui 5!');

        const user = this.createModelInfluencer();
        this.registerService.saveInfluencer(user).subscribe(
          () => (this.success = true),
          response => this.processError(response)
        );
      }
    }
  }

  private createModel(): Registration {
    const newUser: Registration = {
      email: this.registerForm.get(['email'])!.value,
      login: this.registerForm.get(['login'])!.value,
      password: this.registerForm.get(['password'])!.value,
      langKey: this.translateService.currentLang,
    };
    return newUser;
  }

  private createModelCompany(): RegistrationCompany {
    const newUser: RegistrationCompany = {
      email: this.registerForm.get(['email'])!.value,
      login: this.registerForm.get(['login'])!.value,
      password: this.registerForm.get(['password'])!.value,
      langKey: this.translateService.currentLang,
      nome: this.registerForm.get(['nome'])!.value,
      regiao: this.registerForm.get(['regiao'])!.value,
      nicho: this.registerForm.get(['nicho'])!.value,
      site: this.registerForm.get(['site'])!.value,
    };
    return newUser;
  }

  private createModelInfluencer(): RegistrationInfluencer {
    const newUser: RegistrationInfluencer = {
      email: this.registerForm.get(['email'])!.value,
      login: this.registerForm.get(['login'])!.value,
      password: this.registerForm.get(['password'])!.value,
      langKey: this.translateService.currentLang,
      nome: this.registerForm.get(['nome'])!.value,
      regiao: this.registerForm.get(['regiao'])!.value,
      bio: this.registerForm.get(['bio'])!.value,
      redes: this.registerForm.get(['redes'])!.value,
    };
    return newUser;
  }

  private processError(response: HttpErrorResponse): void {
    if (response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE) {
      this.errorUserExists = true;
    } else if (response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE) {
      this.errorEmailExists = true;
    } else {
      this.error = true;
    }
  }
}
