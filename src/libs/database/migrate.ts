import * as issuerMigration from './migrations/issuerMigration';
import * as vcMigration from './migrations/vcMigration';

issuerMigration.createTable();
vcMigration.createTable();
