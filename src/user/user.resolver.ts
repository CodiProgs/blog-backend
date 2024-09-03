import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts'
import { Auth, CurrentUser } from 'src/auth/decorators'
import { FileService } from 'src/file/file.service'
import { UpdateUserPasswordDto } from './dto/update-password.dto'
import { UserDto } from './dto/user.dto'
import { UserType } from './type/user.type'
import { UserService } from './user.service'

@Resolver()
export class UserResolver {
	constructor(
		private readonly userService: UserService,
		private readonly fileService: FileService
	) {}

	@Query(() => UserType, { nullable: true })
	async profile(@Args('nickname') nickname: string) {
		return this.userService.getByNickname(nickname)
	}

	@Auth()
	@Query(() => Boolean)
	async isNicknameUnique(@Args('nickname') nickname: string) {
		return await this.userService.isNicknameUnique(nickname)
	}

	@Auth()
	@Mutation(() => UserType)
	async updateUser(
		@CurrentUser('id') id: string,
		@Args('updateUserInput') dto: UserDto
	) {
		return this.userService.update(id, dto)
	}

	@Auth()
	@Mutation(() => UserType)
	async updateAvatar(
		@CurrentUser() user: UserType,
		@Args('avatar', { type: () => GraphQLUpload }) avatar: FileUpload
	) {
		const avatarPath = await this.fileService.save(avatar, 'avatars', 'image')

		if (user.avatar !== 'avatars/default.svg') {
			await this.fileService.delete(user.avatar)
		}

		return this.userService.updateAvatar(user.id, avatarPath)
	}

	@Auth()
	@Mutation(() => UserType)
	async updateNickname(
		@CurrentUser('id') id: string,
		@Args('nickname') nickname: string
	) {
		return this.userService.updateNickname(id, nickname)
	}

	@Auth()
	@Mutation(() => UserType)
	async updatePassword(
		@CurrentUser('id') id: string,
		@Args('updateUserPasswordInput') dto: UpdateUserPasswordDto
	) {
		return this.userService.updatePassword(id, dto)
	}
}
