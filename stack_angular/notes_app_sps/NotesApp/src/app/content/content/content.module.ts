import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentRoutingModule } from './content-routing.module';
import { ContentComponent } from './content.component';
import { MenuComponentComponent } from '../../components/menu-component/menu-component.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ContentComponent,  MenuComponentComponent],
  imports: [
    CommonModule,
    ContentRoutingModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    LayoutModule,
  ]
})
export class ContentModule { }
