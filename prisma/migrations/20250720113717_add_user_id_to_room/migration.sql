/*
  Warnings:

  - Added the required column `userId` to the `Room` table without a default value. This is not possible if the table is not empty.

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
    "mapLink" TEXT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Room_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Room" ("availableFrom", "department", "features", "id", "location", "mapLink", "price", "roomType", "title", "walkTime") SELECT "availableFrom", "department", "features", "id", "location", "mapLink", "price", "roomType", "title", "walkTime" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
