import type {MigrationInterface, QueryRunner} from "typeorm";

export class removeRoles1620140264566 implements MigrationInterface {
    name = 'removeRoles1620140264566'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user_entity` DROP COLUMN `roles`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user_entity` ADD `roles` json NOT NULL");
    }

}
