"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { CONTENT_TAG } from "@/lib/api";
import { findSection, settingsGroups, type Field } from "@/lib/cms";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { isAllowedImage, MEDIA_PREFIX } from "@/lib/work-projects";

const BUCKET = "portfolio-media";
const IMAGE_TYPES: Record<string, string> = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png", "image/avif": "avif" };
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_TEXT = 5000;

class InputError extends Error {}

async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = IMAGE_TYPES[file.type];
  if (!ext) throw new InputError("Images must be WebP, JPEG, PNG or AVIF.");
  if (file.size > MAX_IMAGE_BYTES) throw new InputError("Images must be 4 MB or smaller.");
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await createAdminClient().storage.from(BUCKET).upload(path, file, { contentType: file.type });
  if (error) throw error;
  return MEDIA_PREFIX + path;
}

async function parseField(field: Field, form: FormData, folder: string): Promise<unknown> {
  if (field.kind === "bool") return form.get(field.name) === "on";
  if (field.kind === "image") {
    const file = form.get(`${field.name}__file`);
    if (file instanceof File && file.size > 0) return uploadImage(file, folder);
  }
  const raw = String(form.get(field.name) ?? "").trim();
  if (raw.length > MAX_TEXT) throw new InputError(`${field.label} is too long.`);
  if (field.required && !raw) throw new InputError(`${field.label} is required.`);
  switch (field.kind) {
    case "number": {
      const value = Number.parseInt(raw || "0", 10);
      if (!Number.isFinite(value)) throw new InputError(`${field.label} must be a whole number.`);
      return value;
    }
    case "list": return raw.split(",").map((item) => item.trim()).filter(Boolean);
    case "lines": return raw.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
    case "select":
      if (raw && !field.options?.includes(raw)) throw new InputError(`Choose a valid ${field.label.toLowerCase()}.`);
      return raw || null;
    case "url":
      if (!raw) return null;
      try {
        if (!["https:", "http:"].includes(new URL(raw).protocol)) throw new Error();
      } catch {
        throw new InputError(`${field.label} must be a full http(s) link.`);
      }
      return raw;
    case "image":
      if (raw && !isAllowedImage(raw)) throw new InputError(`${field.label} must be an uploaded image or a /images/… path.`);
      return raw || null;
    default:
      return raw || null;
  }
}

function publish() {
  updateTag(CONTENT_TAG);
  revalidatePath("/");
}

// Runs a CMS write and sends the editor back with a status message instead of throwing.
async function run(back: string, work: () => Promise<string>) {
  await requireAdmin();
  let status: string;
  try {
    status = `saved=${encodeURIComponent(await work())}`;
    publish();
  } catch (error) {
    if (!(error instanceof InputError)) console.error("CMS write failed", error);
    status = `error=${encodeURIComponent(error instanceof InputError ? error.message : "Could not save. Please try again.")}`;
  }
  redirect(`${back}?${status}`);
}

export async function saveRow(form: FormData) {
  const section = findSection(String(form.get("section")));
  if (!section) redirect("/analytics/content");
  const back = `/analytics/content/${section.slug}`;
  await run(back, async () => {
    const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const field of section.fields) row[field.name] = await parseField(field, form, section.slug);
    const id = Number(form.get("id"));
    const db = createAdminClient().from(section.table);
    const { error } = Number.isInteger(id) && id > 0 ? await db.update(row).eq("id", id) : await db.insert(row);
    if (error) throw error;
    return `${section.singular} saved`;
  });
}

export async function deleteRow(form: FormData) {
  const section = findSection(String(form.get("section")));
  if (!section) redirect("/analytics/content");
  await run(`/analytics/content/${section.slug}`, async () => {
    const id = Number(form.get("id"));
    if (!Number.isInteger(id) || id <= 0) throw new InputError("Nothing to delete.");
    const { error } = await createAdminClient().from(section.table).delete().eq("id", id);
    if (error) throw error;
    return `${section.singular} deleted`;
  });
}

export async function saveSettings(form: FormData) {
  await run("/analytics/content", async () => {
    const db = createAdminClient();
    const { data, error: readError } = await db.from("site_settings").select("content").eq("id", 1).maybeSingle();
    if (readError) throw readError;
    const content: Record<string, unknown> = { ...(data?.content ?? {}) };
    for (const field of settingsGroups.flatMap((group) => group.fields)) content[field.name] = await parseField(field, form, "site");
    const { error } = await db.from("site_settings").upsert({ id: 1, content, updated_at: new Date().toISOString() });
    if (error) throw error;
    return "site copy saved";
  });
}
