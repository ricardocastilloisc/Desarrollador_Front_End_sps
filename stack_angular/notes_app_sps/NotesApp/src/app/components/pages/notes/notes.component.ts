import { Component, OnInit } from '@angular/core';
import { NotasService } from '../../../services/notas.service';
import { NotaPaginate } from '../../../models/Notas.paginate.interface';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
})
export class NotesComponent implements OnInit {
  Notas: NotaPaginate;
  constructor(private notas: NotasService) {}

  async ngOnInit(): Promise<void> {
    await this.notas.ListadoDeNotas().then((data: NotaPaginate) => {
      this.Notas = data;
    });
  }
}
