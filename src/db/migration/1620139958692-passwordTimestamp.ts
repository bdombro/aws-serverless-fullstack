import type {MigrationInterface, QueryRunner} from "typeorm";

export class passwordTimestamp1620139958692 implements MigrationInterface {
    name = 'passwordTimestamp1620139958692'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user_entity` CHANGE `passwordUpdatedAt` `passwordUpdatedAt` timestamp NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user_entity` CHANGE `passwordUpdatedAt` `passwordUpdatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
    }

}
