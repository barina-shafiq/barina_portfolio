import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readFile, writeFile } from "fs/promises";
import path from "path";

async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_auth")?.value === "authenticated";
}

function dataPath(filename: string) {
  return path.join(process.cwd(), "src", "data", filename);
}

// GET: read a data file
export async function GET(request: Request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file");

  const allowedFiles = ["portfolio.json", "projects.json", "skills.json", "publications.json", "resume.json"];
  if (!file || !allowedFiles.includes(file)) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  try {
    const content = await readFile(dataPath(file), "utf-8");
    return NextResponse.json({ data: JSON.parse(content) });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}

// POST: write a data file
export async function POST(request: Request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { file, data } = await request.json();

  const allowedFiles = ["portfolio.json", "projects.json", "skills.json", "publications.json", "resume.json"];
  if (!file || !allowedFiles.includes(file)) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  try {
    await writeFile(dataPath(file), JSON.stringify(data, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Write failed" }, { status: 500 });
  }
}
