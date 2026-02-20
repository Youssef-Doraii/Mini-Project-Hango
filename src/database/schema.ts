import { 
  pgTable, 
  serial, 
  text, 
  varchar, 
  integer, 
  numeric, 
  timestamp, 
  boolean, 
  jsonb,
  pgEnum 
} from 'drizzle-orm/pg-core';

// Enums for event properties
export const visibilityStatusEnum = pgEnum('visibility_status', ['DRAFT', 'PUBLISHED']);
export const approvalStatusEnum = pgEnum('approval_status', ['PENDING', 'APPROVED', 'REJECTED']);
export const recurrencePatternEnum = pgEnum('recurrence_pattern', ['NONE', 'WEEKLY', 'MONTHLY', 'YEARLY']);
export const sourceTypeEnum = pgEnum('source_type', ['ESTABLISHMENT', 'PROMOTER_GROUP']);
export const recurrenceEndTypeEnum = pgEnum('recurrence_end_type', ['ON_DATE', 'AFTER_OCCURRENCES']);

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  visibilityStatus: visibilityStatusEnum('visibility_status').default('DRAFT'),
  sourceType: sourceTypeEnum('source_type'),
  
  // Recurrence configuration
  recurrencePattern: recurrencePatternEnum('recurrence_pattern').default('NONE'),
  recurrenceEndType: recurrenceEndTypeEnum('recurrence_end_type'),
  maxOccurrences: integer('max_occurrences'),
  recurrenceEndDate: timestamp('recurrence_end_date'),
  recurrenceDaysOfWeek: integer('recurrence_days_of_week').array(), // stored as array of 0-6
  
  // Event details
  minAge: integer('min_age'),
  minPrice: numeric('min_price', { precision: 10, scale: 2 }),
  maxPrice: numeric('max_price', { precision: 10, scale: 2 }),
  startsAt: timestamp('starts_at'),
  endsAt: timestamp('ends_at'),
  
  // Location and metadata
  isNonPromotable: boolean('is_non_promotable').default(false),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  zipCode: varchar('zip_code', { length: 20 }),
  longitude: numeric('longitude'),
  latitude: numeric('latitude'),
  description: text('description'),
  ticketUrl: text('ticket_url'),
});