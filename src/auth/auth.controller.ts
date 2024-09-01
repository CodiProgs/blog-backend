import { Controller, Get, Req, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'
import { AuthService } from './auth.service'
import { Auth } from './decorators'

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private configService: ConfigService
	) {}

	@Get('google')
	@Auth('GOOGLE')
	async googleAuth() {}

	@Get('google/callback')
	@Auth('GOOGLE')
	async googleAuthRedirect(
		@Req() req,
		@Res({ passthrough: true }) res: Response
	) {
		const {
			refreshToken,
			accessToken,
			user: { nickname }
		} = await this.authService.loginSocial(req.user, 'GOOGLE')

		this.authService.addRefreshTokenToResponse(res, refreshToken)

		return res.redirect(
			`${this.configService.get('FRONTEND_URL')}/auth/google/success?accessToken=${accessToken}&nickname=${nickname}`
		)
	}
}
