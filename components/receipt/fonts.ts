// components/receipt/fonts.ts
// Font registration for @react-pdf/renderer
// Uses variable TTF fonts from Google Fonts

import { Font } from "@react-pdf/renderer";

// Plus Jakarta Sans — variable font (wght 200–800)
Font.register({
  family: "Plus Jakarta Sans",
  fonts: [
    { src: "/fonts/PlusJakartaSans.ttf", fontWeight: 400 },
    { src: "/fonts/PlusJakartaSans.ttf", fontWeight: 500 },
    { src: "/fonts/PlusJakartaSans.ttf", fontWeight: 600 },
    { src: "/fonts/PlusJakartaSans.ttf", fontWeight: 700 },
  ],
});

// Inter — variable font (opsz,wght)
Font.register({
  family: "Inter",
  fonts: [
    { src: "/fonts/Inter.ttf", fontWeight: 400 },
    { src: "/fonts/Inter.ttf", fontWeight: 500 },
  ],
});

// JetBrains Mono — variable font (wght 100–800)
Font.register({
  family: "JetBrains Mono",
  fonts: [
    { src: "/fonts/JetBrainsMono.ttf", fontWeight: 400 },
    { src: "/fonts/JetBrainsMono.ttf", fontWeight: 500 },
  ],
});
