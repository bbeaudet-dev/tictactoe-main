CREATE TABLE "games" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"board" jsonb,
	"current_player" varchar(1) NOT NULL,
	"end_state" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
