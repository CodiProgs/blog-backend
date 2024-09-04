import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CommentResolver } from './comment.resolver'
import { CommentService } from './comment.service'

@Module({
	providers: [CommentService, CommentResolver, PrismaService]
})
export class CommentModule {}
