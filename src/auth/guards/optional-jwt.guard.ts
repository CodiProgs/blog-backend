import { ExecutionContext, Injectable } from '@nestjs/common'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from '../auth.service'

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
	constructor(private readonly authService: AuthService) {
		super()
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context)
		const req = ctx.getContext().req

		try {
			const isAuthenticated = await super.canActivate(
				new ExecutionContextHost([req])
			)

			if (isAuthenticated) {
				return true
			}
		} catch (err) {}

		const refreshToken = req.cookies['refreshToken']
		if (!refreshToken) {
			return true
		}

		try {
			const { user } = await this.authService.getNewTokens(refreshToken)

			req.user = user

			return true
		} catch (refreshError) {
			throw refreshError
		}
	}
}
