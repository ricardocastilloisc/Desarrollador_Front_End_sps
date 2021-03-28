import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserPaginate } from '../models/use.paginate.interfce';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  HostUrl =  environment.url

  constructor(private httpClient: HttpClient, private apiLogin: AuthService){}
  
  ListadoDeUsuarios = async (limit: number = 10, page: number = 1) => {
    return (await this.httpClient
      .get(`${this.HostUrl}/users?limit=${limit}&page=${page}`, {
        headers: this.apiLogin.userHeaders(),
      })
      .toPromise()) as UserPaginate;
  };
}
