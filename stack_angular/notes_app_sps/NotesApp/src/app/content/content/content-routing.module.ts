import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './content.component';

const routes: Routes = [
  {
    path: '',
    component: ContentComponent,
    children: [
      {
        path: "",
        redirectTo: "notas",
        pathMatch: "full"
      },
      {
        path: 'notas',
        loadChildren: () =>
          import('./../../components/pages/notes/notes.module').then(
            (m) => m.NotesModule
          ),
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('../../components/pages/usuarios/usuarios.module').then(
            (m) => m.UsuariosModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentRoutingModule {}
