


// require('ts-node/register')

import { Umzug, SequelizeStorage } from 'umzug';
import { migrationsList } from './migrationsList';
import { sequelize } from '../sequelize-config'
import { logger } from '../logger';
import serverEventEmitter from '../../../server/utils/ServerEvents';
import { COMPLETED_DATABASE_UPDATE, ERROR_UPDATING_DATABASE, SERVER_DATABASE_UPDATE, UPDATING_DATABASE } from '../../../utils/stringKeys';
const umzug = new Umzug({
  migrations: migrationsList,
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});



// export the type helper exposed by umzug, which will have the `context` argument typed correctly
export type Migration = typeof umzug._types.migration;
export const runMigrations =
  (async () => {
    try {
      serverEventEmitter.emit(SERVER_DATABASE_UPDATE, UPDATING_DATABASE)
      await umzug.up();
      serverEventEmitter.emit(SERVER_DATABASE_UPDATE, COMPLETED_DATABASE_UPDATE)

    } catch (error) {
      serverEventEmitter.emit(SERVER_DATABASE_UPDATE, ERROR_UPDATING_DATABASE)

      logger.error({ message: error });
      throw new Error("Migration error:" + error);

    }


  });