import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotesRoutingModule } from './notes-routing.module';
import { NotesComponent } from './notes.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [NotesComponent],
  imports: [
    CommonModule,
    NotesRoutingModule,
    MatGridListModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule
  ]
})
export class NotesModule { }
