import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

@Resolver()
export class AppResolver {
	@Query(() => String)
	async hello() {
		return 'hello'
	}

	@Mutation(() => String)
	async create(@Args('input') dto: string) {
		return dto
	}
}
