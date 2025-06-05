import { drizzle } from 'drizzle-orm/postgres-js';
import { gamesTable } from './schema.ts';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle({ client });

console.log(db)