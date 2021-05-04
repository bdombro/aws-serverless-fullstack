import 'reflect-metadata'

import {createConnection} from 'typeorm'
import {inspect} from 'util'

import UserEntity from './entity'
import { UserCreate, UserRoleEnum } from './types'

seedUsers().catch(e => {console.error(inspect(e, false, 4, true))})

async function seedUsers() {
	const connection = await createConnection()

	await Promise.all((await UserEntity.find()).map(u => UserEntity.delete(u.id)))

	console.log('Inserting new users into the database...')
	const users = await UserEntity.insertSafe(fakeUsers)
	console.log('Loaded users: ', users)

	// const user = await UserEntity.createSafe(fakeUsers[0])
	// console.dir(user)

	// const user = new UserEntity(fakeUsers[0])
	// await user.saveSafe()
	// console.dir(user)

	// const user2 = await UserEntity.findOne({where: {email: 'admin@example.com'}})
	// console.log(await user2!.comparePassword('Password2'))
	// user2!.password = 'Password3'
	// await user2!.saveSafe()
	// console.log(user2!.passwordVersion)
	// console.log(user2)
	// console.log(await user2!.comparePassword('Password9'))


	connection.close()
}

export const fakeUsers: UserCreate[] = [
	{
		email: 'admin@example.com',
		roles: [UserRoleEnum.ADMIN],
		password: 'Password8',
		// status: 4,
		givenName: 'Sally',
		surname: 'Admin',
	},
	{
		email: 'editor@example.com',
		roles: [UserRoleEnum.EDITOR],
		givenName: 'Sally',
		surname: 'Editor',
	},
	{
		email: 'author@example.com',
		roles: [UserRoleEnum.AUTHOR],
		givenName: 'Sally',
		surname: 'Author',
	}
]