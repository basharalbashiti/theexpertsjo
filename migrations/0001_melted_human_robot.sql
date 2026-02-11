ALTER TABLE "partners" ADD COLUMN "display_type" text DEFAULT 'image' NOT NULL;--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN "font_family" text DEFAULT 'sans-serif' NOT NULL;--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN "font_weight" text DEFAULT '900' NOT NULL;--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN "font_style" text DEFAULT 'normal' NOT NULL;--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN "text_color" text DEFAULT '#4A5568' NOT NULL;--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN "letter_spacing" text DEFAULT '0.05em' NOT NULL;