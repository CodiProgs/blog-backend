import { Field, ObjectType } from '@nestjs/graphql'
import { PostType } from 'src/post/type/post.type'

@ObjectType()
export class CategoryType {
	@Field() id: string

	@Field() name: string

	@Field() slug: string

	@Field(() => PostType) posts?: PostType[]
}
