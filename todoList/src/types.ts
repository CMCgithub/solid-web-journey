//每次创建，需要生成ctime，每次修改都需要修改mtime
export interface ITodo {
  id: string
  content: string;
  finished: boolean;
  ctime: number;
  mtime: number;
}
