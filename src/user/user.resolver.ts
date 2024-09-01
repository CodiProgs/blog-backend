import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth, CurrentUser } from 'src/auth/decorators'
import { UserDto } from './dto/user.dto'
import { UserType } from './type/user.type'
import { UserService } from './user.service'

@Resolver()
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Query(() => UserType, { nullable: true })
	async profile(@Args('nickname') nickname: string) {
		return this.userService.getByNickname(nickname)
	}

	@Auth()
	@Mutation(() => UserType)
	async updateUser(
		@CurrentUser('id') id: string,
		@Args('updateUserInput') dto: UserDto
	) {
		return this.userService.update(id, dto)
	}
}
