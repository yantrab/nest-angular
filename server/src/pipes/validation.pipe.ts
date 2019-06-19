import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';
import { ClassTransformOptions } from '@nestjs/common/interfaces/external/class-transform-options.interface';
import { ValidationError, Injectable, PipeTransform, Optional, BadRequestException, ArgumentMetadata } from '@nestjs/common';
import { isNil } from 'lodash';

import { validate } from 'class-validator';
export interface ValidationPipeOptions extends ValidatorOptions {
    transform?: boolean;
    disableErrorMessages?: boolean;
    transformOptions?: ClassTransformOptions;
    exceptionFactory?: (errors: ValidationError[]) => any;
}
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    protected isTransformEnabled: boolean;
    protected isDetailedOutputDisabled?: boolean;
    protected validatorOptions: ValidatorOptions;
    protected transformOptions: ClassTransformOptions;
    protected exceptionFactory: (errors: ValidationError[]) => any;

    constructor(@Optional() options?: ValidationPipeOptions) {
        options = options || {};
        const { transform, disableErrorMessages, transformOptions, ...validatorOptions } = options;
        this.isTransformEnabled = !!transform;
        this.validatorOptions = validatorOptions;
        this.transformOptions = transformOptions;
        this.isDetailedOutputDisabled = disableErrorMessages;
        this.exceptionFactory =
            options.exceptionFactory || (errors => new BadRequestException(this.isDetailedOutputDisabled ? undefined : errors));
    }

    public async transform(value: any, metadata: ArgumentMetadata) {
        const { metatype } = metadata;
        if (!metatype || !this.toValidate(metadata)) {
            return value;
        }
        const entity = new metadata.metatype(value);
        const errors = await validate(entity, this.validatorOptions);
        if (errors.length > 0) {
            throw this.exceptionFactory(errors as any);
        }
        return entity;
    }

    private toValidate(metadata: ArgumentMetadata): boolean {
        const { metatype, type } = metadata;
        if (type === 'custom') {
            return false;
        }
        const types = [String, Boolean, Number, Array, Object];
        return !types.some(t => metatype === t) && !isNil(metatype);
    }

    toEmptyIfNil<T = any, R = any>(value: T): R | {} {
        return isNil(value) ? {} : value;
    }
}
