const path = require('path')

module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'import'],
    env: {
        browser: true,
        mocha: true
    },
    extends: [
        'prettier',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended'
    ],
    parserOptions: {
        project: path.resolve(__dirname, './tsconfig.json'),
        tsconfigRootDir: __dirname,
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    rules: {
        'import/no-unresolved': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/member-delimiter-style': 'off',
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/explicit-function-return-type': [
            'warn',
            {
                allowExpressions: true,
                allowHigherOrderFunctions: true
            }
        ]
    }
}
