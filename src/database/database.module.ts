import { Module, Global } from '@nestjs/common';
import { databaseProviders } from './database.provider';

@Global() // Allows using the database connection globally without re-importing the module
@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}