/*
  Warnings:

  - Added the required column `quantity` to the `IngredientsOnMeals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IngredientsOnMeals" ADD COLUMN     "quantity" INTEGER NOT NULL;
