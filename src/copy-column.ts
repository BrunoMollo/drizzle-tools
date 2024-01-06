import { Prettify } from "./prettify";

export function copy_column<
  T extends any[],
  FROM extends keyof T[0],
  FIELD extends keyof NonNullable<T[0][FROM]>,
  TO extends Exclude<keyof T[0], FROM>,
>(obj: { from: FROM; field: FIELD; to: TO }) {
  return (resulset: T) => {
    const { from, field, to } = obj;
    return resulset.map((x) => {
      if (x[from]) {
        x[to][field] = x[from][field];
      }
      return x as {
        [KEY in keyof T[0]]: KEY extends TO
          ? Prettify<
              T[0][KEY] & { [k in FIELD]: NonNullable<T[0][FROM]>[FIELD] }
            >
          : Prettify<T[0][KEY]>;
      };
    });
  };
}
