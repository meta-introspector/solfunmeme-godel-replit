import { pgTable, text, serial, integer, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const poems = pgTable("poems", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: jsonb("content").notNull(), // Array of stanzas with interactive elements
  cycleStep: integer("cycle_step").notNull(),
  totalCycles: integer("total_cycles").notNull(),
  godelNumber: text("godel_number").notNull(),
  chaosValue: real("chaos_value").notNull(),
  beautyValue: real("beauty_value").notNull(),
  complexityValue: real("complexity_value").notNull(),
  coherenceValue: real("coherence_value").notNull(),
  consciousnessValue: real("consciousness_value").notNull(),
});

// Interactive number schema for poem content
export const InteractiveNumberSchema = z.object({
  value: z.string(),
  type: z.enum(["godel", "chaos", "beauty", "complexity", "coherence", "consciousness", "other"]),
  binding: z.string().optional(),
});

// Stanza schema
export const StanzaSchema = z.object({
  id: z.string(),
  lines: z.array(z.string()),
  hasLeftBorder: z.boolean().default(false),
  interactiveNumbers: z.array(InteractiveNumberSchema).default([]),
});

// Poem content schema
export const PoemContentSchema = z.object({
  stanzas: z.array(StanzaSchema),
  endMessage: z.string(),
});

export const insertPoemSchema = createInsertSchema(poems).omit({ id: true });

export type InsertPoem = z.infer<typeof insertPoemSchema>;
export type Poem = typeof poems.$inferSelect;
export type InteractiveNumber = z.infer<typeof InteractiveNumberSchema>;
export type Stanza = z.infer<typeof StanzaSchema>;
export type PoemContent = z.infer<typeof PoemContentSchema>;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
