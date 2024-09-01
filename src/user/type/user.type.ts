import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserType {
	@Field() id: string

	@Field() name: string

	@Field() email: string

	@Field() nickname: string

	@Field({ nullable: true }) avatar?: string

	@Field({ nullable: true }) bio?: string

	// posts
	// comments
	// likes
}
