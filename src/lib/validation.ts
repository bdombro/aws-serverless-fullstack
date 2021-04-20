export class NotFoundError extends Error {
	type = 'NotFound'
	note = 'The article you seek doth not exist'
	context = {
		entity: null,
		errorSet: {}
	}
	constructor() {
		super()
	}
}

export class ForbiddenError extends Error {
	type = 'ForbiddenError'
	note = 'You lack permission to this endpoint'
	context = {
		entity: null,
		errorSet: {}
	}
	constructor() {
		super()
	}
}

type ValidationErrorType<T> = Record<keyof T, any>

export class ValidationError extends Error {
	type = 'ValidationError'
	attrName: string
	note: string
	constructor(attrName: string, note: string) {
		super(note)
		this.attrName = attrName
		this.note = note
	}
}

export class RequiredError extends ValidationError {
	type = 'RequiredError'
	constructor(attrName: string) {
		super(attrName, `${attrName} is required`)
	}
}
export class TypeError extends ValidationError {
	type = 'TypeError'
	constructor(attrName: string, expectedType: string) {
		super(attrName, `${attrName} is not type ${expectedType}`)
	}
}
export class ValueError extends ValidationError {
	type = 'ValueError'
	constructor(attrName: string, note?: string) {
		super(attrName, note ?? `${attrName} value is invalid`)
	}
}

export class ValidationErrorSet<T> extends Error {
	type = 'ValidationErrorSet'
	note = 'One or more arguments are invalid'
	context: {
		entity: any,
		errorSet: Partial<ValidationErrorType<T>>,
	}
	constructor(entity: any, errorSet: Partial<ValidationErrorType<T>>) {
		super('ValidationErrorSet: One or more arguments are invalid')
		this.context = {
			entity: Object.assign({}, entity),
			errorSet: errorSet
		}
		if (this.context.entity.password) this.context.entity.password = 'REDACTED'
		if (this.context.entity.passwordCurrent) this.context.entity.passwordCurrent = 'REDACTED'
		if (this.context.entity.passwordNext) this.context.entity.passwordNext = 'REDACTED'
		if (this.context.entity.passwordNextConfirm) this.context.entity.passwordNextConfirm = 'REDACTED'
		if (this.context.entity.passwordHash) this.context.entity.passwordHash = 'REDACTED'
	}
}