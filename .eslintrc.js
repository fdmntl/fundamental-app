export const root = true;
export const plugins = ['prettier'];
export const extends = [
    'eslint:recommended',
    'plugin:prettier/recommended'
];
export const rules = {
    indent: ['error', 'tab'],
    'prettier/prettier': ['error', {
        useTabs: true,
        tabWidth: 4
    }]
};
