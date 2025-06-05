import { pgTable, serial, text, timestamp, varchar, jsonb} from 'drizzle-orm/pg-core';
import { type Board } from '../game/game'

export const gamesTable = pgTable('games', {
    id: varchar({ length: 255 }).primaryKey(),
    board: jsonb().$type<Board>(),
    currentPlayer: varchar('current_player', { length: 1 }).notNull(),
    endState: varchar('end_state', { length: 255 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
});

export type AddGame = typeof gamesTable.$inferInsert;
export type SelectGame = typeof gamesTable.$inferSelect;