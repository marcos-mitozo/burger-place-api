/*
  Warnings:

  - Added the required column `quantity` to the `Ingredient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "quantity" INTEGER NOT NULL;
