import {registerDecorator, ValidationOptions, ValidationArguments} from "class-validator";

export function EqualTo(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "EqualTo",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    return  value && relatedValue && value === relatedValue
                }
            }
        });
    };
}
