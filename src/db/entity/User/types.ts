export interface UserType {
  id: string
  email: string
	rolesJson: string
  roles: UserRoleEnum[]
  status: UserStatusEnum
  password?: string
  passwordHash: string | null
  passwordUpdatedAt: Date
  givenName: string
  surname: string

  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  version: number
}

export type UserCreateOptional = Pick<UserType, 'id' | 'roles' | 'status' | 'passwordHash' | 'passwordUpdatedAt' | 'password'>
export type UserCreateRequired = Pick<UserType, 'email' | 'givenName' | 'surname'>
export type UserCreate = UserCreateRequired & Partial<UserCreateOptional>
export type UserUpdate = Partial<UserCreate>

export enum UserRoleEnum {
  ADMIN = 0,
  EDITOR = 1,
  AUTHOR = 2,
}
export const UserRoleSet = new Set(Enum.getEnumValues(UserRoleEnum))

export enum UserStatusEnum {
  PENDING = 0,
  ACTIVE = 1,
  BANNED = 2,
}
export const UserStatusSet = new Set(Enum.getEnumValues(UserStatusEnum))