export interface nota {
  NoteDate: Date;
  autor: { _id: string; nombre: string };
  descripcion: string;
  estado: boolean;
  titulo: string;
  _id: string;
}
