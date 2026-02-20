import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [DatabaseModule, EventsModule], // DatabaseModule must be imported here
  controllers: [],
  providers: [],
})
export class AppModule {}