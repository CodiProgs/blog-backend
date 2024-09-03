import { registerEnumType } from '@nestjs/graphql'

export enum TimePeriod {
	DAY = 'day',
	WEEK = 'week',
	MONTH = 'month',
	YEAR = 'year',
	ALL = 'all'
}

export enum OrderBy {
	News = 'news',
	LIKES = 'likes',
	VIEWS = 'views'
}

registerEnumType(TimePeriod, {
	name: 'TimePeriod',
	description: 'Time period for filtering'
})

registerEnumType(OrderBy, {
	name: 'OrderBy',
	description: 'Sorting criteria'
})
