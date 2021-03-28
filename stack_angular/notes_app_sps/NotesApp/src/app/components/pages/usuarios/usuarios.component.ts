import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserPaginate } from 'src/app/models/use.paginate.interfce';
import Swal from 'sweetalert2';
import { UsuariosService } from '../../../services/usuarios.service';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  editar = false;
  limitItems = 6;
  page = 1;
  selected = new FormControl(0);
  UsuarioForm: FormGroup;

  Usuarios: UserPaginate | any = []

  displayedColumns: string[] = [
    'nombre',
    'email',
    'rol',
    'acciones'
  ];


  dataSource: MatTableDataSource<any>

  constructor(private _usuarioservice :UsuariosService) { }
  ngOnInit(): void {
    this.getUsuarios();
    this.UsuarioForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.minLength(6),
      ]),
      nombre: new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.minLength(6),
      ]),
    });
  }

  async getUsuarios(page: number = 1) {
    await this._usuarioservice
      .ListadoDeUsuarios(this.limitItems, page)
      .then((data: UserPaginate) => {
        this.Usuarios = data;
        this.dataSource = new MatTableDataSource(data.docs);
      });
  }

  triggerClick() {

    this.selected.setValue(1);
    this.editar = true;

  }
  chanegeTab(index:number){
    if(!this.editar && index == 1){
      this.UsuarioForm.setControl('password',new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.minLength(6),
      ]))
    }else{
      if(index==0){
        this.UsuarioForm.removeControl('password');
      }
    }
    this.selected.setValue(index);

  }


  pageChange(event: number) {
    this.page = event;
    this.getUsuarios(this.page);
  }

}
