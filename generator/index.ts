import { mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { Project, Scope, SyntaxKind } from 'ts-morph';
import * as defualtConfig from './config';
export const startGenerateClientApi = (config = defualtConfig) => {
    const clientPath = resolve(config.clientPath);
    const serverPath = resolve(config.serverPath);
    const sharedFolder = resolve(config.modelsPath);

    import(sharedFolder).then(models => {
        // Create the client folder with http service file
        mkdirSync(clientPath, { recursive: true });
        writeFileSync(clientPath + '/http.service.ts', config.httpServiceTemplate);

        const project = new Project();
        const files = project.addExistingSourceFiles(serverPath + '/**/*controller.ts');

        files.forEach(file => {
            let poly = false;
            const c = file.getClasses()[0];
            const basePath = c
                .getDecorator('Controller')
                .getArguments()[0]
                .compilerNode.getText()
                .replace(/'/g, '');
            // file.getStatements().forEach(statement => statement.remove());

            // Remove all class Decorators & add Indectable decorator
            c.getDecorators().forEach(d => d.remove());
            c.addDecorator({ name: 'Injectable', arguments: [] });

            // Remove class constrctors & add one with di injectable
            c.getConstructors().forEach(constructor => constructor.remove());
            c.addConstructor({
                parameters: [{ isReadonly: true, type: 'APIService', name: 'api', scope: Scope.Private }],
            });

            // // Remove all imports but 'shared'
            // file.getImportDeclarations().forEach(i => {
            //     if (!i.getChildren().find(child => child.getFullText().includes('shared'))) { i.remove(); }
            // });

            // Add necessary imports
            file.addImportDeclaration({ namedImports: ['APIService'], moduleSpecifier: './http.service' });
            file.addImportDeclaration({ namedImports: ['Injectable'], moduleSpecifier: '@angular/core' });

            const methods = c.getMethods();
            methods.forEach(method => {
                let replacment;
                const retrunType = method.getReturnType();
                const returnTypeNode = method.getReturnTypeNode();
                if (!returnTypeNode) {
                    method.setReturnType(retrunType.getText());
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
                        .replace(
                            '{url}',
                            basePath + (methodPath ? '/' + methodPath : '') + (param ? `' + ${param}+'` : ''),
                        )
                        .replace('{body}', body ? ', ' + body : '');
                    d.remove();
                });

                method.getParameters().forEach(p => {
                    const bodyDecorator = p
                        .getDecorators()
                        .find(d => d.getName() === 'Body' || d.getName() === 'Param');
                    if (!bodyDecorator) {
                        return p.remove();
                    }
                    p.getDecorators().forEach(d => d.remove());
                });

                const implementation = method.getImplementation();
                const type = method
                    .getReturnTypeNode()
                    .getText()
                    .replace('Promise<', '')
                    .replace('>', '');
                method.setReturnType(`Promise<${type}>`);
                const isArray = type.includes('[]');
                let resolver = 'resolve(data)';
                if (isArray) {
                    const arrayType = type.replace('[]', '');
                    if (models[arrayType]) {
                        if (models[arrayType].prototype instanceof models.Poly) {
                            poly = true;
                            resolver = `resolve(data.map(d => new models[d.kind](d)))`;
                        } else {
                            resolver = `resolve(data.map(d => new ${arrayType}(d)))`;
                        }
                    }
                } else if (models[type]) {
                    resolver = `resolve(new ${type}(data))`;
                }
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

            const out = poly ? `import * as models from 'shared';\n` : '';
            writeFileSync('client/src/api/' + file.getBaseName(), out + file.getText());
        });
    });
};

// import { startGenerateClientApi } from 'nest-client-generator';
import { startGenerateInterfaces } from 'nest-client-generator';
import * as config from './config';
startGenerateClientApi(config as any);

startGenerateInterfaces('client/src/assets/i18n/login', 'client/src/api/i18n/login.i18n.ts');
startGenerateInterfaces('client/src/assets/i18n/site', 'client/src/api/i18n/site.i18n.ts');
startGenerateInterfaces('client/src/assets/i18n/mf', 'client/src/api/i18n/mf.i18n.ts');
