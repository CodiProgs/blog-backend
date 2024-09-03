import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { AuthModule } from './auth/auth.module'
import { CategoryModule } from './category/category.module'
import { CommentModule } from './comment/comment.module'
import { FileModule } from './file/file.module'
import { UPLOADS_FOLDER } from './file/file.service'
import { LikeModule } from './like/like.module'
import { PostModule } from './post/post.module'
import { UserModule } from './user/user.module'

@Module({
	imports: [
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
			sortSchema: true,
			introspection: true,
			playground: true,
			context: ({ req, res }) => ({ req, res })
		}),
		ConfigModule.forRoot(),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', UPLOADS_FOLDER)
		}),
		AuthModule,
		UserModule,
		PostModule,
		CategoryModule,
		LikeModule,
		FileModule,
		CommentModule
	]
})
export class AppModule {}
