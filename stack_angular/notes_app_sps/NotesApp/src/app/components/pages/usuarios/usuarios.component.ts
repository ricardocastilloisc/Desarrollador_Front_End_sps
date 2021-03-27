import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  editar = false;
  limitItems = 8;
  page = 1;
  selected = new FormControl(0);
  UsuarioForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }


  triggerClick() {

    this.selected.setValue(1);
    this.editar = true;

  }
  chanegeTab(index:number){
    this.selected.setValue(index);
  }


  pageChange(event: number) {
    this.page = event;
  }

}
