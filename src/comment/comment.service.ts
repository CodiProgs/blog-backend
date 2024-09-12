import {
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { PrismaService } from 'src/prisma.service'
import { UserType } from 'src/user/type/user.type'
import { CommentDto } from './dto/comment.dto'

@Injectable()
export class CommentService {
	constructor(private prisma: PrismaService) {}

	async create(userId: string, dto: CommentDto) {
		return this.prisma.comment.create({
			data: {
				content: dto.content,
				author: {
					connect: {
						id: userId
					}
				},
				post: {
					connect: {
						id: dto.postId
					}
				},
				parent: dto.parentId
					? {
							connect: {
								id: dto.parentId
							}
						}
					: undefined
			}
		})
	}

	async update(id: string, dto: CommentDto) {
		try {
			return await this.prisma.comment.update({
				where: {
					id
				},
				data: {
					content: dto.content
				}
			})
		} catch (error) {
			if (
				error instanceof PrismaClientKnownRequestError &&
				error.code === 'P2025'
			) {
				throw new NotFoundException('Comment not found')
			} else {
				throw error
			}
		}
	}

	async delete(id: string, user: UserType) {
		const comment = await this.prisma.comment.findUnique({
			where: {
				id
			}
		})

		if (comment.authorId !== user.id && user.role !== 'ADMIN') {
			throw new ForbiddenException('You are not the author of this comment')
		}

		if (!comment) {
			throw new NotFoundException('Comment does not exist')
		}

		return this.prisma.comment.update({
			where: {
				id
			},
			data: {
				isDeleted: true
			}
		})
	}
}
