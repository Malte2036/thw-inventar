import { z } from 'zod';
import { DatabaseIdSchema } from './databaseModels';

const inventarNummerRegex = /^[A-Za-z0-9-]+$/; // Assuming this is the regex pattern

export const InventoryItemCustomDataSchema = z.object({
	lastScanned: z.coerce.date().optional(),
	note: z.string().max(1000).optional()
});

export type InventoryItemCustomData = z.infer<typeof InventoryItemCustomDataSchema>;

export const InventoryItemZodSchema = z.object({
	_id: DatabaseIdSchema,
	organisation: z.string(),
	einheit: z.string(),
	ebene: z.number().int(),
	art: z.string().nullable().optional(),
	menge: z.number().int().nullable().optional(),
	mengeIst: z.number().int().nullable().optional(),
	verfuegbar: z.number().int().nullable().optional(),
	ausstattung: z.string(),
	hersteller: z.string().nullable().optional(),
	typ: z.string().nullable().optional(),
	inventarNummer: z
		.string()
		.regex(inventarNummerRegex, 'Invalid inventarNummer format')
		.nullable()
		.optional(),
	sachNummer: z.string().nullable().optional(),
	gerateNummer: z.string().nullable().optional(),
	status: z.string().nullable().optional(),
	customData: InventoryItemCustomDataSchema.nullable().optional()
});

export type InventoryItem = z.infer<typeof InventoryItemZodSchema>;

export const ImportInventoryItemsResultZodSchema = z.object({
	count: z.number().int(),
	einheiten: z.string().array()
});

export type ImportInventoryItemsResult = z.infer<typeof ImportInventoryItemsResultZodSchema>;
