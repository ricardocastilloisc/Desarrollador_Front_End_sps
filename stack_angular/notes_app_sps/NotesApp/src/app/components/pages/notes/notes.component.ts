import { Component, OnInit } from '@angular/core';
import { NotasService } from '../../../services/notas.service';
import { NotaPaginate } from '../../../models/Notas.paginate.interface';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import Swal from 'sweetalert2';
import { nota } from '../../../models/nota.interface';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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

  constructor(private notas: NotasService, BreakpointObserver: BreakpointObserver)
  {
    BreakpointObserver.observe(
      [
        '(max-width: 375px)',
        '(max-width: 640px)',
        '(max-width: 966px)',
        '(max-width: 1024px)',
        '(max-width: 1280px)',
        '(max-width: 1366px)',
        '(max-width: 1440px)',
        '(max-width: 1920px)'
      ]
    ).subscribe( res =>{
      this.colSize =  (8 - Object.values(res.breakpoints).filter(e=>e==true).length) ===  1? 1: 8 - Object.values(res.breakpoints).filter(e=>e==true).length;
    })
  }

  async ngOnInit(): Promise<void> {
    this.getListaDeNotas();
  }

  async getListaDeNotas(page:number=1){
    await this.notas.ListadoDeNotas(this.limitItems,page).then((data: NotaPaginate) => {
      this.Notas = data;
    });
  }


  verNota(_NOTA:nota){
    Swal.fire({
      title: new Date(_NOTA.NoteDate).toDateString() ,
      text: _NOTA.descripcion
    })
  }
  pageChange(event:number){
    this.page=event;
    this.getListaDeNotas(this.page);
  }
}
