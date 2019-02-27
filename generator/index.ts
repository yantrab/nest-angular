import { startGenerateClientApi } from 'nest-client-generator'
import { startGenerateInterfaces } from 'nest-client-generator'

// import { Project, ClassDeclaration, ts } from 'ts-morph'
// import { resolve } from 'path';
// const modelsPath = resolve('./shared')
// const classes: { [key: string]: ClassDeclaration } = {};
// const files = new Project()
//     .addExistingSourceFiles(modelsPath + "/**/*.ts");
// files.forEach(file => file.getClasses().forEach(c => classes[c.getName()] = c))
// const c = classes['LoginRequest'];
// const props = c.getProperties().filter(p => !p.isReadonly)

// const json = JSON.stringify({ a: 1, b: 2 }).replace(/\"([^(\")"]+)\":/g,"$1:").replace(/:/g,'=');
// const o = new Project().createSourceFile("MyFile.ts", `class t ${json}`).getClass("t");
// const oProp = o.getProperties()

// props.forEach(console.log);








startGenerateClientApi()
startGenerateInterfaces('client/src/assets/i18n/login', 'client/src/api/i18n/login.i18n.ts')
