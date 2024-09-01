import { OmitType } from '@nestjs/graphql'
import { RegisterDto } from './register.dto'

export class LoginSocialDto extends OmitType(RegisterDto, [
	'password'
] as const) {}
