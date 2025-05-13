import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import typescriptParser from '@typescript-eslint/parser';

export default tseslint.config(
    { ignores: ['dist'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            parser: typescriptParser,
        },
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            'prettier/prettier': [
                'error',
                {
                    singleQuote: true,
                    trailingComma: 'all',
                    endOfLine: 'lf',
                    tabWidth: 4,
                },
            ],
            '@typescript-eslint/no-empty-object-type': ['off'],
        },
    },
);
