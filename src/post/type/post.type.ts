import { Field, ObjectType } from '@nestjs/graphql'
import { CategoryType } from 'src/category/type/category.type'
import { CommentType } from 'src/comment/type/comment.type'
import { LikeType } from 'src/like/type/like.type'
import { UserType } from 'src/user/type/user.type'
import { MediaType } from './media.type'

@ObjectType()
export class PostType {
	@Field() id: string

	@Field() createdAt: Date

	@Field() title: string

	@Field() content: string

	@Field() slug: string

	@Field() views: number

	@Field(() => UserType) author?: UserType

	@Field(() => CategoryType) category?: CategoryType

	@Field(() => MediaType, { nullable: true }) media?: MediaType

	@Field(() => [CommentType]) comments?: CommentType[]

	@Field(() => [LikeType]) likes?: LikeType[]
}
