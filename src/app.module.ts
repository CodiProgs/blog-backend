import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import { AppResolver } from './app.resolver'

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
		ConfigModule.forRoot()
	],
	providers: [AppResolver]
})
export class AppModule {}
