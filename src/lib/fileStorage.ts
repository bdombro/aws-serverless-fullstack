/**
 * An interface for isomorphic file storage
 */
import * as AWS from 'aws-sdk'
import * as fs from 'fs'
import * as path from 'path'

import env from './env'

export default {
	async put(key: string, data: string | Buffer, contentType: string) {
		const _put = env.isProd ? s3Put : localPut
		return _put(key, data, contentType)
	},
	async get(key: string) {
		const _get = env.isProd ? s3Get : localGet
		return _get(key)
	}
}

const 
	s3 = new AWS.S3()
	,tmpDir = __dirname + '/../../fileStorage/'

async function localPut(key: string, data: any, contentType: string) {
	const 
		filePath = tmpDir + key
		,fileDir = path.dirname(filePath)
	await fs.promises.mkdir(fileDir, {recursive: true})
	await fs.promises.writeFile(filePath + '.meta', JSON.stringify({key, contentType, createdAt: new Date().toISOString()}, null, 2))
	await fs.promises.writeFile(filePath, data)
}
async function localGet(key: string): Promise<GetResult> {
	const 
		filePath = tmpDir + key
	const 
		meta = JSON.parse(await fs.promises.readFile(filePath + '.meta', 'utf-8'))
		,data = await fs.promises.readFile(filePath)
	return {
		contentType: meta.contentType,
		createdAt: new Date(meta.createdAt),
		data
	}
}

// class NotFoundError extends Error {
// 	constructor()
// }

async function s3Put(key: string, data: any, contentType: string) {
	const params = {
		Bucket: env.s3Bucket,
		Key: key,
		Body: data,
		ContentType: contentType,
	}
	await s3.putObject(params).promise()
}
async function s3Get(key: string): Promise<GetResult> {
	try {
		const params = {
			Bucket: env.s3Bucket,
			Key: key
		}
		const obj = await s3.getObject(params).promise()
		return {
			contentType: obj.ContentType as GetResult['contentType'],
			createdAt: obj.LastModified!,
			data: obj.Body as string
		}
	} catch(err) {
		// S3 403s for not-founds, so err isn't helpful.
		throw Object.assign(new Error('ENOENT: File not found'), {code: 'ENOENT'})
	}
}


interface GetResult {
	contentType: string
	createdAt: Date
	data: string | Buffer
}