import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
	constructor() {
		super()
	}

	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		const ctx = GqlExecutionContext.create(context)
		const req = ctx.getContext().req
		return super.canActivate(new ExecutionContextHost([req]))
	}
}
