export default {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
        "argsIgnorePattern": "^_", // ignore unused args if they start with lodash
    }
}
