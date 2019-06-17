import { Length, IsEmail, IsOptional, IsString, IsEnum, ValidateNested, IsNumberString} from 'class-validator';
import { Entity } from './Entity';
export class LeadRequest extends Entity {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    company: string;

    @IsNumberString()

    phone: string;
    @IsString()
    message:string;

}
