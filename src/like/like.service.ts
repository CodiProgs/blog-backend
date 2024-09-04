import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class LikeService {
	constructor(private prisma: PrismaService) {}

	async toggle(userId: string, postId: string) {
		const like = await this.prisma.like.findUnique({
			where: {
				userId_postId: {
					postId,
					userId
				}
			}
		})

		if (like) {
			await this.prisma.like.delete({
				where: {
					id: like.id
				}
			})

			return false
		} else {
			await this.prisma.like.create({
				data: {
					user: {
						connect: {
							id: userId
						}
					},
					post: {
						connect: {
							id: postId
						}
					}
				}
			})

			return true
		}
	}
}
