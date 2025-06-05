CREATE TABLE "games" (
	"id" serial PRIMARY KEY NOT NULL,
	"board" text NOT NULL,
	"current_player" varchar(1) NOT NULL,
	"end_state" varchar(4),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
DROP TABLE "posts_table" CASCADE;--> statement-breakpoint
DROP TABLE "users_table" CASCADE;