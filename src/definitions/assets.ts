type ImageTypes = "png" | "svg" | "jpg" | "jpeg";

type SoundTypes = "wav" | "mp3";

export type AssetSchema<T> = {
  weapons: Record<string, T>;
  enemies: Record<string, T>;
  misc: Record<string, T>;
};

export const GameAssets: { images: AssetSchema<ImageTypes>; sounds: AssetSchema<SoundTypes> } = {
  images: {
    weapons: {
      butterknife: "png",
      m1_garand: "png",
      jam_gun: "png",
      jam_projectile: "png",
    },
    enemies: {
      toast: "png",
      toaster: "png",
      toasterhit: "png",
    },
    misc: {
      bread: "png",
      "death-particle": "png",
      tiles: "png",
    },
  },
  sounds: {
    weapons: {
      whoosh: "mp3",
      machine_gun: "wav",
    },
    enemies: {
      ondeath: "wav",
      toasterhit: "mp3",
      toasthit: "mp3",
    },
    misc: {
      bgnoise: "mp3",
      cameraclick1: "wav",
      cameraclick2: "wav",
      metal_pipe: "wav",
      sel: "mp3",
    },
  },
};
