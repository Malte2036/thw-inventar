import { BRAND, z } from 'zod';
import { OrganisationIdSchema } from './organisationModels';

const inventarNummerRegex = /^[A-Za-z0-9-]+$/; // Assuming this is the regex pattern

export type InventoryItemId = string & BRAND<'InventoryItemId'>;
export const InventoryItemIdSchema = z.string().brand<'InventoryItemId'>();

export const InventoryItemCustomDataIdSchema = z.string().brand<'InventoryItemCustomDataId'>();
export const InventoryItemCustomDataSchema = z.object({
	id: InventoryItemCustomDataIdSchema,
	lastScanned: z.coerce.date().optional(),
	note: z.string().max(1000).nullable().optional()
});

export type InventoryItemCustomData = z.infer<typeof InventoryItemCustomDataSchema>;

export const InventoryItemSchema = z.object({
	id: InventoryItemIdSchema,
	organisationId: OrganisationIdSchema,
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
	customDataId: InventoryItemCustomDataIdSchema.nullable().optional(),
	customData: InventoryItemCustomDataSchema.nullable().optional()
});

export type InventoryItem = z.infer<typeof InventoryItemSchema>;

export const ImportInventoryItemsResultSchema = z.object({
	count: z.number().int(),
	einheiten: z.string().array()
});

export type ImportInventoryItemsResult = z.infer<typeof ImportInventoryItemsResultSchema>;
