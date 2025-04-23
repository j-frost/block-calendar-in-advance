import eslint from '@eslint/js';
import jsdoc from 'eslint-plugin-jsdoc';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    jsdoc.configs['flat/recommended'],
    {
        plugins: {
            jsdoc,
        },
        rules: {
            'jsdoc/require-jsdoc': ['error', { publicOnly: true }],
            'jsdoc/check-tag-names': ['error', { definedTags: ['customfunction'] }],
            'jsdoc/tag-lines': ['warn', 'any', { startLines: 1 }],
        },
    },
    eslintPluginPrettierRecommended,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        rules: { 'prefer-arrow-callback': 'error' },
    },
    {
        files: ['**/*.?(?)js'],
        extends: [tseslint.configs.disableTypeChecked],
    }
);
