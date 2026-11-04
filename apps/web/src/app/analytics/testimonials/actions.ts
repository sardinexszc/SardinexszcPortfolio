"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { CONTENT_TAG } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";

const page = "/analytics/testimonials";

function testimonialId(form: FormData): number {
  const id = Number(form.get("id"));
  if (!Number.isInteger(id) || id <= 0) redirect(`${page}?error=invalid`);
  return id;
}

// The approval gate: only these actions (and the admin CMS) can change what the home page shows.
async function setStatus(form: FormData, status: "approved" | "hidden") {
  await requireAdmin();
  const { error } = await createAdminClient().from("testimonials").update({ status }).eq("id", testimonialId(form));
  if (error) {
    console.error("Testimonial status update failed", error);
    redirect(`${page}?error=failed`);
  }
  updateTag(CONTENT_TAG);
  revalidatePath("/");
  redirect(`${page}?notice=${status}`);
}

export async function approveTestimonial(form: FormData) {
  await setStatus(form, "approved");
}

export async function hideTestimonial(form: FormData) {
  await setStatus(form, "hidden");
}

export async function deleteTestimonial(form: FormData) {
  await requireAdmin();
  const { error } = await createAdminClient().from("testimonials").delete().eq("id", testimonialId(form));
  if (error) {
    console.error("Testimonial delete failed", error);
    redirect(`${page}?error=failed`);
  }
  updateTag(CONTENT_TAG);
  revalidatePath("/");
  redirect(`${page}?notice=deleted`);
}
