import { HandlerProfile } from "../../types";
import { ProfileForm } from "./ProfileForm";
import { ProfileView } from "./ProfileView";

type Props = {
  profile: HandlerProfile;
  onChange: (profile: HandlerProfile) => void;
  isEditing: boolean;
  labels: {
    title: string;
    name: string;
    phone: string;
    organisation: string;
    organisationOther: string;
    unit: string;
    notes: string;
  };
};

export const ProfileSection = ({
  profile,
  onChange,
  isEditing,
  labels,
}: Props) => {
  return (
    <section className="rounded-3xl border border-grey-dark bg-white p-4 shadow-md sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-brand">{labels.title}</h2>
        </div>
      </div>
      {isEditing ? (
        <ProfileForm
          profile={profile}
          onChange={onChange}
          labels={labels}
        />
      ) : (
        <ProfileView profile={profile} labels={labels} />
      )}
    </section>
  );
};
