export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

const arrayify =
  <
    T extends any[],
    M extends keyof T[0],
    O extends Exclude<keyof T[0], M>,
  >(obj: {
    one: O;
    one_indetifier: keyof T[0][O];
    many: M;
  }) =>
  (resulset: T) => {
    const { one, one_indetifier, many } = obj;
    const indetifiers = [
      ...new Set(resulset.map((x) => x[one][one_indetifier])),
    ];

    const maped = [];
    for (let id of indetifiers) {
      const many_array = resulset
        .filter((x) => x[one][one_indetifier] === id)
        .map((x) => x[many])
        .filter((x) => x);
      const row_one = resulset
        .map((x) => x[one])
        .find((x) => x[one_indetifier] === id);
      if (row_one) {
        maped.push({
          ...row_one,
          [`${many.toString()}`]: many_array,
        });
      }
    }
    return maped as Prettify<T[0][O] & Record<M, Exclude<T[0][M], null>[]>>;
  };

