import { Project , Scope} from "ts-morph";
import { writeFileSync, mkdirSync } from 'fs'
import * as defualtConfig from './config'
const sharedFolder = '../shared'
import {resolve} from 'path'
export const startGenerateClientApi = (config = defualtConfig) => {
    const clientPath = resolve(config.clientPath)
    const serverPath = resolve(config.serverPath)
    import(sharedFolder).then(models => {

        // Create the client folder with http service file
        mkdirSync(clientPath, { recursive: true });
        writeFileSync(clientPath + '/http.service.ts', config.httpServiceTemplate);

        const project = new Project();
        const files = project.addExistingSourceFiles(serverPath + "/**/*controller.ts");

        files.forEach(file => {
            const c = file.getClasses()[0];
            const basePath = c.getDecorator('Controller').getArguments()[0].compilerNode.getText().replace(/'/g, '')

            // Remove all class Decorators & add Indectable decorator
            c.getDecorators().forEach(d => d.remove());
            c.addDecorator({ name: 'Injectable',arguments:[] })

            // Remove class constrctors & add one with di injectable
            c.getConstructors().forEach(constructor => constructor.remove())
            c.addConstructor({ parameters: [{ isReadonly: true, type: 'APIService', name: 'api', scope: Scope.Private}] })

            // Remove all imports but 'shared'
            file.getImportDeclarations().forEach(i => {
                if (!i.getChildren().find(c => c.getFullText().includes('shared'))) i.remove()
            })

            // Add necessary imports
            file.addImportDeclaration({ namedImports: ['plainToClass'], moduleSpecifier: 'class-transformer' })
            file.addImportDeclaration({ namedImports: ['APIService'], moduleSpecifier: './http.service' })
            file.addImportDeclaration({ namedImports: ['Injectable'], moduleSpecifier: '@angular/core' })

            const methods = c.getMethods()
            methods.forEach(method => {
                let replacment;
                const retrunType = method.getReturnType();
                const returnTypeNode = method.getReturnTypeNode()
                if (!returnTypeNode) method.setReturnType(retrunType.getText())
                method.getDecorators().forEach(d => {
                    const name = d.getName()
                    if (!config.decorators[name]) return d.remove()
                    const args = d.getArguments()
                    const methodPath = args[0] ? args[0].compilerNode.getText().replace(/'/g, '') : ''
                    replacment =
                        config.decorators[name]
                            .replace('{url}', basePath + '/' + methodPath)
                            .replace('{body}', method.getParameters().filter(p => p.getDecorators().find(d => d.getName() == 'Body')).map(p => p.compilerNode.name.getText()).join(', '))
                    d.remove()
                })

                method.getParameters().forEach(p => {
                    const bodyDecorator = p.getDecorators().find(d => d.getName() == 'Body');
                    if (!bodyDecorator) return p.remove();
                    p.getDecorators().forEach(d => d.remove())
                })

                const implementation = method.getImplementation()
                const type = method.getReturnTypeNode().getText().replace('Promise<', '').replace('>', '')
                replacment = replacment.replace('{resolve}', models[type] ? `resolve(plainToClass(${type},<${type}>data))` : 'resolve(data)')
                implementation.setBodyText(replacment)
            })

            writeFileSync('client/src/api/' + file.getBaseName(), file.getText())
        })
    })
}