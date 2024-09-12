import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { PostQueryParamsDto } from 'src/post/dto/query-params.dto'
import { PrismaService } from 'src/prisma.service'
import { CategoryDto } from './dto/category.dto'

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

	async getOne(slug: string) {
		return this.prisma.category.findUnique({
			where: {
				slug
			},
			include: {
				posts: true
			}
		})
	}

	async create(dto: CategoryDto) {
		const isSlugUnique = await this.isSlugUnique(dto.slug)

		if (!isSlugUnique) {
			throw new ConflictException({
				form: 'Category with this slug already exists'
			})
		}

		return this.prisma.category.create({
			data: dto
		})
	}

	async update(id: string, dto: CategoryDto) {
		const isSlugUnique = await this.isSlugUnique(dto.slug)

		if (!isSlugUnique) {
			throw new ConflictException({
				form: 'Category with this slug already exists'
			})
		}

		try {
			return await this.prisma.category.update({
				where: {
					id
				},
				data: dto
			})
		} catch (error) {
			if (
				error instanceof PrismaClientKnownRequestError &&
				error.code === 'P2025'
			) {
				throw new NotFoundException('Category not found')
			} else {
				throw error
			}
		}
	}

	async delete(id: string) {
		try {
			return await this.prisma.category.delete({
				where: {
					id
				}
			})
		} catch (error) {
			if (
				error instanceof PrismaClientKnownRequestError &&
				error.code === 'P2025'
			) {
				throw new NotFoundException('Category not found')
			} else {
				throw error
			}
		}
	}

	async isSlugUnique(slug: string) {
		return !(await this.getOne(slug))
	}
}
