import { IsString, IsBoolean, ArrayMinSize, IsArray, IsOptional, IsNumber } from 'class-validator';

export class CreatePollDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsBoolean()
  multiple: boolean;

  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  options: string[]; 
}

export class VoteDto {
  
  @IsString()
  voter: string;

  @IsArray()
  @IsNumber({}, { each: true })
  optionIds: number[];  
}