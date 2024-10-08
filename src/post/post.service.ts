import {
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { createId } from '@paralleldrive/cuid2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { subDays } from 'date-fns'
import { CategoryService } from 'src/category/category.service'
import { FileService } from 'src/file/file.service'
import { LikeService } from 'src/like/like.service'
import { PrismaService } from 'src/prisma.service'
import { UserType } from 'src/user/type/user.type'
import { PostDto } from './dto/post.dto'
import { PostQueryParamsDto } from './dto/query-params.dto'
import { OrderBy, TimePeriod } from './enum'
import { MediaType } from './type/media.type'
import { PostType } from './type/post.type'
import { PostResponseType } from './type/response.type'

export const TIME_PERIODS_IN_DAYS = {
	day: 1,
	week: 7,
	month: 30,
	year: 365
}

@Injectable()
export class PostService {
	constructor(
		private prisma: PrismaService,
		private categoryService: CategoryService,
		private fileService: FileService,
		private likeService: LikeService
	) {}

	async getAll(
		{
			skipCategories,
			skip,
			take,
			orderBy,
			timePeriod,
			categoryId
		}: PostQueryParamsDto,
		currentUserId?: string
	): Promise<PostResponseType> {
		if (categoryId) {
			const posts = await this.prisma.post.findMany({
				where: {
					categoryId,
					createdAt: {
						gte:
							timePeriod === TimePeriod.ALL
								? undefined
								: subDays(new Date(), TIME_PERIODS_IN_DAYS[timePeriod])
					}
				},
				orderBy: {
					views: orderBy === OrderBy.VIEWS ? 'desc' : undefined,
					createdAt: orderBy === OrderBy.News ? 'asc' : undefined,
					likes: orderBy === OrderBy.LIKES ? { _count: 'desc' } : undefined
				},
				skip,
				take,
				include: {
					category: true,
					author: true,
					media: true,
					_count: { select: { comments: true, likes: true } }
				}
			})

			const transformedPosts = await Promise.all(
				posts.map(async post => {
					const isLiked = currentUserId
						? await this.likeService.isLiked(currentUserId, post.id)
						: false

					return {
						...post,
						commentsCount: post._count.comments,
						likesCount: post._count.likes,
						isLiked
					}
				})
			)

			return {
				posts: transformedPosts,
				queryParams: {
					skipCategories,
					skip: skip + take
				}
			}
		}

		const { categories, queryParams } =
			await this.categoryService.getPaginatedCategories({
				skipCategories,
				skip,
				take
			})

		const posts: PostType[] = []

		if (categories.length === 0)
			return {
				posts,
				queryParams
			}

		let index = 0
		let totalAttempts = 0

		while (posts.length < take) {
			const post = await this.prisma.post.findFirst({
				where: {
					categoryId: categories[index].id,
					createdAt: {
						gte:
							timePeriod === TimePeriod.ALL
								? undefined
								: subDays(new Date(), TIME_PERIODS_IN_DAYS[timePeriod])
					}
				},
				include: {
					category: true,
					author: true,
					media: true,
					_count: { select: { comments: true, likes: true } }
				},
				skip: queryParams.skip,
				orderBy: {
					views: orderBy === OrderBy.VIEWS ? 'desc' : undefined,
					createdAt: orderBy === OrderBy.News ? 'asc' : undefined,
					likes: orderBy === OrderBy.LIKES ? { _count: 'desc' } : undefined
				}
			})

			const isLiked = currentUserId
				? await this.likeService.isLiked(currentUserId, post.id)
				: false

			if (post) {
				posts.push({
					...post,
					commentsCount: post._count.comments,
					likesCount: post._count.likes,
					isLiked
				})
				totalAttempts = 0
			} else totalAttempts++

			if (totalAttempts >= categories.length) break

			index++
			if (index === categories.length - skipCategories) {
				queryParams.skip++
			}
			if (index === categories.length) {
				index = 0
			}
		}

		return {
			posts,
			queryParams
		}
	}

	async getBySlug(
		slug: string,
		currentUserId?: string
	): Promise<PostType | null> {
		const post = await this.prisma.post.findUnique({
			where: {
				slug
			},
			include: {
				category: true,
				author: true,
				media: true,
				_count: { select: { comments: true, likes: true } }
			}
		})

		if (!post) return null

		const isLiked = currentUserId
			? await this.likeService.isLiked(currentUserId, post.id)
			: false

		return {
			...post,
			commentsCount: post._count.comments,
			likesCount: post._count.likes,
			isLiked
		}
	}

	async create(userId: string, dto: PostDto): Promise<PostType> {
		const { categoryId, media, ...data } = dto

		const mediaFile = await media
		let savedMedia: MediaType | undefined = undefined

		if (mediaFile) {
			const mediaPath = await this.fileService
				.save(mediaFile, 'media', ['image', 'video'])
				.catch(err => {
					throw new ForbiddenException({ form: err.message })
				})

			const type = this.fileService.getFileTypeByMimeType(mediaFile.mimetype)

			savedMedia = await this.prisma.media.create({
				data: {
					type,
					url: mediaPath
				}
			})
		}

		let uniqueSlug =
			data.title.toLowerCase().replace(/ /g, '-') + '-' + createId()
		let slugExists = await this.getBySlug(uniqueSlug)

		while (slugExists) {
			uniqueSlug =
				data.title.toLowerCase().replace(/ /g, '-') + '-' + createId()
			slugExists = await this.getBySlug(uniqueSlug)
		}

		const post = await this.prisma.post.create({
			data: {
				...data,
				slug: uniqueSlug,
				author: {
					connect: {
						id: userId
					}
				},
				media: savedMedia
					? {
							connect: {
								id: savedMedia.id
							}
						}
					: undefined,
				category: {
					connect: {
						id: categoryId
					}
				}
			},
			include: {
				category: true,
				author: true,
				media: true,
				_count: { select: { comments: true, likes: true } }
			}
		})

		const isLiked = userId
			? await this.likeService.isLiked(userId, post.id)
			: false

		return {
			...post,
			commentsCount: post._count.comments,
			likesCount: post._count.likes,
			isLiked
		}
	}

	async update(id: string, dto: PostDto) {
		const { categoryId, media, ...data } = dto

		const post = await this.prisma.post.findUnique({
			where: {
				id
			},
			include: {
				media: true
			}
		})

		if (!post) throw new NotFoundException('Post not found')

		const mediaFile = await media
		let savedMedia: MediaType | undefined = undefined

		if (post.media && !mediaFile) {
			await this.fileService.delete(post.media.url)
			await this.prisma.media.delete({
				where: {
					id: post.media.id
				}
			})
		}

		if (mediaFile) {
			if (post.media) {
				await this.fileService.delete(post.media.url)
				await this.prisma.media.delete({
					where: {
						id: post.media.id
					}
				})
			}

			const mediaPath = await this.fileService.save(mediaFile, 'media', [
				'image',
				'video'
			])

			const type = this.fileService.getFileTypeByMimeType(mediaFile.mimetype)

			savedMedia = await this.prisma.media.create({
				data: {
					type,
					url: mediaPath,
					post: {
						connect: {
							id
						}
					}
				}
			})
		}

		return this.prisma.post.update({
			where: {
				id
			},
			data: {
				...data,
				media: savedMedia
					? {
							connect: {
								id: savedMedia.id
							}
						}
					: undefined,
				category: {
					connect: {
						id: categoryId
					}
				}
			},
			include: {
				category: true,
				media: true
			}
		})
	}

	async delete(id: string, user: UserType) {
		const post = await this.prisma.post.findUnique({
			where: {
				id
			},
			include: {
				media: true
			}
		})

		if (!post) throw new NotFoundException('Post not found')

		// TODO: add notification to user when deleted by admin
		if (post.authorId !== user.id && user.role !== 'ADMIN')
			throw new ForbiddenException('You are not the author of this post')

		if (post.media) {
			await this.fileService.delete(post.media.url)
			await this.prisma.media.delete({
				where: {
					id: post.media.id
				}
			})
		}

		await this.prisma.post.delete({
			where: {
				id
			}
		})

		return post
	}

	async incrementViews(id: string) {
		try {
			return await this.prisma.post.update({
				where: {
					id
				},
				data: {
					views: {
						increment: 1
					}
				}
			})
		} catch (error) {
			if (
				error instanceof PrismaClientKnownRequestError &&
				error.code === 'P2025'
			) {
				throw new NotFoundException('Post not found')
			} else {
				throw error
			}
		}
	}
}
