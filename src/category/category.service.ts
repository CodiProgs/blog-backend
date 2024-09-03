import { Injectable } from '@nestjs/common'
import { PostQueryParamsDto } from 'src/post/dto/query-params.dto'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {}

	async getAll() {
		return this.prisma.category.findMany({
			orderBy: {
				name: 'asc'
			},
			include: {
				posts: true
			}
		})
	}

	async getPaginatedCategories({
		skipCategories: skip,
		skip: skipPosts,
		take: takePosts
	}: PostQueryParamsDto) {
		const categories = (await this.getAll()).filter(
			cat => cat.posts.length >= skipPosts
		)

		if (categories.length === 0) {
			return {
				categories: [],
				queryParams: {
					skipCategories: 0,
					skip: 0
				}
			}
		}

		const categoriesSorted = categories.slice(skip, takePosts + skip)

		if (skip !== 0) {
			categoriesSorted.push(
				...categories
					.filter(cat => !categoriesSorted.includes(cat))
					.slice(0, takePosts - categoriesSorted.length)
			)
		}

		let newSkip = ((takePosts % categories.length) + skip) % categories.length

		if (newSkip === categories.length) {
			skip = 0
			newSkip = 0
		}

		return {
			categories: categoriesSorted,
			queryParams: {
				skipCategories: newSkip,
				skip: skipPosts
			}
		}
	}
}
