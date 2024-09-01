import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { PrismaService } from 'src/prisma.service'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getJwtConfig } from 'src/common/config'
import { UserModule } from 'src/user/user.module'
import { AuthController } from './auth.controller'
import { STRATEGIES } from './strategies'

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
	providers: [AuthResolver, AuthService, PrismaService, ...STRATEGIES],
	controllers: [AuthController]
})
export class AuthModule {}
