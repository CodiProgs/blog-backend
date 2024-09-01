import { BadRequestException } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { AuthType } from './type/auth.type'

@Resolver()
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Mutation(() => AuthType)
	async register(
		@Args('registerInput') dto: RegisterDto,
		@Context() context: { res: Response }
	): Promise<AuthType> {
		const { refreshToken, ...res } = await this.authService.register(dto)
		this.authService.addRefreshTokenToResponse(context.res, refreshToken)

		return res
	}

	@Mutation(() => AuthType)
	async login(
		@Args('loginInput') dto: LoginDto,
		@Context() context: { res: Response }
	): Promise<AuthType> {
		const { refreshToken, ...res } = await this.authService.login(dto)
		this.authService.addRefreshTokenToResponse(context.res, refreshToken)

		return res
	}

	@Mutation(() => Boolean)
	async logout(@Context() context: { res: Response }) {
		this.authService.removeRefreshTokenFromResponse(context.res)
		return true
	}

	@Mutation(() => String)
	async getNewTokens(@Context() context: { res: Response; req: Request }) {
		const refreshToken =
			context.req.cookies[this.authService.REFRESH_TOKEN_NAME]

		if (!refreshToken)
			throw new BadRequestException({
				auth: 'You are not authenticated'
			})

		const { accessToken, refreshToken: newRefreshToken } =
			await this.authService.getNewTokens(refreshToken)
		this.authService.addRefreshTokenToResponse(context.res, newRefreshToken)

		return accessToken
	}
}
