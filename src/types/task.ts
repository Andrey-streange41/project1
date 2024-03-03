export interface ITaskQueries {
  title?: string;
  project_id?: string;
  created_at?: Date;
  status?: status;
}

export enum status {
  NEW = 'Новая',
  IN_PROGRES = 'В процессе',
  COMPLETTED = 'Завершена',
}
