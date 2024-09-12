import { Field, ObjectType } from '@nestjs/graphql'
import { CategoryType } from 'src/category/type/category.type'
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

	@Field() commentsCount: number

	@Field() likesCount: number

	@Field() isLiked: boolean

	@Field(() => UserType) author?: UserType

	@Field(() => CategoryType) category?: CategoryType

	@Field(() => MediaType, { nullable: true }) media?: MediaType
}
