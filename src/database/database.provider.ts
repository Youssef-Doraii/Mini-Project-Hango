import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: () => {
      const pool = new Pool({
        // Using confirmed local database URL
        connectionString: 'postgresql://postgres:root@127.0.0.1:5432/hango_local?sslmode=disable',
      });
      return drizzle(pool, { schema });
    },
  },
];