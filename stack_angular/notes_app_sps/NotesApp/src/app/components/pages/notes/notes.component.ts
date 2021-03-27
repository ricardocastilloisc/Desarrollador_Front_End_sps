import { Component, OnInit } from '@angular/core';
import { NotasService } from '../../../services/notas.service';
import { NotaPaginate } from '../../../models/Notas.paginate.interface';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import Swal from 'sweetalert2';
import { nota } from '../../../models/nota.interface';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
})
export class NotesComponent implements OnInit {
  Notas: NotaPaginate | any = [];
  colSize = 4;


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
    await this.notas.ListadoDeNotas().then((data: NotaPaginate) => {
      this.Notas = data;
    });
  }


  verNota(_NOTA:nota){
    Swal.fire({
      title: new Date(_NOTA.NoteDate).toDateString() ,
      text: _NOTA.descripcion
    })
  }
}
