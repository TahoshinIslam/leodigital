import type { AdminDict } from "@/lib/i18n/admin/en";

/**
 * Audit log summaries are stored in English, written from a fixed set of
 * templates (see server/modules/*). In Bangla they are rebuilt at display
 * time from the same template, so old and new entries both translate and the
 * stored log stays a stable, language-neutral record.
 */
type Rule = [RegExp, (m: RegExpExecArray, t: AdminDict) => string];

const role = (r: string, t: AdminDict) => t.roles[r as keyof AdminDict["roles"]] ?? r;

const RULES: Rule[] = [
  [/^Signed in$/, () => "সাইন ইন করেছেন"],
  [/^Signed out$/, () => "সাইন আউট করেছেন"],
  [/^Failed sign-in attempt$/, () => "ব্যর্থ সাইন-ইন চেষ্টা"],
  [/^Created “(.*)”$/, (m) => `“${m[1]}” তৈরি করেছেন`],
  [/^Updated “(.*)”$/, (m) => `“${m[1]}” হালনাগাদ করেছেন`],
  [/^Published “(.*)”$/, (m) => `“${m[1]}” প্রকাশ করেছেন`],
  [/^Unpublished “(.*)”$/, (m) => `“${m[1]}” অপ্রকাশিত করেছেন`],
  [/^Deleted “(.*)”$/, (m) => `“${m[1]}” মুছে ফেলেছেন`],
  [/^Updated BN translation of “(.*)”$/, (m) => `“${m[1]}”-এর বাংলা অনুবাদ হালনাগাদ করেছেন`],
  [/^Uploaded an image$/, () => "একটি ছবি আপলোড করেছেন"],
  [/^Uploaded (.*)$/, (m) => `${m[1]} আপলোড করেছেন`],
  [/^Added (.*) as (super_admin|admin|editor|viewer)$/, (m, t) => `${m[1]}-কে ${role(m[2], t)} হিসেবে যোগ করেছেন`],
  [
    /^Updated (.*?)(?: → (super_admin|admin|editor|viewer))?( \((?:de)?activated\))?$/,
    (m, t) =>
      [
        `${m[1]}-এর অ্যাকাউন্ট হালনাগাদ করেছেন`,
        m[2] ? `(রোল: ${role(m[2], t)})` : "",
        m[3] ? (m[3].includes("deactivated") ? "(নিষ্ক্রিয়)" : "(সক্রিয়)") : "",
      ]
        .filter(Boolean)
        .join(" "),
  ],
];

const ACTIONS: Record<string, string> = {
  "auth.login": "সাইন ইন",
  "auth.logout": "সাইন আউট",
  "auth.login_failed": "ব্যর্থ সাইন-ইন",
  "service.create": "সার্ভিস তৈরি",
  "service.update": "সার্ভিস হালনাগাদ",
  "service.publish": "প্রকাশ",
  "service.unpublish": "অপ্রকাশ",
  "service.delete": "সার্ভিস মুছে ফেলা",
  "service.translate": "অনুবাদ",
  "media.upload": "ছবি আপলোড",
  "user.create": "ইউজার যোগ",
  "user.update": "ইউজার হালনাগাদ",
};

export function auditSummary(summary: string, t: AdminDict): string {
  if (t.lang !== "bn") return summary;
  for (const [re, fn] of RULES) {
    const m = re.exec(summary);
    if (m) return fn(m, t);
  }
  return summary;
}

export function auditAction(action: string, t: AdminDict): string {
  return t.lang === "bn" ? (ACTIONS[action] ?? action) : action;
}
