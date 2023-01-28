export enum SearchBy {
  NAME = "name",
  PORT = "port",
}

export interface Process {
  name: string;
  pid: number;
  ppid: number;
  port: number;
}
