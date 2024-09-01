import { Injectable } from '@nestjs/common'
import { createId } from '@paralleldrive/cuid2'
import { Provider } from '@prisma/client'
import { hash } from 'argon2'
import { RegisterDto } from 'src/auth/dto/register.dto'
import { LoginSocialDto } from 'src/auth/dto/social-login.dto'
import { PrismaService } from 'src/prisma.service'
import { UserDto } from './dto/user.dto'

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

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

	// update avatar
	// update nickname with the help of generateNickname
	// update password

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

	private async isNicknameUnique(nickname: string) {
		const user = await this.prisma.user.findUnique({
			where: { nickname }
		})

		return !user
	}
}
