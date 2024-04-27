export function cloneObject<T>(object: T): T {
  return Object.assign(Object.create(Object.getPrototypeOf(object)), object);
}

export function stepUntil(step: () => void, undo: () => void, repeats: number, condition: () => boolean) {
  for (let i = 0; i < repeats; i++) {
    step();
    if (condition()) {
      undo();
      return;
    }
  }
}
