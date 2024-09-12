import { Field, ObjectType } from '@nestjs/graphql'
import { PostType } from 'src/post/type/post.type'
import { UserType } from 'src/user/type/user.type'

@ObjectType()
export class CommentType {
	@Field() id: string

	@Field() createdAt: Date

	@Field() content: string

	@Field() isDeleted: boolean

	@Field(() => UserType) author?: UserType

	@Field(() => PostType, { nullable: true }) post?: PostType

	@Field(() => CommentType, { nullable: true }) parent?: CommentType

	@Field(() => [CommentType], { nullable: true }) children?: CommentType[]
}
