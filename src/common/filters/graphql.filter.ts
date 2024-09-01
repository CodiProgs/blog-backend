import { HttpException, Catch } from '@nestjs/common'
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util'
import { GqlExceptionFilter } from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-errors'

/**
 * @class GraphQLErrorFilter
 * @description This class is responsible for catching HttpExceptions and converting them into ApolloErrors.
 * @implements {GqlExceptionFilter}
 */
@Catch(HttpException)
export class GraphQLErrorFilter implements GqlExceptionFilter {
	/**
	 * @method catch
	 * @description This method catches HttpExceptions and converts them into ApolloErrors.
	 * @param {HttpException} exception - The exception to be caught and converted.
	 * @throws {ApolloError} - The converted ApolloError.
	 */
	catch(exception: HttpException) {
		const response: string | object = exception.getResponse()
		const status = exception.getStatus().toString()
		if (typeof response === 'object') {
			const { message } = response as { message?: string }
			if (message) {
				throw new ApolloError(message, status)
			} else {
				throw new ApolloError(HttpErrorByCode[status].name, status, response)
			}
		}
		throw new ApolloError(response as string, status)
	}
}
