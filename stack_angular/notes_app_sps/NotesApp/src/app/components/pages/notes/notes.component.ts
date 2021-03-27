import { Component, OnInit } from '@angular/core';
import { NotasService } from '../../../services/notas.service';
import { NotaPaginate } from '../../../models/Notas.paginate.interface';
import { BreakpointObserver } from '@angular/cdk/layout';
import Swal from 'sweetalert2';
import { nota } from '../../../models/nota.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  constructor(
    private notas: NotasService,
    BreakpointObserver: BreakpointObserver
  ) {
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

  async ngOnInit(): Promise<void> {
    this.getListaDeNotas();

    this.NotasForm = new FormGroup({
      titulo: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      descripcion: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      fecha: new FormControl(new Date()),
      usuario: new FormControl(null),
    });
  }

  async getListaDeNotas(page: number = 1) {
    await this.notas
      .ListadoDeNotas(this.limitItems, page)
      .then((data: NotaPaginate) => {
        this.Notas = data;
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
    //this.NotasForm.reset();
    if (this.NotasForm.valid) {
      const nota: nota = {
        titulo: this.NotasForm.value.titulo,
        NoteDate: new Date(this.NotasForm.value.fecha),
        descripcion: this.NotasForm.value.descripcion,
      };

      Swal.fire({
        title: '¿Vas a añadir una nota ' + nota.titulo + ' ?',
        text:
          '¿Estas seguro de anadir nota con fecha ' +
          nota.NoteDate.toDateString() +
          ' ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
      }).then(async (result) => {
        if (result.value) {
          await this.notas.addNota(nota).then(() => {
            if (this.Notas.docs.length === this.limitItems) {
              this.page = this.page + 1;
              this.getListaDeNotas(this.page);
            } else {
              this.getListaDeNotas(this.page);
            }
            Swal.fire('Listo!', 'Tu nota fue añadida!', 'success');
            this.NotasForm.reset();
            this.NotasForm.get('fecha').setValue(new Date());
          });
        }
      });
    }
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
