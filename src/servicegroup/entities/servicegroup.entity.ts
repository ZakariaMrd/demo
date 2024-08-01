
export interface Servicegroup {
        name: string;
            description: string;
            stack: string;
          def: {
            provider: {
                    source: string;
                        service: string;
                        connector: string;
                      };
                ressourceType: string;
                };
        control: {
              count: number;
                };
        refs: {
              pri: string;
                };
    }
  



