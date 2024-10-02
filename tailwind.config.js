/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
    safelist: [
        {
            pattern: /grid-cols-.*/,
        }
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}

