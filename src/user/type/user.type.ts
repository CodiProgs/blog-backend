import { Field, ObjectType } from '@nestjs/graphql'
import { CommentType } from 'src/comment/type/comment.type'
import { LikeType } from 'src/like/type/like.type'
import { PostType } from 'src/post/type/post.type'

@ObjectType()
export class UserType {
	@Field() id: string

	@Field() name: string

	@Field() email: string

	@Field() nickname: string

	@Field() avatar: string

	@Field({ nullable: true }) bio?: string

	@Field(() => [PostType]) posts?: PostType[]

	@Field(() => [CommentType]) comments?: CommentType[]

	@Field(() => [LikeType]) likes?: LikeType[]
}
