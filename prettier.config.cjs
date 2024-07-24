// prettier.config.js
module.exports = {
    tailwindConfig: './src/config/tailwind.config.js',
    trailingComma: 'es5',
    tabWidth: 2,
    semi: false,
    singleQuote: true,
    overrides: [
        {
            files: '**/*.hbs',
            options: {
                parser: 'angular',
            },
        },
    ],
    printWidth: 100,
    useTabs: false,
    bracketSpacing: true,
    endOfLine: 'lf',
    arrowParens: 'always',
}
