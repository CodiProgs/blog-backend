import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { createId } from '@paralleldrive/cuid2'
import { Provider } from '@prisma/client'
import { hash, verify } from 'argon2'
import { RegisterDto } from 'src/auth/dto/register.dto'
import { LoginSocialDto } from 'src/auth/dto/social-login.dto'
import { FileService } from 'src/file/file.service'
import { PrismaService } from 'src/prisma.service'
import { UpdateUserPasswordDto } from './dto/update-password.dto'
import { UserDto } from './dto/user.dto'
import { UserType } from './type/user.type'

@Injectable()
export class UserService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly fileService: FileService
	) {}

	async getById(id: string) {
		return this.prisma.user.findUnique({
			where: { id }
		})
	}

	async getByNickname(nickname: string) {
		return this.prisma.user.findUnique({
			where: { nickname }
		})
	}

	async getByEmailAndProvider(email: string, provider: Provider = 'LOCAL') {
		return this.prisma.user.findUnique({
			where: { email_provider: { email, provider } }
		})
	}

	async getAll() {
		return this.prisma.user.findMany()
	}

	async create(dto: RegisterDto) {
		const nickname = await this.generateNickname(dto.name)

		return await this.prisma.user.create({
			data: {
				...dto,
				password: await hash(dto.password),
				nickname
			}
		})
	}

	async createSocial(dto: LoginSocialDto, provider: Provider) {
		const nickname = await this.generateNickname(dto.name)

		return await this.prisma.user.create({
			data: {
				...dto,
				provider,
				password: null,
				nickname
			}
		})
	}

	async update(id: string, dto: UserDto) {
		return this.prisma.user.update({
			where: { id },
			data: dto
		})
	}

	async updateAvatar(id: string, avatar: string) {
		return this.prisma.user.update({
			where: { id },
			data: { avatar }
		})
	}

	async updateNickname(id: string, nickname: string) {
		const isUnique = await this.isNicknameUnique(nickname)

		if (!isUnique) {
			throw new BadRequestException({ form: 'Nickname is already taken' })
		}

		return this.prisma.user.update({
			where: { id },
			data: { nickname }
		})
	}

	async updatePassword(id: string, dto: UpdateUserPasswordDto) {
		const user = await this.getById(id)

		if (!user) {
			throw new NotFoundException('User not found')
		}

		const isValidPassword = await verify(user.password, dto.password)
		if (!isValidPassword)
			throw new BadRequestException({ form: 'Invalid password' })

		const password = await hash(dto.newPassword)

		return this.prisma.user.update({
			where: { id },
			data: { password }
		})
	}

	async delete(id: string, user: UserType) {
		// TODO: add notification to user when deleted by admin
		if (id !== user.id && user.role !== 'ADMIN') {
			throw new ForbiddenException('You cannot delete another user')
		}

		await this.fileService.delete(user.avatar)

		return this.prisma.user.delete({
			where: { id }
		})
	}

	private async generateNickname(name: string) {
		let nickname = name
		let isUnique = false

		while (!isUnique) {
			const newNickname = `${nickname}-${createId()}`

			isUnique = await this.isNicknameUnique(newNickname)

			if (isUnique) {
				nickname = newNickname
			}
		}

		return nickname
	}

	async isNicknameUnique(nickname: string) {
		const user = await this.prisma.user.findUnique({
			where: { nickname }
		})

		return !user
	}
}
