import { Field, InputType } from '@nestjs/graphql'
import {
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength
} from 'class-validator'

@InputType()
export class CategoryDto {
	@Field()
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(50)
	name: string

	@Field()
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(50)
	slug: string

	@Field({ nullable: true })
	@IsOptional()
	@IsString()
	@MinLength(3)
	@MaxLength(255)
	description?: string
}
