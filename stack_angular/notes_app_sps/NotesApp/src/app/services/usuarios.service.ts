import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  HostUrl =  environment.url

  headers = new HttpHeaders(
    {'content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',}
  );

  constructor(private httpClient: HttpClient, private apiLogin: AuthService)
  {
    this.headers.set('Autorization',apiLogin.getToken())
  }

  post = async (url: string, body: any) =>
  await this.httpClient.post(`${this.HostUrl}/${url}`, body).toPromise();
}
