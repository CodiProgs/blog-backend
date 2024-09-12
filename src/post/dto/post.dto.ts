import { Field, InputType } from '@nestjs/graphql'
import {
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength
} from 'class-validator'
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts'

@InputType()
export class PostDto {
	@Field()
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(100)
	title: string

	@Field()
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(5000)
	content: string

	@Field()
	@IsString()
	@IsNotEmpty()
	categoryId: string

	@Field(() => GraphQLUpload, { nullable: true })
	@IsOptional()
	media?: FileUpload
}
