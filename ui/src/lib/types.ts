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

export interface ResourceStat {
  raw: number;
  percent: number;
}

export interface SystemResources {
  cpu: {
    physical_cores: number;
    logical_cores: number;
    total_usage: number;
  };
  memory: {
    total: ResourceStat;
    available: ResourceStat;
    used: ResourceStat;
  };
}
