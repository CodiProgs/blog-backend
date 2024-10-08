import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from 'src/common/config'
import { PrismaService } from 'src/prisma.service'
import { UserModule } from 'src/user/user.module'
import { AuthController } from './auth.controller'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'
import { OptionalJwtAuthGuard } from './guards'
import { STRATEGIES } from './strategies'

@Global()
@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig
		}),
		UserModule,
		ConfigModule
	],
	providers: [
		AuthResolver,
		AuthService,
		PrismaService,
		...STRATEGIES,
		OptionalJwtAuthGuard
	],
	controllers: [AuthController],
	exports: [AuthService]
})
export class AuthModule {}
