import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { Auth, CurrentUser } from 'src/auth/decorators'
import { LikeService } from './like.service'

@Resolver()
export class LikeResolver {
	constructor(private likeService: LikeService) {}

	@Auth()
	@Mutation(() => Boolean)
	async toggleLike(
		@CurrentUser('id') userId: string,
		@Args('postId') postId: string
	) {
		return this.likeService.toggle(userId, postId)
	}
}
