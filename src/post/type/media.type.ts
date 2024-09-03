import { Field, ObjectType } from '@nestjs/graphql'
import { PostType } from 'src/post/type/post.type'

@ObjectType()
export class MediaType {
	@Field() id: string

	@Field() url: string

	@Field() type: string

	@Field(() => PostType) post?: PostType
}
