export function clone<T extends {}>(instance: T): T {
  const copy = new (instance.constructor as new () => T)();
  Object.assign(copy, instance);
  return copy;
}
