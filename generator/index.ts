import { mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { Project, Scope, SyntaxKind } from 'ts-morph';
import * as defualtConfig from './config';
export const startGenerateClientApi = (config = defualtConfig) => {
    const clientPath = resolve(config.clientPath);
    const serverPath = resolve(config.serverPath);
    mkdirSync(clientPath, { recursive: true });
    writeFileSync(clientPath + '/http.service.ts', config.httpServiceTemplate);

    const project = new Project();
    const files = project.addExistingSourceFiles(serverPath + '/**/*controller.ts');

    files.forEach(file => {
        const c = file.getClasses()[0];
        const basePath = c
            .getDecorator('Controller')
            .getArguments()[0]
            .compilerNode.getText()
            .replace(/'/g, '');

        // Remove all class Decorators & add Indectable decorator
        c.getDecorators().forEach(d => d.remove());
        c.addDecorator({ name: 'Injectable', arguments: [] });

        // Remove class constrctors & add one with di injectable
        c.getConstructors().forEach(constructor => constructor.remove());
        c.addConstructor({
            parameters: [
                {
                    isReadonly: true,
                    type: 'APIService',
                    name: 'api',
                    scope: Scope.Private,
                },
            ],
        });

        // Add necessary imports
        file.addImportDeclaration({
            namedImports: ['APIService'],
            moduleSpecifier: './http.service',
        });
        file.addImportDeclaration({
            namedImports: ['Injectable'],
            moduleSpecifier: '@angular/core',
        });
        file.getImportStringLiterals()[0].getText();
        const methods = c.getMethods();
        methods.forEach(method => {
            let replacment = '';
            const retrunType = method.getReturnType();
            const returnTypeNode = method.getReturnTypeNode();
            let resolver = 'resolve(data)';

            if (!returnTypeNode) {
                method.setReturnType(retrunType.getText());
            } else {
                const type = method
                    .getReturnTypeNode()
                    .getText()
                    .replace('Promise<', '')
                    .replace('>', '');
                method.setReturnType(`Promise<${type}>`);

                if (type != 'any') {
                    const isArray = type.includes('[]');
                    if (isArray) {
                        const arrayType = type.replace('[]', '');
                        resolver = `resolve(data.map(d => new ${arrayType}(d)))`;
                    } else {
                        resolver = `resolve(new ${type}(data))`;
                    }
                }
            }
            method.getDecorators().forEach(d => {
                const name = d.getName();
                if (!config.decorators[name]) {
                    return d.remove();
                }
                const args = d.getArguments();
                const methodPath = args[0]
                    ? args[0].compilerNode
                          .getText()
                          .replace(/'/g, '')
                          .split(':')[0]
                    : '';
                const body = method
                    .getParameters()
                    .filter(p => p.getDecorators().find(d => d.getName() === 'Body'))
                    .map(p => p.compilerNode.name.getText())
                    .join(', ');
                const param = method
                    .getParameters()
                    .filter(p => p.getDecorators().find(d => d.getName() === 'Param'))
                    .map(p => p.compilerNode.name.getText())
                    .join(', ');

                replacment = config.decorators[name]
                    .replace('{url}', basePath + (methodPath ? '/' + methodPath : '') + (param ? `' + ${param}+'` : ''))
                    .replace('{body}', body ? ', ' + body : '');
                d.remove();
            });

            method.getParameters().forEach(p => {
                const bodyDecorator = p.getDecorators().find(d => d.getName() === 'Body' || d.getName() === 'Param');
                if (!bodyDecorator) {
                    return p.remove();
                }
                p.getDecorators().forEach(d => d.remove());
            });

            const implementation = method.getImplementation();

            replacment = replacment.replace('{resolve}', resolver);
            implementation.setBodyText(replacment);
        });
        for (const parameter of file.getDescendantsOfKind(SyntaxKind.Parameter)) {
            if (parameter.findReferencesAsNodes().length === 0) {
                parameter.remove();
            }
        }
        file.fixMissingImports()
            .organizeImports()
            .formatText();
        writeFileSync('client/src/api/' + file.getBaseName(), file.getText());
    });
};

// import { startGenerateClientApi } from 'nest-client-generator';
import { startGenerateInterfaces } from 'nest-client-generator';
import * as config from './config';
startGenerateClientApi(config as any);

startGenerateInterfaces('client/src/assets/i18n/login', 'client/src/api/i18n/login.i18n.ts');
startGenerateInterfaces('client/src/assets/i18n/site', 'client/src/api/i18n/site.i18n.ts');
startGenerateInterfaces('client/src/assets/i18n/mf', 'client/src/api/i18n/mf.i18n.ts');
