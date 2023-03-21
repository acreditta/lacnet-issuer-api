import * as issuerMigration from './migrations/issuerMigration.js';
import * as vcMigration from './migrations/vcMigration.js';
import * as configMigration from './migrations/configMigration.js';

issuerMigration.createTable();
vcMigration.createTable();
configMigration.createTable();
