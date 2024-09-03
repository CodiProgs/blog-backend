import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common'
import { createId } from '@paralleldrive/cuid2'
import { createWriteStream } from 'fs'
import { mkdir, unlink } from 'fs/promises'
import { FileUpload } from 'graphql-upload-ts'
import { dirname, extname, join } from 'path'

const ALLOWED_FILE_TYPES = {
	image: ['image/jpeg', 'image/png'],
	video: ['video/mp4']
}

export const UPLOADS_FOLDER = 'uploads'

@Injectable()
export class FileService {
	async save(
		{ createReadStream, filename, mimetype }: FileUpload,
		folder: string,
		fileType: 'image' | 'video'
	): Promise<string> {
		if (!ALLOWED_FILE_TYPES[fileType].includes(mimetype)) {
			throw new BadRequestException(`Invalid format for ${fileType}`)
		}

		const date = new Date()
		const year = date.getFullYear().toString()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')

		const cuid = createId()

		const fileExtension = extname(filename)
		const filePath = join(folder, year, month, day, cuid + fileExtension)
		const outputPath = join(UPLOADS_FOLDER, filePath)

		try {
			await mkdir(dirname(outputPath), { recursive: true })

			return new Promise((resolve, reject) => {
				const stream = createReadStream()
				const outStream = createWriteStream(outputPath)
				stream
					.pipe(outStream)
					.on('error', reject)
					.on('finish', () => resolve(filePath))
			})
		} catch (err) {
			console.error(`Error saving file: ${outputPath}`, err)
			throw new Error(`Failed to save file: ${filename}`)
		}
	}

	async delete(filePath: string) {
		const fullPath = join(UPLOADS_FOLDER, filePath)

		try {
			await unlink(fullPath)
			return true
		} catch (err: unknown) {
			if (err instanceof Error && (err as any).code === 'ENOENT') {
				throw new NotFoundException(`File not found: ${filePath}`)
			} else {
				console.error(
					`[${new Date().toISOString()}] Error deleting file: ${fullPath}`,
					err
				)
				throw new InternalServerErrorException(
					`Error deleting file: ${err instanceof Error ? err.message : 'Unknown error'}`
				)
			}
		}
	}
}
