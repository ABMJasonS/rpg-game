export type PlayerClassSchema = {
  name: string;
  maxHealth: number;
  attackSpeed: number;
  weapons: string[];
};

export const PlayerClasses: PlayerClassSchema[] = [
  {
    name: "White bread",
    maxHealth: 100,
    attackSpeed: 1,
    weapons: ["butterknife"],
  },
];
