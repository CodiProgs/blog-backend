import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PostQueryParamsType {
	@Field()
	skipCategories: number

	@Field()
	skip: number
}
