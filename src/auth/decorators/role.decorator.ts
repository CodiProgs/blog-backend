import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard, AdminRoleGuard } from '../guards'
import { UserRole } from '@prisma/client'

export const RoleGuard = (role: UserRole = 'USER') => {
	switch (role) {
		case 'USER':
			return UseGuards(JwtAuthGuard)
		case 'ADMIN':
			return UseGuards(JwtAuthGuard, AdminRoleGuard)
		default:
			return UseGuards(JwtAuthGuard)
	}
}
