import { Field, ObjectType } from '@nestjs/graphql'
import { UserType } from 'src/user/type/user.type'

@ObjectType()
export class AuthType {
	@Field(() => UserType) user: UserType

	@Field() accessToken: string
}
