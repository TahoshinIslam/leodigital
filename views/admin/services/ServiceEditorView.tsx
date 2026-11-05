import { ArrowLeft, Trash2 } from "lucide-react";
import AccessDenied from "@/components/admin/AccessDenied";
import InlineAction from "@/components/admin/InlineAction";
import LanguageTabs from "@/components/admin/LanguageTabs";
import { ButtonLink, PageHeader } from "@/components/admin/ui";
import { can } from "@/lib/auth/permissions";
import { getAdminT } from "@/lib/i18n/admin";
import { siteUrl } from "@/lib/site-url";
import { createServiceAction, deleteServiceAction, updateServiceAction } from "@/server/actions/services.actions";
import type { SessionUser } from "@/server/auth/session";
import { getService } from "@/server/modules/services";
import ServiceForm from "@/views/admin/services/ServiceForm";
import { notFound } from "next/navigation";
import { isAppError } from "@/server/http/errors";

/** Create (id = null) or edit a service. */
export default async function ServiceEditorView({ user, id, saved }: { user: SessionUser; id: number | null; saved?: boolean }) {
  const tr = await getAdminT();
  const allowed = id ? can(user.role, "services:read") : can(user.role, "services:create");
  if (!allowed) return <AccessDenied what={id ? tr.services.accessService : tr.services.accessCreate} />;

  let service = null;
  if (id) {
    try {
      service = await getService(user, id);
    } catch (e) {
      if (isAppError(e) && e.status === 404) notFound();
      throw e;
    }
  }
  const canEdit = id ? can(user.role, "services:update") : true;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={<ButtonLink href="/admin/services" variant="ghost" small className="!px-0 !text-a-t3"><ArrowLeft size={14} /> {tr.common.back}</ButtonLink>}
        title={service ? service.title : tr.services.new}
        subtitle={service ? `/services/${service.slug}` : tr.services.newSubtitle}
        actions={
          service && can(user.role, "services:delete") ? (
            <InlineAction
              action={deleteServiceAction}
              fields={{ id: service.id, redirect: "list" }}
              label={tr.common.delete}
              pendingLabel={tr.common.deleting}
              variant="danger"
              small={false}
              icon={<Trash2 size={15} />}
              confirm={tr.services.confirmDelete(service.title)}
            />
          ) : undefined
        }
      />
      {service ? <LanguageTabs id={service.id} active="en" /> : null}
      {saved ? (
        <div role="status" className="rounded-xl border border-a-em/25 bg-a-em/8 px-4 py-3 text-[13px] font-medium text-a-em">{tr.services.created}</div>
      ) : null}
      {canEdit ? (
        <ServiceForm
          key={service ? `svc-${service.id}` : "new"}
          service={service}
          action={service ? updateServiceAction : createServiceAction}
          canPublish={can(user.role, "services:publish")}
          siteUrl={siteUrl()}
        />
      ) : (
        <p className="m-0 text-[13.5px] text-a-t2">{tr.common.readOnly}</p>
      )}
    </div>
  );
}
