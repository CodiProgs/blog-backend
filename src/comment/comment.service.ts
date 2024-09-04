import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
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
		return this.prisma.comment.update({
			where: {
				id
			},
			data: {
				content: dto.content
			}
		})
	}

	async delete(id: string) {
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
