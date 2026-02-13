import { createTheme, MantineColorsTuple } from "@mantine/core";

const laukarsTeal: MantineColorsTuple = [
  "#e6f7f5",
  "#b3e8e3",
  "#80d9d1",
  "#4dcabf",
  "#4FAAA3", // primary
  "#3d9990",
  "#2d8078",
  "#215F5A", // dark
  "#164040",
  "#0b2020",
];

const laukarsDark: MantineColorsTuple = [
  "#e8e8e8",
  "#c2c2c2",
  "#9c9c9c",
  "#757575",
  "#4f4f4f",
  "#3C3F44",
  "#222222",
  "#1a1a1a",
  "#111111",
  "#000000",
];

export const laukarsTheme = createTheme({
  primaryColor: "laukars-teal",
  colors: {
    "laukars-teal": laukarsTeal,
    "laukars-dark": laukarsDark,
  },
  fontFamily: '"Inter Tight", system-ui, sans-serif',
  headings: {
    fontFamily: '"Inter Tight", system-ui, sans-serif',
  },
  defaultRadius: "md",
});
