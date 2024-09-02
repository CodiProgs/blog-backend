import { Field, ObjectType } from '@nestjs/graphql'
import { CategoryType } from 'src/category/type/category.type'
import { CommentType } from 'src/comment/type/comment.type'
import { MediaType } from 'src/file/type/media.type'
import { LikeType } from 'src/like/type/like.type'
import { TagType } from 'src/tag/type/tag.type'
import { UserType } from 'src/user/type/user.type'

@ObjectType()
export class PostType {
	@Field() id: string

	@Field() createdAt: Date

	@Field() title: string

	@Field() content: string

	@Field() slug: string

	@Field(() => UserType) author: UserType

	@Field(() => CategoryType) category: CategoryType

	@Field(() => [CommentType]) comments: CommentType[]

	@Field(() => [TagType]) tags: TagType[]

	@Field(() => [LikeType]) likes: LikeType[]

	@Field(() => [MediaType]) media: MediaType[]
}
