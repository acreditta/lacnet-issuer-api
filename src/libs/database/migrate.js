import * as issuerMigration from './migrations/issuerMigration.js';
import * as vcMigration from './migrations/vcMigration.js';

issuerMigration.createTable();
vcMigration.createTable();
