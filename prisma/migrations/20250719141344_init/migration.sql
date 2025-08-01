-- CreateTable
CREATE TABLE "Room" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "walkTime" INTEGER,
    "availableFrom" DATETIME,
    "roomType" TEXT,
    "department" TEXT,
    "features" TEXT NOT NULL,
    "mapLink" TEXT
);
