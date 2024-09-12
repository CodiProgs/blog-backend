import { Field, ObjectType } from '@nestjs/graphql'
import { PostType } from 'src/post/type/post.type'
import { UserType } from 'src/user/type/user.type'

@ObjectType()
export class LikeType {
	@Field() id: string

	@Field(() => UserType, { nullable: true }) user?: UserType

	@Field(() => PostType, { nullable: true }) post?: PostType
}
