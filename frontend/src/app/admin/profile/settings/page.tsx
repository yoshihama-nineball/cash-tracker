import ProfileTabs from "@/components/profile/ProfileTabs";
import { verifySession } from "../../../../../libs/auth/dal";

export default async function Page() {
  const { user } = await verifySession();
  return (
    <div>
      <h1>タブページ</h1>
      <ProfileTabs profile={user} />
    </div>
  );
}
