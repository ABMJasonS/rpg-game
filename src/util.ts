export function cloneObject<T>(object: T): T {
  return Object.assign(Object.create(Object.getPrototypeOf(object)), object);
}
