import { ArrowLeft, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import AccessDenied from "@/components/admin/AccessDenied";
import LanguageTabs from "@/components/admin/LanguageTabs";
import { ButtonLink, PageHeader, StatusPill } from "@/components/admin/ui";
import { can } from "@/lib/auth/permissions";
import { getAdminT } from "@/lib/i18n/admin";
import { saveTranslationAction } from "@/server/actions/services.actions";
import type { SessionUser } from "@/server/auth/session";
import { isAppError } from "@/server/http/errors";
import { getService, getServiceTranslation } from "@/server/modules/services";
import TranslationForm from "@/views/admin/services/TranslationForm";

/** Edit the Bangla version of a service. English is shown alongside as the source. */
export default async function ServiceTranslationView({ user, id, locale }: { user: SessionUser; id: number; locale: "bn" }) {
  const tr = await getAdminT();
  if (!can(user.role, "services:read")) return <AccessDenied what={tr.services.accessService} />;
  let service;
  try {
    service = await getService(user, id);
  } catch (e) {
    if (isAppError(e) && e.status === 404) notFound();
    throw e;
  }
  const translation = await getServiceTranslation(user, id, locale);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={<ButtonLink href="/admin/services" variant="ghost" small className="!px-0 !text-a-t3"><ArrowLeft size={14} /> {tr.common.back}</ButtonLink>}
        title={<span lang="bn">{translation.title || service.title}</span>}
        subtitle={tr.translate.subtitle(service.slug)}
        actions={
          <>
            <StatusPill status={service.status} labels={tr.common} />
            {service.status === "published" ? (
              <ButtonLink href={`/bn/services/${service.slug}`} target="_blank" variant="secondary"><ExternalLink size={15} /> {tr.translate.viewBn}</ButtonLink>
            ) : null}
          </>
        }
      />
      <LanguageTabs id={id} active="bn" />
      {can(user.role, "services:update") ? (
        <TranslationForm
          key={`${id}-${locale}`}
          id={id}
          locale={locale}
          source={service}
          translation={translation}
          action={saveTranslationAction}
        />
      ) : (
        <p className="m-0 text-[13.5px] text-a-t2">{tr.common.readOnly}</p>
      )}
    </div>
  );
}
