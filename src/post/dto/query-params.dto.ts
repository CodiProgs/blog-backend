import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { OrderBy, TimePeriod } from '../enum'

@InputType()
export class PostQueryParamsDto {
	@Field({ nullable: true })
	@IsOptional()
	@IsNumber()
	skipCategories?: number = 0

	@Field({ nullable: true })
	@IsOptional()
	@IsNumber()
	skip?: number = 0

	@Field({ nullable: true })
	@IsOptional()
	@IsNumber()
	take: number = 10

	@Field(() => OrderBy, { nullable: true })
	@IsOptional()
	@IsEnum(OrderBy)
	orderBy?: OrderBy = OrderBy.VIEWS

	@Field(() => TimePeriod, { nullable: true })
	@IsOptional()
	@IsEnum(TimePeriod)
	timePeriod?: TimePeriod = TimePeriod.WEEK

	@Field({ nullable: true })
	@IsOptional()
	@IsString()
	categoryId?: string
}
