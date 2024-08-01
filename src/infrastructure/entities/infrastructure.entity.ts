export interface Infrastructure {
  info: {
    name: string;
    description: string;
  };
  definition: {
    provider: {
      source: string;
      ref: any;
      role: string;
    };
    zone: {
      region: string;
      subR: string;
      code: string;
    };
  };
  refs: Array<any>;
}
