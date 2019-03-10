import { BadRequestException } from '@nestjs/common';
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { validate, IsArray, IsBoolean, IsDate, IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Project, ClassDeclaration, TypeGuards } from 'ts-morph';
import { resolve } from 'path';
import { ModuleKind } from 'typescript';
const typeDecoratorMap = {
    boolean: { name: 'IsBoolean', arguments: [] },
    number: { name: 'IsNumber', arguments: [] },
    string: { name: 'IsString', arguments: [] },
    Date: { name: 'IsDate', arguments: [] },
    booleanArr: { name: 'IsBoolean', arguments: [{ each: true }] },
    numberArr: { name: 'IsNumber', arguments: [{}, { each: true }] },
    stringArr: { name: 'IsString', arguments: [{ each: true }] },
    DateArr: { name: 'IsDate', arguments: [{ each: true }] },
};

const importNames = ['IsArray', 'IsBoolean', 'IsDate', 'IsString', 'IsNumber', 'ValidateNested'];
const outPath = resolve('../shared/dist');
const indexParh = resolve('src/shared.ts');

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    metaTypes;
    constructor() {
        const project = new Project({ compilerOptions: { outDir: outPath } });
        const indexSourceFile = project.addExistingSourceFile(indexParh);
        const exportedClasses = indexSourceFile.getExportedDeclarations().filter(TypeGuards.isClassDeclaration);

        for (const classDec of exportedClasses) {
            const classSourceFile = classDec.getSourceFile();
            const classValidatorImport = classSourceFile.getImportDeclaration(c => c.getModuleSpecifier().getText() === 'class-validator');
            const existImports = classValidatorImport ? classValidatorImport.getNamedImports().map(d => d.getName()) : [];
            const toImports = importNames.filter(name => !existImports.includes(name));
            if (!!toImports.length) {
                classSourceFile.addImportDeclaration({
                    namedImports: toImports,
                    moduleSpecifier: 'class-validator',
                });
            }

            classDec.getProperties().forEach(prop => {
                const type = prop.getType().getText();
                const decorator = typeDecoratorMap[type.replace('[]', 'Arr')];
                const isOptional = prop.hasQuestionToken();
                if (decorator) {
                    prop.addDecorator(decorator);
                } else {
                    const isEnum = prop.getType().isEnum();
                    prop.addDecorator({ name: 'ValidateNested' });
                }
                if (isOptional) {
                    prop.addDecorator({ name: 'IsOptional', arguments: [] });
                }
            });
        }

        const modelsFile = project.emit();
        // .getFiles().map(f => f.text).join('/n');
        import(outPath + '/shared').then(models => {
            this.metaTypes = models;
        });
    }

    requireFromString(src) {
        const Module = module.constructor;
        const m = Module();
        m._compile(src);
        return m.exports;
    }
    async transform(value, metadata: ArgumentMetadata) {
        const metatype = this.metaTypes[metadata.metatype.name];
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object, { forbidUnknownValues: true });
        if (errors.length > 0) {
            throw new BadRequestException('Validation failed');
        }
        return value;
    }

    private toValidate(metatype): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find(type => metatype === type);
    }
}
