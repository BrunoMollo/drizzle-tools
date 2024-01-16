export function pick_columns<T extends Object, C extends keyof T>(
  table: T,
  columns: (C | { col: C; as: string })[],
) {
  const map = new Map();
  for (let c of columns) {
    if (c instanceof Object) {
      map.set(c.as, table[c.col]);
    } else {
      map.set(c, table[c]);
    }
  }
  return Object.fromEntries(map) as { [k in C]: T[k] };
}

export function pick_merge<R>(map: Map<any, any> = new Map()) {
  return {
    build: () => {
      return Object.fromEntries(map) as R;
    },

    table: <T extends Object, C extends keyof T>(table: T, ...columns: C[]) => {
      for (let c of columns) {
        map.set(c, table[c]);
      }
      return pick_merge<R & { [k in C]: T[k] }>(map);
    },

    aliased: <T extends Object, C extends keyof T, A extends string>(
      table: T,
      col: C,
      as: A,
    ) => {
      map.set(as, table[col]);
      return pick_merge<R & { [k in A]: T[C] }>(map);
    },
  };
}
