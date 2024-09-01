import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { User } from '@prisma/client'

export const CurrentUser = createParamDecorator(
	(key: keyof User, ctx: ExecutionContext): User | Partial<User> => {
		const gqlCtx = ctx.getArgByIndex(2)
		const req: Request = gqlCtx.req
		return key ? req['user'][key] : req['user']
	}
)
