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
    private db: NodePgDatabase<typeof schema>,
  ) {}

  // Create a new event
  async createEvent(data: CreateEventDto) {
    try {
      if (data.recurrencePattern && data.recurrencePattern !== 'NONE' && !data.recurrenceEndType) {
        throw new BadRequestException('recurrenceEndType is required when pattern is not NONE');
      }

      const eventWithDates = {
        ...data,
        startsAt: data.startsAt ? new Date(data.startsAt) : null,
        endsAt: data.endsAt ? new Date(data.endsAt) : null,
        recurrenceEndDate: data.recurrenceEndDate ? new Date(data.recurrenceEndDate) : null,
      };

      return await this.db.insert(events).values(eventWithDates as any).returning();
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Could not create event. Check your data format.');
    }
  }

  // Get all events
  async getAllEvents() {
    return await this.db.select().from(events);
  }

  // UPDATE Event (Fixed logic)
  async updateEvent(id: number, data: any) {
    const updateData = { ...data };

    // Remove ID if present in body to prevent Primary Key update errors
    delete updateData.id;

    // Handle date conversions for the update payload
    if (updateData.startsAt) updateData.startsAt = new Date(updateData.startsAt);
    if (updateData.endsAt) updateData.endsAt = new Date(updateData.endsAt);
    if (updateData.recurrenceEndDate) updateData.recurrenceEndDate = new Date(updateData.recurrenceEndDate);

    const result = await this.db
      .update(events)
      .set(updateData)
      .where(eq(events.id, id))
      .returning();

    // If result is empty, it means the ID doesn't exist
    if (result.length === 0) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return result;
  }

  // Delete an event
  async deleteEvent(id: number) {
    const result = await this.db.delete(events).where(eq(events.id, id)).returning();
    if (result.length === 0) throw new NotFoundException(`Event with ID ${id} not found`);
    return result;
  }

  // Get single event
  async getEventById(id: number) {
    const result = await this.db.select().from(events).where(eq(events.id, id));
    if (!result[0]) throw new NotFoundException(`Event with ID ${id} not found`);
    return result[0];
  }
}