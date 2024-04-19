export type InputSchema = {
  cursors: {
    up: boolean;
    down: boolean;
    right: boolean;
    left: boolean;
  };
  wasd: {
    w: boolean;
    a: boolean;
    s: boolean;
    d: boolean;
  };
};

export const KeyDown = (event: KeyboardEvent) => {};
