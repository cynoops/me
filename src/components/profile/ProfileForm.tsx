import { ORGANISATIONS } from "../../constants";
import { HandlerProfile } from "../../types";

type ProfileLabels = {
  name: string;
  phone: string;
  organisation: string;
  organisationOther: string;
  unit: string;
  notes: string;
};

type Props = {
  profile: HandlerProfile;
  onChange: (profile: HandlerProfile) => void;
  labels: ProfileLabels;
};

export const ProfileForm = ({ profile, onChange, labels }: Props) => {
  const updateField = (field: keyof HandlerProfile, value: string) => {
    onChange({ ...profile, [field]: value });
  };

  const showOtherOrganisation = profile.organisation === "other";

  return (
    <div className="grid gap-4">
      <InputField
        label={labels.name}
        value={profile.name}
        onChange={(value) => updateField("name", value)}
        autoComplete="name"
      />
      <InputField
        label={labels.phone}
        value={profile.phone}
        onChange={(value) => updateField("phone", value)}
        autoComplete="tel"
        type="tel"
      />
      <label className="grid gap-1 text-sm font-medium text-brand">
        <span>{labels.organisation}</span>
        <select
          className="rounded-lg border border-grey-dark bg-grey-light px-3 py-2 text-base shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-light"
          value={profile.organisation}
          onChange={(event) =>
            updateField("organisation", event.target.value)
          }
        >
          <option value="">{labels.organisation}</option>
          {ORGANISATIONS.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
          <option value="other">{labels.organisationOther}</option>
        </select>
      </label>
      {showOtherOrganisation ? (
        <InputField
          label={labels.organisationOther}
          value={profile.organisationOther}
          onChange={(value) => updateField("organisationOther", value)}
        />
      ) : null}
      <InputField
        label={labels.unit}
        value={profile.unit}
        onChange={(value) => updateField("unit", value)}
      />
      <label className="grid gap-1 text-sm font-medium text-brand">
        <span>{labels.notes}</span>
        <textarea
          className="min-h-[96px] rounded-lg border border-grey-dark bg-grey-light px-3 py-2 text-base shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-light"
          value={profile.notes}
          onChange={(event) => updateField("notes", event.target.value)}
        />
      </label>
    </div>
  );
};

type InputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
};

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: InputProps) => (
  <label className="grid gap-1 text-sm font-medium text-brand">
    <span>{label}</span>
    <input
      className="rounded-lg border border-grey-dark bg-grey-light px-3 py-2 text-base shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-light"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      type={type}
      autoComplete={autoComplete}
    />
  </label>
);
