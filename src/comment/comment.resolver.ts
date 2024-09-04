import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { Auth, CurrentUser } from 'src/auth/decorators'
import { CommentService } from './comment.service'
import { CommentDto } from './dto/comment.dto'
import { CommentType } from './type/comment.type'

@Resolver()
export class CommentResolver {
	constructor(private commentService: CommentService) {}

	@Auth()
	@Mutation(() => CommentType)
	async createComment(
		@CurrentUser('id') userId: string,
		@Args('createCommentInput') dto: CommentDto
	) {
		return this.commentService.create(userId, dto)
	}

	@Auth()
	@Mutation(() => CommentType)
	async updateComment(
		@Args('id') id: string,
		@Args('updateCommentInput') dto: CommentDto
	) {
		return this.commentService.update(id, dto)
	}

	@Auth()
	@Mutation(() => CommentType)
	async deleteComment(@Args('id') id: string) {
		return this.commentService.delete(id)
	}
}
