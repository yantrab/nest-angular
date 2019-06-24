import { Entity } from '../Entity';
import { IsNumber, IsString, ValidateNested, IsEnum, IsOptional } from 'class-validator';
import { Panel } from './panels/base.panel';

export class InitialData {
    @ValidateNested({ each: true })
    panels: Panel[];
}
