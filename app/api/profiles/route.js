// app/api/profiles/route.js
import { NextResponse } from 'next/server';

// Mock-data — kan senere hentes fra database eller admin-panel
const profiles = {
  AB12: {
    alias: "Laura",
    interesser: ["Friluftsliv", "Kunst", "Gode samtaler"],
    note: "Spørg mig om min favoritvandrerute"
  },
  CD34: {
    alias: "Maja",
    interesser: ["Madlavning", "Rejser", "Musik"],
    note: "Elsker at høre live musik og finde skjulte perler"
  },
  EF56: {
    alias: "Sofie",
    interesser: ["Heste", "Natur", "Bøger"],
    note: "Bruger weekenderne i stalden eller med en god bog"
  }
};

// GET handler til /api/profiles
export async function GET() {
  return NextResponse.json(profiles);
}
