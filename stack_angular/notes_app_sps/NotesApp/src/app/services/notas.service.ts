import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { NotaPaginate } from '../models/Notas.paginate.interface';
import { AuthService } from './auth.service';
import { nota } from '../models/nota.interface';
@Injectable({
  providedIn: 'root',
})
export class NotasService {
  HostUrl = environment.url;
  constructor(private httpClient: HttpClient, private apiLogin: AuthService) {}

  ListadoDeNotas = async (limit: number = 10, page: number = 1) => {
    return (await this.httpClient
      .get(`${this.HostUrl}/notes?limit=${limit}&page=${page}`, {
        headers: this.apiLogin.userHeaders(),
      })
      .toPromise()) as NotaPaginate;
  };

  descativarNota = async (_id: string) => {
    return await this.httpClient
      .delete(`${this.HostUrl}/notes/${_id}`, {
        headers: this.apiLogin.userHeaders(),
      })
      .toPromise();
  };
  addNota = async (nota: nota) => {
    return await this.httpClient
      .post(`${this.HostUrl}/notes`, nota, {
        headers: this.apiLogin.userHeaders(),
      })
      .toPromise();
  };
}
