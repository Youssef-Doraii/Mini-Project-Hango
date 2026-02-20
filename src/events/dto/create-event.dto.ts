import { IsString, IsNotEmpty, IsEnum, IsNumberString, IsISO8601, IsOptional, IsInt, IsArray, Min } from 'class-validator';
import { visibilityStatusEnum, sourceTypeEnum, recurrencePatternEnum, recurrenceEndTypeEnum } from '../../database/schema';

// DTO for event creation
export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(visibilityStatusEnum.enumValues)
  visibilityStatus: typeof visibilityStatusEnum.enumValues[number];

  @IsEnum(sourceTypeEnum.enumValues)
  @IsOptional()
  sourceType?: typeof sourceTypeEnum.enumValues[number];

  // Recurrence Fields
  
  @IsEnum(recurrencePatternEnum.enumValues)
  @IsOptional()
  recurrencePattern?: typeof recurrencePatternEnum.enumValues[number];

  @IsEnum(recurrenceEndTypeEnum.enumValues)
  @IsOptional()
  recurrenceEndType?: typeof recurrenceEndTypeEnum.enumValues[number];

  @IsInt()
  @Min(1)
  @IsOptional()
  maxOccurrences?: number;

  @IsISO8601()
  @IsOptional()
  recurrenceEndDate?: string;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  recurrenceDaysOfWeek?: number[];

  @IsNumberString()
  @IsOptional()
  minPrice?: string;

  @IsNumberString()
  maxPrice: string;

  @IsISO8601()
  startsAt: string;

  @IsISO8601()
  endsAt: string;
}