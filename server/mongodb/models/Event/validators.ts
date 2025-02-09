import { isValidObjectId, Types } from "mongoose";
import { z } from "zod";
import { getYesterday } from "../../../../utils/dates";
import {
  eventParentInputClientValidator,
  eventParentInputServerValidator,
} from "../EventParent/validators";

export const eventInputClientValidator = z.object({
  date: z.coerce.date().min(getYesterday(), "Date cannot be in the past"),
  eventParentId: z.instanceof(Types.ObjectId),
  isEnded: z.boolean().optional(),
});

export const eventPopulatedInputClientValidator = z.object({
  date: z.coerce.date().min(getYesterday(), "Date cannot be in the past"),
  eventParent: eventParentInputClientValidator,
  isEnded: z.boolean().optional(),
});

export const eventInputServerValidator = z.object({
  date: z.coerce.date().min(getYesterday(), "Date cannot be in the past"),
  eventParentId: z.string().refine(
    (id) => isValidObjectId(id),
    (id) => ({ message: `eventParentId ${id} is not a valid ObjectId` })
  ),
  isEnded: z.boolean().optional(),
});

export const eventPopulatedInputServerValidator = z.object({
  date: z.coerce.date().min(getYesterday(), "Date cannot be in the past"),
  eventParent: eventParentInputServerValidator,
  isEnded: z.boolean().optional(),
});

export type EventInputClient = z.infer<typeof eventInputClientValidator>;
export type EventPopulatedInputClient = z.infer<
  typeof eventPopulatedInputClientValidator
>;
export type EventInputServer = z.infer<typeof eventInputServerValidator>;
export type EventPopulatedInputServer = z.infer<
  typeof eventPopulatedInputServerValidator
>;
