import { IsString, IsBoolean, ArrayMinSize, IsArray } from 'class-validator';

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
  
  pollId: number;

  @IsString()
  voter: string;

  @IsArray()
  optionIds: number[];  
}