import { Module } from '@nestjs/common'
import { CategoryModule } from 'src/category/category.module'
import { FileModule } from 'src/file/file.module'
import { PrismaService } from 'src/prisma.service'
import { PostResolver } from './post.resolver'
import { PostService } from './post.service'

@Module({
	imports: [FileModule, CategoryModule],
	providers: [PostService, PostResolver, PrismaService]
})
export class PostModule {}
