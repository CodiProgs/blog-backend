import { Field, ObjectType } from '@nestjs/graphql'
import { PostType } from 'src/post/type/post.type'
import { UserType } from 'src/user/type/user.type'

@ObjectType()
export class CommentType {
	@Field() id: string

	@Field() createdAt: Date

	@Field() content: string

	@Field(() => UserType) author: UserType

	@Field(() => PostType) post: PostType

	@Field(() => CommentType, { nullable: true }) parent?: CommentType

	@Field(() => [CommentType]) children: CommentType[]
}
