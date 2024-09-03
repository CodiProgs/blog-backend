import { Field, ObjectType } from '@nestjs/graphql'
import { PostType } from './post.type'
import { PostQueryParamsType } from './query-params.type'

@ObjectType()
export class PostResponseType {
	@Field(() => PostQueryParamsType) queryParams: PostQueryParamsType

	@Field(() => [PostType], { nullable: 'itemsAndList' }) posts?: PostType[]
}
