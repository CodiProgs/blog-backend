import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { LikeResolver } from './like.resolver'
import { LikeService } from './like.service'

@Module({
	providers: [LikeService, LikeResolver, PrismaService]
})
export class LikeModule {}
