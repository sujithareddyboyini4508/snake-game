export interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  url: string;
  color: string;
}

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export interface Point {
  x: number;
  y: number;
}
