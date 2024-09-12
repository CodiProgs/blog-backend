import { UseGuards } from '@nestjs/common'
import { Provider } from '@prisma/client'
import { GoogleAuthGuard, JwtAuthGuard, OptionalJwtAuthGuard } from '../guards'

export const Auth = (provider: Provider | 'OPTIONAL' = 'LOCAL') => {
	switch (provider) {
		case 'LOCAL':
			return UseGuards(JwtAuthGuard)
		case 'GOOGLE':
			return UseGuards(GoogleAuthGuard)
		case 'OPTIONAL':
			return UseGuards(OptionalJwtAuthGuard)
		default:
			return UseGuards(JwtAuthGuard)
	}
}
