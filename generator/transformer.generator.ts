import { Project, Scope, ClassDeclaration } from 'ts-morph';
import { writeFileSync, mkdirSync } from 'fs';
import * as defualtConfig from './config';
import { resolve } from 'path';


export const startGenerateModelsTransform = (config = defualtConfig) => {
    const clientPath = resolve(config.clientPath);
    const modelsPath = resolve(config.modelsPath);
    const trasormers: string[] = [];
    const project = new Project();
    const models: ClassDeclaration[] = new Project()
        .addExistingSourceFiles(modelsPath + '/**/*.ts')
        .reduce((names, file) => names.concat(file.getClasses()), []);
    const getModelTransformer = (model: ClassDeclaration) => {
        const name = model.getName();
        let result = 'export const tranform' + name + ' = (json) => {\n';
        result += 'const result = Object.assign(new models[name](), json);\n';
        model.getProperties().forEach(property => {
            const type = property.getType();
            if (models.find(m => m.getName() === type.getText())) {
                
            };
            return result + '\n}\n';

        };
        models.filter(m => !m.isAbstract).forEach(model => {
            const f = getModelTransformer(model);
        });
    };
