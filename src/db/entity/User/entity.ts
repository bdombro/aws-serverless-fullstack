import * as crypto from 'crypto'
import * as cuid from 'cuid'
import {BaseEntity,Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn, VersionColumn} from 'typeorm'

import { assertValid, assertValidSet, deduplicate, isNullOrUndefined } from '../../../lib/validation'
import {UserCreate, UserRole, UserRoleSet, UserStatus, UserStatusSet, UserType} from './types'

@Entity()
export default class UserEntity extends BaseEntity {

	@PrimaryColumn('varchar', {length: 30})
	id: UserType['id']

	@Column('varchar', {unique: true, length: 30}) 
	email: UserType['email']

	password?: string // converts to this.passwordHash in sanitize
	@Column('varchar', {nullable: true, length: 161})
	passwordHash: UserType['passwordHash']
	@Column('timestamp')
	passwordUpdatedAt: UserType['passwordUpdatedAt']

	@Column('smallint')
	status: UserType['status']

	@Column('json')
	roles: UserRole[]

	@Column('varchar', {length: 30}) 
	givenName: UserType['givenName']

	@Column('varchar', {length: 30})
	surname: UserType['surname']

	@CreateDateColumn()
	createdAt: UserType['createdAt']
	@UpdateDateColumn()
	updatedAt: UserType['updatedAt']
	@DeleteDateColumn()
	deletedAt: UserType['deletedAt']
	@VersionColumn()
	version: UserType['version']

	// Extend constructor and save with defaults, validations and mutations
	constructor(seedObj?: UserCreate) {
		super()
		// Set defaults (note: prefer this over Typeorm.default, b/c it doesnt set until save)
		this.id = cuid()
		this.roles = [UserRole.AUTHOR]
		this.status = UserStatus.ACTIVE
		this.passwordUpdatedAt = new Date()
		if (seedObj) {
			Object.assign(this, seedObj)
		}
	}
	
	// Generic save helpers which apply sanitize
	async saveSafe() {return await this.sanitize(), this.save()}
	static async createSafe(obj: UserCreate) {const record = new this(obj);await record.sanitize();return record.save()}
	static async insertSafe(arr: UserCreate[]) {
		const sanitized = await Promise.all([...arr].map(obj => new this(obj)).map(async ent => (await ent.sanitize(),ent)))
		return this.insert(sanitized as any)
	}
	
	async sanitize() {
		if (this.password) {
			this.passwordHash = await UserEntity.hashPassword(this.password)
			this.passwordUpdatedAt = new Date()
			delete this.password
		}
		this.roles = deduplicate(this.roles)
		assertValidSet<UserType>(this, {
			id: assertValid('id', this.id, ['isRequired', 'isString', 'isNoneEmpty']),
			email: assertValid('email', this.email, ['isRequired', 'isString', 'isTruthy', 'isEmail']),
			password: !isNullOrUndefined(this.password) && assertValid('password', this.password, ['isString', 'isNoneEmpty', 'isPassword']),
			passwordHash: !isNullOrUndefined(this.passwordHash) && assertValid('passwordHash', this.passwordHash, ['isString', 'isHash']),
			passwordUpdatedAt: assertValid('passwordUpdatedAt', this.passwordUpdatedAt, ['isRequired', 'isDatable']),
			status: assertValid('status', this.status, ['isRequired', 'isNumber'], { isOneOfSet: UserStatusSet }),
			roles: assertValid('roles', this.roles, ['isRequired', 'isArray', 'isNoneEmpty'], { arrayValuesAreOneOfSet: UserRoleSet }),
			surname: assertValid('surname', this.surname, ['isRequired', 'isString'], { isLongerThan: 2, isShorterThan: 30 }),
			givenName: assertValid('givenName', this.givenName, ['isRequired', 'isString'], { isLongerThan: 2, isShorterThan: 30 }),
			createdAt: false,
			updatedAt: false,
			deletedAt: false,
			version: false,
		})
	}

	static async hashPassword(str: string, salt = crypto.randomBytes(16).toString('hex')): Promise<string> {
		return new Promise((resolve, reject) => {
			crypto.scrypt(str, salt, 64, (err, derivedKey) => {
				if (err) reject(err)
				resolve(derivedKey.toString('hex')+'.'+salt)
			})
		})
	}
	async comparePassword(password: string) {
		if (!this.passwordHash) return false
		return (
			this.passwordHash 
			&& this.passwordHash === await UserEntity.hashPassword(password, this.passwordHash.slice(-32))
		)
	}
}