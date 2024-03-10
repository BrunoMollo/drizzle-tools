import type { Prettify } from "./prettify";

export const drizzle_map =
  <
    T extends any[],
    MAIN extends keyof T[0],
    MANY extends keyof T[0],
    ONE extends keyof T[0],
  >(data: {
    one: MAIN;
    with_many: MANY[];
    with_one: ONE[];
  }) =>
  (resulset: T) => {
    const { one, with_many, with_one } = data;

    const indetifiers = [...new Set(resulset.map((x) => x[one]["id"]))];

    const maped = [];
    for (let id of indetifiers) {
      const row_one = resulset.map((x) => x[one]).find((x) => x["id"] === id);

      for (let table_o of with_one ?? []) {
        row_one[table_o] = resulset
          .filter((x) => x[one]["id"] === id)
          .map((x) => x[table_o])[0];
      }

      for (let table_m of with_many ?? []) {
        const seen = new Map();

        row_one[table_m] = resulset
          .filter((x) => x[one]["id"] === id)
          .map((x) => {
            return x[table_m];
          })
          .filter((x) => {
            if (!x) return false;

            if (seen.get(x["id"])) {
              return false;
            } else {
              seen.set(x["id"], true);
              return true;
            }
          });
      }

      if (row_one) {
        maped.push(row_one);
      }
    }
    return maped as Prettify<
      T[0][MAIN] & {
        [key in MANY]: Exclude<T[0][key], null>[];
      } & {
        [key in ONE]: Exclude<T[0][key], null>;
      }
    >[];
  };
