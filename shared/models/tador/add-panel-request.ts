import { IsNumberString, IsString, NotEquals } from 'class-validator';
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsMatch(property: string, validationOptions?: ValidationOptions) {
    return function(object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsMatch',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: string, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    if (!value || !relatedValue) return true;
                    const result = value
                        .split('')
                        .map(l => (10 - +l) % 10)
                        .join();
                    return result === relatedValue;
                },
            },
        });
    };
}

export class AddPanelRequest {
    @IsNumberString() @IsString() iemi: string;

    @IsNumberString()
    @NotEquals('0', { message: 'Not initial yet!' })
    @IsMatch('iemi', { message: 'Probably you were wrong!' })
    id: string;
    get isMatch(){
        const result = this.iemi
            .split('')
            .map(l => (10 - +l) % 10)
            .join();
        return result === this.id;
    }
}
