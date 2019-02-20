import { Project } from "ts-morph";
import { writeFileSync, mkdirSync } from 'fs'
import * as config from './config'
const sharedFolder = '../shared'

export const  startGenerateClientApi = () => {
    import(sharedFolder).then(models => {

        // Create the client folder with http service file
        mkdirSync(config.clientPath, { recursive: true });
        writeFileSync(config.clientPath + '/http.service.ts', config.httpServiceTemplate);

        const project = new Project();
        const files = project.addExistingSourceFiles("./server/src/**/*controller.ts");

        files.forEach(file => {
            const c = file.getClasses()[0];
            const controllerDecorator = c.getDecorator('Controller');
            const basePath = controllerDecorator.getArguments()[0].compilerNode.getText().replace(/'/g, '')
            controllerDecorator.remove();
            file.getImportDeclarations().forEach(i => {
                if (!i.getChildren().find(c => c.getFullText().includes('shared'))) i.remove()
            })

            file.addImportDeclaration({ namedImports: ['plainToClass'], moduleSpecifier: 'class-transformer' })
            file.addImportDeclaration({ namedImports: ['get', 'post'], moduleSpecifier: './http.service' })
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
                    const methodPath = args[0] ?  args[0].compilerNode.getText().replace(/'/g, '') : ''
                    replacment =
                        config.decorators[name]
                            .replace('{url}', basePath + '/' + methodPath)
                            .replace('{body}', method.getParameters().filter(p => p.getDecorators().find(d => d.getName() == 'Body')).map(p => p.compilerNode.name.getText()).join(', '))
                    d.remove()
                })

                method.getParameters().forEach(p => {
                    const bodyDecorator = p.getDecorators().find(d => d.getName() == 'Body');
                    if (!bodyDecorator) return  p.remove();
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