import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Registration, RegistrationCompany, RegistrationInfluencer } from './register.model';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  save(registration: Registration): Observable<{}> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/register'), registration);
  }

  saveCompany(registration: RegistrationCompany): Observable<{}> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/register/company'), registration);
  }

  saveInfluencer(registration: RegistrationInfluencer): Observable<{}> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/register/influencer'), registration);
  }
}
