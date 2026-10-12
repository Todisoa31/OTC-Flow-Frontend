import { colors } from "./src/constants/colors";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: colors.background,
        foreground: colors.foreground,
        "dark-blue": colors.darkBlue,
        "primary-blue": colors.primaryBlue,
        "secondary-blue": colors.secondaryBlue,
        red: colors.red,
        "primary-red": colors.primaryRed,
        "black-secondary": colors.blackSecondary,
        "secondary-white": colors.secondaryWhite,
        grey: colors.grey,
        "grey-transparent": colors.greyTransparent,
        "primary-orange": colors.primaryOrange,
        "primary-green": colors.primaryGreen
      },
      spacing: {
        1.1: "0.3125rem", // 5px
        3.6: "0.9375rem", // 15px
        4.5: "1.125rem", // 18px
        6.1: "1.5625rem", // 25px
        7.5: "1.875rem", // 30px
        10.5: "2.625rem", // 42px
        12.5: "3.125rem", // 50px
        15: "3.75rem", // 60px
        19: "4.375rem", // 70px
        24.5: "6.25rem" // 100px
      },
      borderRadius: {
        3: "0.1875rem", // 3px
        5: "0.3125rem", // 5px
        10: "0.625rem", // 10px
        15: "0.9375rem", // 15px
        20: "1.25rem", // 20px
        30: "1.875rem" // 30px
      },
      boxShadow: {
        "otc-1": "0 4px 15px rgba(0,0,0,0.05)"
      },
      backdropBlur: {
        20: "20px"
      },
      lineHeight: {
        4.5: "1.125rem" // 18px
      }
    }
  },
  plugins: []
} satisfies Config;
