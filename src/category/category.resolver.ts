import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth, RoleGuard } from 'src/auth/decorators'
import { CategoryService } from './category.service'
import { CategoryDto } from './dto/category.dto'
import { CategoryType } from './type/category.type'

@Resolver()
export class CategoryResolver {
	constructor(private categoryService: CategoryService) {}

	@Query(() => [CategoryType])
	async categories() {
		return this.categoryService.getAll()
	}

	@Auth()
	@RoleGuard('ADMIN')
	@Query(() => Boolean)
	async isSlugUniqueCategory(@Args('slug') slug: string) {
		return this.categoryService.isSlugUnique(slug)
	}

	@Auth()
	@RoleGuard('ADMIN')
	@Mutation(() => CategoryType)
	async createCategory(@Args('createCategoryInput') dto: CategoryDto) {
		return this.categoryService.create(dto)
	}

	@Auth()
	@RoleGuard('ADMIN')
	@Mutation(() => CategoryType)
	async updateCategory(
		@Args('id') id: string,
		@Args('updateCategoryInput') dto: CategoryDto
	) {
		return this.categoryService.update(id, dto)
	}

	@Auth()
	@RoleGuard('ADMIN')
	@Mutation(() => CategoryType)
	async deleteCategory(@Args('id') id: string) {
		return this.categoryService.delete(id)
	}
}
