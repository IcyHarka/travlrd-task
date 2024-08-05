require('dotenv').config();
const Airtable = require("airtable");
const { createClient } = require("@supabase/supabase-js");

const AIRTABLE_API_KEY = process.env.NEXT_PUBLIC_AIRTABLE_API_TOKEN;
const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

const AIRTABLE_TABLE_NAME = "data";
const SUPABASE_TABLE_NAME = "content";

Airtable.configure({
  apiKey: AIRTABLE_API_KEY,
});
const base = Airtable.base(AIRTABLE_BASE_ID);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function syncAirtableToSupabase() {
  try {
    const records = await base(AIRTABLE_TABLE_NAME).select().all();

    const data = records.map((record) => {
      const fields = record.fields;
      let formattedRecord = { airtable_id: record.id };

      for (const [key, value] of Object.entries(fields)) {
        const formattedKey = key.toLowerCase().replace(/ /g, "_");
        formattedRecord[formattedKey] = value;
      }

      return formattedRecord;
    });

    const { data: error } = await supabase
      .from(SUPABASE_TABLE_NAME)
      .upsert(data, { onConflict: "airtable_id" });

    if (error) {
      console.error("Error inserting data into Supabase:", error);
    } else {
      console.log("Successfully synced data to Supabase");
    }
  } catch (error) {
    console.error("Error syncing data:", error);
  }
}

syncAirtableToSupabase();
