/*
  Warnings:

  - Made the column `walkTime` on table `Room` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Room" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "walkTime" INTEGER NOT NULL,
    "availableFrom" DATETIME,
    "roomType" TEXT,
    "department" TEXT,
    "features" TEXT,
    "mapLink" TEXT
);
INSERT INTO "new_Room" ("availableFrom", "department", "features", "id", "location", "mapLink", "price", "roomType", "title", "walkTime") SELECT "availableFrom", "department", "features", "id", "location", "mapLink", "price", "roomType", "title", "walkTime" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
