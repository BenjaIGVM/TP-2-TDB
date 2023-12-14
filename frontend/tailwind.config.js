/** @type {import('tailwindcss').Config} */


const colors = require('tailwindcss/colors')

module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",

        // Or if using `src` directory:
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        colors: {

            accent: "var(--primary-color)",
            primary: "var(--text-color)",
            secondary: "var(--secondary-color)",
            foreground: "var(--accent-color)",
            background: "var(--bg-color)",
            backgroundAlpha: "var(--bg-color-transparent)",
            transparent: "var(--transparent)",

            current: 'currentColor',
            black: colors.black,
            white: colors.white,
            gray: colors.gray,
            emerald: colors.emerald,
            indigo: colors.indigo,
            yellow: colors.yellow,
            red: colors.red,
            blue: colors.blue,
            green: colors.green,
            pink: colors.pink,
            purple: colors.purple,
            teal: colors.teal,
            orange: colors.orange,
            lime: colors.lime,
            rose: colors.rose,
            sky: colors.sky,
            cyan: colors.cyan,
            fuchsia: colors.fuchsia,
            violet: colors.violet,

        },
        extend: {

            // that is animation class
            animation: {
                fadeOut: 'fadeOut 0.2s ease-in-out forwards',
                fadeIn: 'fadeIn 0.2s ease-in-out forwards',
                horizontalOut: 'horizontalOut  0.2s ease-in-out forwards',
                horizontalIn: 'horizontalIn 0.2s ease-in-out forwards',
                verticalOut: 'verticalOut  0.2s ease-in-out forwards',
                verticalIn: 'verticalIn 0.2s ease-in-out forwards'

            },

            // that is actual animation
            keyframes: theme => ({
                fadeOut: {
                    '0%': { opacity: '100' },
                    '100%': { opacity: '0' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '100' },
                },
                horizontalOut: {
                    '0%': { transform: 'scale(1) translateX(0)', opacity: '100' },
                    '100%': { transform: 'scale(0.5) translateX(-80vw)', opacity: '0' }
                },
                horizontalIn: {
                    '0%': { transform: 'scale(0.5) translateX(80vw)', opacity: '0'},
                    '100%': { transform: 'scale(1) translateX(0)', opacity: '100' }
                },
                verticalOut: {
                    '0%': { transform: 'scale(1) translateY(0)', opacity: '100' },
                    '100%': { transform: 'scale(0.5) translateY(-80vw)', opacity: '0' }
                },
                verticalIn: {
                    '0%': { transform: 'scale(0.5) translateY(80vw)', opacity: '0'},
                    '100%': { transform: 'scale(1) translateY(0)', opacity: '100' }
                }
            }),

        },
    },
    plugins: [],
}