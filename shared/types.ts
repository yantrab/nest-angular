// https://stackoverflow.com/questions/54770428/how-to-exclude-getters-from-class-to-create-repository/54777512#54777512
type IfEquals<X, Y, A= X, B= never> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? A : B;
type WritableKeys<T> = {[P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>}[keyof T];
export  type EntityWithoutGetters<T> = Pick<T, WritableKeys<T>>;
