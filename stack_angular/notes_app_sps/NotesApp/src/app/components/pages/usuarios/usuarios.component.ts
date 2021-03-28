import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserPaginate } from 'src/app/models/use.paginate.interfce';
import Swal from 'sweetalert2';
import { UsuariosService } from '../../../services/usuarios.service';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/user.interface';
import { ThrowStmt } from '@angular/compiler';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  editar = false;
  limitItems = 6;
  page = 1;
  selected = new FormControl(0);
  UsuarioForm: FormGroup;

  Usuarios: UserPaginate | any = [];

  displayedColumns: string[] = ['nombre', 'email', 'rol', 'acciones'];

  roles = [
    {
      id: 1,
      name: 'Administrador',
    },
    {
      id: 2,
      name: 'Usuario normal',
    },
  ];

  _idUser = '';
  dataSource: MatTableDataSource<any>;

  constructor(private _usuarioservice: UsuariosService) {}
  ngOnInit(): void {
    this.getUsuarios();
    this.UsuarioForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.minLength(3),
      ]),
      nombre: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      rol: new FormControl(null),
    });
  }

  async getUsuarios(page: number = 1) {
    await this._usuarioservice
      .ListadoDeUsuarios(this.limitItems, page)
      .then((data: UserPaginate) => {
        this.Usuarios = data;
        this.dataSource = new MatTableDataSource(data.docs);
        this.page = data.page;
      });
  }

  triggerClick(_usuario: User) {
    this._idUser = _usuario._id;
    this.UsuarioForm.get('email').setValue(_usuario.email);
    this.UsuarioForm.get('nombre').setValue(_usuario.nombre);
    this.UsuarioForm.get('rol').setValue(_usuario.rol);
    this.selected.setValue(1);
    this.editar = true;
  }

  errorPass(): Boolean {
    if (this.UsuarioForm.controls.hasOwnProperty('password')) {
      if (
        this.UsuarioForm.controls.password.touched &&
        this.UsuarioForm.controls.password.errors
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  chanegeTab(index: number) {
    if (!this.editar && index == 1) {
      this.UsuarioForm.reset();
      this.UsuarioForm.get('rol').setValue(2);
      this.UsuarioForm.get('email').setValue(null);
      if (!this.UsuarioForm.controls.hasOwnProperty('password')) {
        this.UsuarioForm.addControl(
          'password',
          new FormControl(null, [Validators.required, Validators.minLength(3)])
        );
      }
    } else {
      if (this.editar && index == 1) {
        this.UsuarioForm.removeControl('password');
      } else {
        if (index == 0) {
          this.editar = false;
          this._idUser = null;
          if (this.UsuarioForm.controls.hasOwnProperty('password')) {
            this.UsuarioForm.removeControl('password');
          } else {
            this.UsuarioForm.addControl(
              'password',
              new FormControl(null, [
                Validators.required,
                Validators.minLength(3),
              ])
            );
          }
        }
      }
    }
    this.selected.setValue(index);
  }

  eliminarUser(_user: User) {
    Swal.fire({
      title: '¿Vas a eliminar al usuario ' + _user.email + ' ?',
      text:
        '¿Estas seguro de eliminar al usuario ' +
        new Date(_user.nombre).toDateString() +
        ' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then(async (result) => {
      if (result.value) {
        await this._usuarioservice.descativarUser(_user._id).then(() => {
          if (this.page === 1) {
            this.getUsuarios();
          } else {
            if (this.Usuarios.docs.length === 1 && this.page !== 1) {
              this.page = this.page - 1;
              this.getUsuarios(this.page);
            } else {
              this.getUsuarios(this.page);
            }
          }
          Swal.fire('Listo!', 'Tu el usuario fue eliminado!', 'success');
        });
      }
    });
  }

  addUser() {
    if (this.UsuarioForm.valid) {
      let user: User = {
        nombre: this.UsuarioForm.value.nombre,
        email: this.UsuarioForm.value.email,
        rol: this.UsuarioForm.value.rol,
      };
      if (this.editar) {
        user._id = this._idUser;
      } else {
        user.password = this.UsuarioForm.value.password;
      }
      const entretexto = this.editar ? 'editar' : 'añadir';
      const title =
        '¿Vas a ' + entretexto + ' un usuario con email ' + user.email + ' ?';
      const text =
        '¿Estas seguro de ' + entretexto + ' a ' + user.nombre + ' ?';
      Swal.fire({
        title: title,
        text: text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
      }).then(async (result) => {
        if (result.value) {
          if (this.editar) {
            await this._usuarioservice.updateUsuario(user).then(() => {
              this.getUsuarios(this.page);
              Swal.fire(
                'Listo!',
                'Tu usuario fue ' + this.editar ? 'editado' : 'añadido' + '!',
                'success'
              );
              this.UsuarioForm.reset();
              this.chanegeTab(0);
            });
          } else {
            await this._usuarioservice.addUsuario(user).then(() => {
              if (this.Usuarios.docs.length === this.limitItems) {
                this.page = this.page + 1;
                this.getUsuarios(this.page);
              } else {
                this.getUsuarios(this.page);
              }
              Swal.fire(
                'Listo!',
                'Tu usuario fue ' + this.editar ? 'editado' : 'añadido' + '!',
                'success'
              );
              this.UsuarioForm.reset();
              this.UsuarioForm.get('rol').setValue(2);
            });
          }
        }
      });
    }
  }

  pageChange(event: number) {
    this.page = event;
    this.getUsuarios(this.page);
  }
}
