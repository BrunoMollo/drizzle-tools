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
