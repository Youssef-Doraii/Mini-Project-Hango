import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Create a new event
  @Post()
  async create(@Body() body: any) {
    return this.eventsService.createEvent(body);
  }

  // Get all events
  @Get()
  async findAll() {
    return this.eventsService.getAllEvents();
  }

  // Update an event by ID
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.eventsService.updateEvent(Number(id), body);
  }

  // Delete an event by ID
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.eventsService.deleteEvent(Number(id));
  }

  // Get a single event by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventsService.getEventById(Number(id));
  }
}
