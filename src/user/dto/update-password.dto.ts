import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

@InputType()
export class UpdateUserPasswordDto {
	@Field()
	@IsString()
	@IsNotEmpty()
	password: string

	@Field()
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(32)
	newPassword: string
}
