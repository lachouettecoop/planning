import { theme } from "@chakra-ui/core";
import WebFont from "webfontloader";

WebFont.load({
  google: {
    families: ["Cabin", "Montserrat", "Libre Barcode 128 Text"]
  }
});

// see https://github.com/lachouettecoop/styleguide
const colors = {
  primary: "#445448",

  // palette LCC
  paleyellow: "#f5eeae",
  darkyellow: "#e6c56d",
  lightbrown: "#d8b881",
  brown: "#b88c56",
  darkbrown: "#ba7c40",

  paleviolet: "#eee1e9",
  greyblue: "#d3d8d3",
  greyblue2: "#d7d8d9",
  violet: "#c0b9c0",

  palegreen: "#d7daba",
  lightgreen: "#c0d29f",
  blue: "#b6cab6",

  // from https://palx.jxnblk.com/445448
  black: "#344237",
  gray: {
    50: "#ecedeb",
    100: "#d7d9d6",
    200: "#bfc3bd",
    300: "#a3a9a1",
    400: "#7f877c",
    500: "#485444",
    600: "#404b3c",
    700: "#374134",
    800: "#2d342a",
    900: "#1e231d"
  },

  // accents from http://clrs.cc/
  navy: "#001f3f",
  // blue: "#0074D9",
  aqua: "#7FDBFF",
  teal: "#39CCCC",
  olive: "#3D9970",
  green: "#2ECC40",
  lime: "#01FF70",
  yellow: "#FFDC00",
  orange: "#FF851B",
  red: "#FF4136",
  maroon: "#85144b",
  fuchsia: "#F012BE",
  purple: "#B10DC9",
  // black: "#111111",
  // gray: "#AAAAAA",
  silver: "#DDDDDD",
  white: "#FFFFFF"
};

const fonts = {
  heading: "Montserrat, sans-serif",
  body: "Cabin, sans-serif",
  mono: `SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace`
  // barcode: "'Libre Barcode 128 Text', cursive" // duplicated in `<Barcode>`
};

export default {
  ...theme,
  colors: {
    ...theme.colors,
    ...colors
  },
  fonts: fonts
};
