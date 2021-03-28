import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserPaginate } from '../models/use.paginate.interfce';
import { User } from '../models/user.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  HostUrl = environment.url;

  constructor(private httpClient: HttpClient, private apiLogin: AuthService) {}

  ListadoDeUsuarios = async (limit: number = 10, page: number = 1) => {
    return (await this.httpClient
      .get(`${this.HostUrl}/users?limit=${limit}&page=${page}`, {
        headers: this.apiLogin.userHeaders(),
      })
      .toPromise()) as UserPaginate;
  };
  addUsuario = async (_user: User) => {
    return await this.httpClient
      .post(`${this.HostUrl}/users`, _user, {
        headers: this.apiLogin.userHeaders(),
      })
      .toPromise();
  };

  descativarUser = async (_id: string) => {
    return await this.httpClient
      .delete(`${this.HostUrl}/users/${_id}`, {
        headers: this.apiLogin.userHeaders(),
      })
      .toPromise();
  };

  updateUsuario = async (_user: User) => {
    return await this.httpClient
      .put(`${this.HostUrl}/users/${_user._id}`, _user, {
        headers: this.apiLogin.userHeaders(),
      })
      .toPromise();
  };
}
