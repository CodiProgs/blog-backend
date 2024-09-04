import { Field, InputType } from '@nestjs/graphql'
import {
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength
} from 'class-validator'

@InputType()
export class CommentDto {
	@Field()
	@IsString()
	@IsNotEmpty()
	@MinLength(1)
	@MaxLength(255)
	content: string

	@Field()
	@IsString()
	@IsNotEmpty()
	postId: string

	@Field({ nullable: true })
	@IsOptional()
	@IsString()
	parentId?: string
}
