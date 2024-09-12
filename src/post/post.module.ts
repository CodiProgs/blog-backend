import { Module } from '@nestjs/common'
import { CategoryModule } from 'src/category/category.module'
import { FileModule } from 'src/file/file.module'
import { LikeModule } from 'src/like/like.module'
import { PrismaService } from 'src/prisma.service'
import { PostResolver } from './post.resolver'
import { PostService } from './post.service'

@Module({
	imports: [FileModule, CategoryModule, LikeModule],
	providers: [PostService, PostResolver, PrismaService]
})
export class PostModule {}
