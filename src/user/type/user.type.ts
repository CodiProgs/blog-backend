import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { UserRole } from '@prisma/client'
import { CommentType } from 'src/comment/type/comment.type'
import { LikeType } from 'src/like/type/like.type'
import { PostType } from 'src/post/type/post.type'

@ObjectType()
export class UserType {
	@Field() id: string

	@Field() name: string

	@Field() email: string

	@Field() nickname: string

	@Field() avatar: string

	@Field() createdAt: Date

	@Field({ nullable: true }) bio?: string

	@Field(() => UserRole, { nullable: true }) role: UserRole

	@Field(() => [PostType], { nullable: true }) posts?: PostType[]

	@Field(() => [CommentType], { nullable: true }) comments?: CommentType[]

	@Field(() => [LikeType], { nullable: true }) likes?: LikeType[]
}

registerEnumType(UserRole, {
	name: 'UserRole',
	description: 'User role'
})
