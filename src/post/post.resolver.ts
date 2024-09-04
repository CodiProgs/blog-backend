import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth, CurrentUser } from 'src/auth/decorators'
import { UserType } from 'src/user/type/user.type'
import { PostDto } from './dto/post.dto'
import { PostQueryParamsDto } from './dto/query-params.dto'
import { PostService } from './post.service'
import { PostType } from './type/post.type'
import { PostResponseType } from './type/response.type'

@Resolver()
export class PostResolver {
	constructor(private postService: PostService) {}

	@Query(() => PostResponseType)
	async posts(
		@Args('queryParams') query: PostQueryParamsDto
	): Promise<PostResponseType> {
		return this.postService.getAll(query)
	}

	@Query(() => PostType, { nullable: true })
	async post(@Args('slug') slug: string) {
		return this.postService.getBySlug(slug)
	}

	@Auth()
	@Mutation(() => PostType)
	async createPost(
		@CurrentUser('id') userId: string,
		@Args('createPostInput') dto: PostDto
	) {
		return this.postService.create(userId, dto)
	}

	@Auth()
	@Mutation(() => PostType)
	async updatePost(
		@Args('id') id: string,
		@Args('updatePostInput') dto: PostDto
	) {
		return this.postService.update(id, dto)
	}

	@Auth()
	@Mutation(() => PostType)
	async deletePost(@Args('id') id: string, @CurrentUser() user: UserType) {
		return this.postService.delete(id, user)
	}

	@Auth()
	@Mutation(() => PostType)
	async incrementPostViews(@Args('id') id: string) {
		return this.postService.incrementViews(id)
	}
}
