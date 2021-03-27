import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NotasService } from '../../../services/notas.service';
import { NotaPaginate } from '../../../models/Notas.paginate.interface';
import { BreakpointObserver } from '@angular/cdk/layout';
import Swal from 'sweetalert2';
import { nota } from '../../../models/nota.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { User } from 'src/app/models/user.interface';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
})
export class NotesComponent implements OnInit {


  Notas: NotaPaginate | any = [];
  colSize = 4;

  limitItems = 8;
  page = 1;

  NotasForm: FormGroup;

  Fecha = new Date();

  Usuarios: [User] | any = []

  user:User;


  editar = false;

  tempNotaID:string;

  constructor(
    private notas: NotasService,
    BreakpointObserver: BreakpointObserver,
    private api: AuthService
  ) {
    this.user = this.api.getUser();
    BreakpointObserver.observe([
      '(max-width: 375px)',
      '(max-width: 640px)',
      '(max-width: 966px)',
      '(max-width: 1024px)',
      '(max-width: 1280px)',
      '(max-width: 1366px)',
      '(max-width: 1440px)',
      '(max-width: 1920px)',
    ]).subscribe((res) => {
      this.colSize =
        8 - Object.values(res.breakpoints).filter((e) => e == true).length === 1
          ? 1
          : 8 - Object.values(res.breakpoints).filter((e) => e == true).length;
    });
  }

  ngOnInit(): void {
    this.getListaDeNotas();

    if(
      this.user.rol === 1
    ){
      this.getUsuarios();
    }
    this.NotasForm = new FormGroup({
      titulo: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
      ]),
      descripcion: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      fecha: new FormControl(new Date()),
      usuario: new FormControl(null),
    });

  }

  selected = new FormControl(0);

  chanegeTab(index:number){
    if(this.user.rol === 1 && index ===1 && !this.editar)
    {
      this.NotasForm.get('usuario').setValue(
        this.Usuarios.filter(e =>e._id == this.user._id)[0]._id
      )
    }
    if(index == 0){
      this.editar = false
      this.resetForm();
    }
    if(index == 1 && !this.editar){
      this.tempNotaID = null;
    }
    this.selected.setValue(index);
  }

  triggerClick(_nota:nota) {

    this.selected.setValue(1);

    this.editar = true;

    this.tempNotaID = _nota._id
    this.NotasForm.get('titulo').setValue(_nota.titulo)
    this.NotasForm.get('descripcion').setValue(_nota.descripcion)
    this.NotasForm.get('fecha').setValue(new Date(_nota.NoteDate))

    if(
      this.user.rol === 1
    ){
      this.NotasForm.get('usuario').setValue(_nota.autor._id)
    }
    

    
  }

  async getListaDeNotas(page: number = 1) {
    await this.notas
      .ListadoDeNotas(this.limitItems, page)
      .then((data: NotaPaginate) => {
        this.Notas = data;
      });
  }

  async getUsuarios() {
    return await this.notas
      .getUsuarios()
      .then((data: [User]) => {
        this.Usuarios = data;
      });
  }

  eliminarNota(_NOTA: nota) {
    Swal.fire({
      title: '¿Vas a eliminar la no ' + _NOTA.titulo + ' ?',
      text:
        '¿Estas seguro de eliminar la nota con fecha ' +
        new Date(_NOTA.NoteDate).toDateString() +
        ' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then(async (result) => {
      if (result.value) {
        await this.notas.descativarNota(_NOTA._id).then(() => {
          if (this.page === 1) {
            this.getListaDeNotas();
          } else {
            if (this.Notas.docs.length === 1 && this.page !== 1) {
              this.page = this.page - 1;
              this.getListaDeNotas(this.page);
            } else {
              this.getListaDeNotas(this.page);
            }
          }
          Swal.fire('Listo!', 'Tu nota fue eliminada!', 'success');
        });
      }
    });
  }

  addNota() {
    
    if (this.NotasForm.valid) {
      let nota: nota = {
        titulo: this.NotasForm.value.titulo,
        NoteDate: this.NotasForm.value.fecha,
        descripcion: this.NotasForm.value.descripcion,
      };
      if(this.user.rol === 1){
        nota.autor_id = this.NotasForm.value.usuario;
      }


      const entretexto = this.editar?'editar':'añadir'

      const title = '¿Vas a '+  entretexto + ' una nota ' + nota.titulo + ' ?';
      const text =  '¿Estas seguro de '+ entretexto + ' nota con fecha ' + nota.NoteDate.toDateString() +' ?'
     console.log(title);
     console.log(text);
      Swal.fire({
        title: title,
        text: text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
      }).then(async (result) => {
        if (result.value) {
          if(this.editar){
            await this.notas.updateNota(this.tempNotaID,nota).then(() => {
              this.getListaDeNotas(this.page);
              Swal.fire('Listo!', 'Tu nota fue '+ this.editar?'editar':'añadir'+ '!', 'success');
              this.resetForm();
              this.chanegeTab(0);
            })
          }else{
            await this.notas.addNota(nota).then(() => {
              if (this.Notas.docs.length === this.limitItems) {
                this.page = this.page + 1;
                this.getListaDeNotas(this.page);
              } else {
                this.getListaDeNotas(this.page);
              }
              Swal.fire('Listo!', 'Tu nota fue '+ this.editar?'editar':'añadir'+ '!', 'success');
              this.resetForm();
            });
          }
        }
      });
    }
  }
  resetForm(){
    this.NotasForm.reset();
    this.NotasForm.get('fecha').setValue(new Date());
  }
  verNota(_NOTA: nota) {
    Swal.fire({
      title: new Date(_NOTA.NoteDate).toDateString(),
      text: _NOTA.descripcion,
    });
  }
  pageChange(event: number) {
    this.page = event;
    this.getListaDeNotas(this.page);
  }
}
