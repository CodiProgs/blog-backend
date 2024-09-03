import { Module } from '@nestjs/common'
import { FileModule } from 'src/file/file.module'
import { PrismaService } from 'src/prisma.service'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'

@Module({
	imports: [FileModule],
	providers: [UserResolver, UserService, PrismaService],
	exports: [UserService]
})
export class UserModule {}
