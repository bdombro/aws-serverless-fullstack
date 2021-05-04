import type {MigrationInterface, QueryRunner} from "typeorm";

export class roleJson1620144966493 implements MigrationInterface {
    name = 'roleJson1620144966493'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user_entity` ADD `rolesJson` varchar(30) NOT NULL DEFAULT '[0]'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user_entity` DROP COLUMN `rolesJson`");
    }

}
