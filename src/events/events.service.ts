import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../database/database.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';
import { events } from '../database/schema';
import { eq } from 'drizzle-orm';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private db: NodePgDatabase<typeof schema>
  ) {}

  // Create a new event with date conversion
  async createEvent(data: CreateEventDto) {
    try {
      // Validate recurrence consistency
      if (data.recurrencePattern && data.recurrencePattern !== 'NONE') {
        if (!data.recurrenceEndType) {
          throw new BadRequestException('recurrenceEndType is required when pattern is not NONE');
        }
      }

      const eventWithDates = {
        ...data,
        startsAt: data.startsAt ? new Date(data.startsAt) : null,
        endsAt: data.endsAt ? new Date(data.endsAt) : null,
        recurrenceEndDate: data.recurrenceEndDate ? new Date(data.recurrenceEndDate) : null,
      };

      // Ensure dates are valid after conversion
      if ((eventWithDates.startsAt && isNaN(eventWithDates.startsAt.getTime())) || 
          (eventWithDates.endsAt && isNaN(eventWithDates.endsAt.getTime()))) {
        throw new BadRequestException('Invalid date format provided');
      }

      return await this.db.insert(events).values(eventWithDates as any).returning();
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      console.error('Error creating event:', error);
      throw new BadRequestException('Could not create event. Check your data format.');
    }
  }

  // Get all events
  async getAllEvents() {
    return await this.db.select().from(events);
  }

  // Update an event by ID
  async updateEvent(id: number, data: any) {
    return await this.db
      .update(events)
      .set({
        ...data,
        // Convert dates if provided in the update payload
        startsAt: data.startsAt ? new Date(data.startsAt) : undefined,
        endsAt: data.endsAt ? new Date(data.endsAt) : undefined,
      })
      .where(eq(events.id, id))
      .returning();
  }

  // Delete an event by ID
  async deleteEvent(id: number) {
    return await this.db.delete(events).where(eq(events.id, id)).returning();
  }

  // Get a single event by ID
  async getEventById(id: number) {
    const result = await this.db.select().from(events).where(eq(events.id, id));
    return result[0];
  }
}
