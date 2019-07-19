const tsConfig = require('./tsconfig.json');
const tsConfigPaths = require('tsconfig-paths');

const baseUrl = './src';
tsConfigPaths.register({
    baseUrl,
    paths: tsConfig.compilerOptions.paths,
});
