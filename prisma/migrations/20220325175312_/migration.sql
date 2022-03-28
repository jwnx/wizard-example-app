-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Portfolio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alias" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Portfolio" ("alias", "createdAt", "description", "id", "name") SELECT "alias", "createdAt", "description", "id", "name" FROM "Portfolio";
DROP TABLE "Portfolio";
ALTER TABLE "new_Portfolio" RENAME TO "Portfolio";
CREATE UNIQUE INDEX "Portfolio_alias_key" ON "Portfolio"("alias");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
