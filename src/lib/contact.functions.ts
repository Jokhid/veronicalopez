import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(3).max(40),
  email: z.string().trim().email().max(255),
  topic: z.string().trim().min(1).max(100),
  message: z.string().trim().max(2000).optional().default(""),
});

const SPREADSHEET_ID = "1Klnh7mZ1NiWs6vNx0omeKrJWbiUaROj2tEYm5KN9HTU";
const SHEET_RANGE = "Leads!A:G";

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const lovableApiKey = process.env.LOVABLE_API_KEY;
    const connectorApiKey = process.env.GOOGLE_SHEETS_API_KEY;

    if (!lovableApiKey || !connectorApiKey) {
      throw new Error("Google Sheets connector is not configured.");
    }

    const fecha = new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" });

    const url = `https://connector-gateway.lovable.dev/google_sheets/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_RANGE}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "X-Connection-Api-Key": connectorApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [
          [
            fecha,
            data.name,
            data.phone,
            data.email,
            data.topic,
            data.message,
            "Web Verónica López",
          ],
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`Google Sheets append failed [${response.status}]: ${text}`);
      throw new Error(`No se ha podido registrar la consulta (${response.status}).`);
    }

    return { success: true };
  });
