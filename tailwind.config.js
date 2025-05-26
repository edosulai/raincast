const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

module.exports = {
    mode: 'jit',
    future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
    },
    content: [
        './resources/templates/*.html',
        './resources/templates/**/*.html',
        './resources/js/*.js',
        './proyeksi/forms.py'
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Nunito', ...defaultTheme.fontFamily.sans],
            },
            colors:{
                dark: {
                    'white': '#cdd9e5',
                    50: '#cdd9e5',
                    100: '#adbac7',
                    200: '#909dab',
                    300: '#768390',
                    400: '#636e7b',
                    500: '#545d68',
                    600: '#444c56',
                    700: '#373e47',
                    800: '#2d333b',
                    900: '#22272e',
                    'black': '#1c2128',
                },
                light: {
                    'white': '#ffffff',
                    50: '#f6f8fa',
                    100: '#eaeef2',
                    200: '#d0d7de',
                    300: '#afb8c1',
                    400: '#8c959f',
                    500: '#6e7781',
                    600: '#57606a',
                    700: '#424a53',
                    800: '#32383f',
                    900: '#24292f',
                    'black': '#1b1f24',
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        plugin(function ({ addUtilities }) {
            addUtilities({
                '.text-shadow': {
                    'text-shadow': '0 2px 5px rgba(0, 0, 0, 0.5)'
                }
            }, ['responsive', 'hover'])
        }),
    ],
    darkMode: 'class',
}