import { UseGuards } from '@nestjs/common'
import { GoogleAuthGuard, JwtAuthGuard } from '../guards'
import { Provider } from '@prisma/client'

export const Auth = (provider: Provider = 'LOCAL') => {
	switch (provider) {
		case 'LOCAL':
			return UseGuards(JwtAuthGuard)
		case 'GOOGLE':
			return UseGuards(GoogleAuthGuard)
		default:
			return UseGuards(JwtAuthGuard)
	}
}
