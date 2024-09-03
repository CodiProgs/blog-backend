import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { User, UserRole } from '@prisma/client'

@Injectable()
export class AdminRoleGuard implements CanActivate {
	canActivate(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context)
		const req: { user: User } = ctx.getContext().req

		const user = req.user

		if (user.role !== UserRole.ADMIN)
			throw new ForbiddenException('You don`t have enough rights')

		return true
	}
}
