import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Provider, User } from '@prisma/client'
import { verify } from 'argon2'
import { Response } from 'express'
import { UserService } from 'src/user/user.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { LoginSocialDto } from './dto/social-login.dto'

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userService: UserService
	) {}

	EXPIRE_DAY_REFRESH_TOKEN = 7
	REFRESH_TOKEN_NAME = 'refreshToken'

	async login(dto: LoginDto) {
		const user = await this.validateUser(dto)
		const tokens = this.issueTokens(user.id)

		return { user, ...tokens }
	}

	async register(dto: RegisterDto) {
		let user: User

		try {
			user = await this.userService.create(dto)
		} catch (error) {
			if (error.code === 'P2002') {
				throw new ConflictException({ form: 'Email is already taken' })
			}
			throw error
		}

		const tokens = this.issueTokens(user.id)

		return { user, ...tokens }
	}

	async loginSocial(dto: LoginSocialDto, provider: Provider) {
		let user = await this.userService.getByEmailAndProvider(dto.email, provider)

		if (!user) {
			user = await this.userService.createSocial(dto, provider)
		}

		const tokens = this.issueTokens(user.id)

		return { user, ...tokens }
	}

	async getNewTokens(refreshToken: string) {
		let result: any
		try {
			result = await this.jwtService.verifyAsync(refreshToken)
		} catch (error) {
			throw new BadRequestException({
				auth: 'Verification failed. Log in again.'
			})
		}

		const user = await this.userService.getById(result.id)
		if (!user)
			throw new NotFoundException({
				auth: 'It seems that something went wrong. Log in again'
			})

		const tokens = this.issueTokens(user.id)

		return { ...tokens, user }
	}

	private issueTokens(userId: string) {
		const payload = { id: userId }

		const accessToken = this.jwtService.sign(payload, {
			expiresIn: '1h'
		})

		const refreshToken = this.jwtService.sign(payload, {
			expiresIn: '7d'
		})

		return { accessToken, refreshToken }
	}

	private async validateUser(dto: LoginDto) {
		const user = await this.userService.getByEmailAndProvider(dto.email)
		if (!user)
			throw new NotFoundException({ form: 'Your email is not registered yet' })

		const isValidPassword = await verify(user.password, dto.password)
		if (!isValidPassword)
			throw new BadRequestException({ form: 'Invalid password' })

		return user
	}

	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			expires: expiresIn,
			secure: true,
			sameSite: 'lax'
		})
	}

	removeRefreshTokenFromResponse(res: Response) {
		res.clearCookie(this.REFRESH_TOKEN_NAME)
	}
}
