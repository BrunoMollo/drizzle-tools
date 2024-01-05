export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export const arrayify =
  <T extends any[], M extends keyof T[0], O extends keyof T[0]>(obj: {
    one: { table: O; id: keyof T[0][O] };
    manys: { table: M; id?: string }[];
  }) =>
  (resulset: T) => {
    const { one, manys } = obj;
    const indetifiers = [...new Set(resulset.map((x) => x[one.table][one.id]))];

    const maped = [];
    for (let id of indetifiers) {
      const row_one = resulset
        .map((x) => x[one.table])
        .find((x) => x[one.id] === id);

      for (let m of manys) {
        const seen = new Map();
        row_one[m.table] = resulset
          .filter((x) => x[one.table][one.id] === id)
          .map((x) => x[m.table])
          .filter((x) => {
            if (!x) return false;

            if (seen.get(x[m.id ?? "id"])) {
              return false;
            } else {
              seen.set(x[m.id ?? "id"], true);
              return true;
            }
          });
      }

      if (row_one) {
        maped.push(row_one);
      }
    }
    return maped as Prettify<
      T[0][O] & { [key in M]: Exclude<T[0][key], null>[] }
    >;
  };
