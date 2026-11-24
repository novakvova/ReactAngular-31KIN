import {z} from "zod";
import {qrCodeSchema} from "../create/validate.ts";

export const qrCodeEditSchema = qrCodeSchema.extend({
    isActive: z.boolean()
});