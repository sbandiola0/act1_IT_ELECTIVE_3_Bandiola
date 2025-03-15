/*
  Warnings:

  - You are about to drop the `_accountmodules` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_accountmodules` DROP FOREIGN KEY `_AccountModules_A_fkey`;

-- DropForeignKey
ALTER TABLE `_accountmodules` DROP FOREIGN KEY `_AccountModules_B_fkey`;

-- DropTable
DROP TABLE `_accountmodules`;

-- AddForeignKey
ALTER TABLE `Module` ADD CONSTRAINT `Module_accountCode_fkey` FOREIGN KEY (`accountCode`) REFERENCES `Account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
