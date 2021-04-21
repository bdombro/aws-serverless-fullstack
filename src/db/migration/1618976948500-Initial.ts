import type {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1618976948500 implements MigrationInterface {
    name = 'Initial1618976948500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `user_entity` (`id` varchar(30) NOT NULL, `email` varchar(30) NOT NULL, `passwordHash` varchar(161) NULL, `passwordUpdatedAt` timestamp NOT NULL, `status` smallint NOT NULL, `roles` json NOT NULL, `givenName` varchar(30) NOT NULL, `surname` varchar(30) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `deletedAt` datetime(6) NULL, `version` int NOT NULL, UNIQUE INDEX `IDX_415c35b9b3b6fe45a3b065030f` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_415c35b9b3b6fe45a3b065030f` ON `user_entity`");
        await queryRunner.query("DROP TABLE `user_entity`");
    }

}
