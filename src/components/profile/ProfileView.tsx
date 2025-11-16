import { HandlerProfile } from "../../types";
import { getOrganisationLabel } from "../../constants";

type ProfileLabels = {
  name: string;
  phone: string;
  organisation: string;
  unit: string;
  notes: string;
};

type Props = {
  profile: HandlerProfile;
  labels: ProfileLabels;
};

export const ProfileView = ({ profile, labels }: Props) => {
  const organisationName =
    profile.organisation === "other" || profile.organisation === ""
      ? profile.organisationOther
      : getOrganisationLabel(profile.organisation) ?? profile.organisation;

  const displayItems = [
    { label: labels.name, value: profile.name || "—" },
    { label: labels.phone, value: profile.phone || "—" },
    { label: labels.organisation, value: organisationName || "—" },
    { label: labels.unit, value: profile.unit || "—" },
  ];

  return (
    <div className="space-y-4">
      <dl className="grid gap-4 rounded-xl border border-grey-dark bg-white p-4 shadow-sm">
        {displayItems.map((item) => (
          <div key={item.label}>
            <dt className="text-xs uppercase tracking-wide text-grey-text">
              {item.label}
            </dt>
            <dd className="text-base font-semibold text-brand">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="rounded-xl border border-grey-dark bg-white p-4 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-grey-text">
          {labels.notes}
        </p>
        <p className="whitespace-pre-line text-base text-brand">
          {profile.notes || "—"}
        </p>
      </div>
    </div>
  );
};
