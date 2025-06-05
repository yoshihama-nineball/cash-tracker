import ProfileTabs from "@/components/profile/ProfileTabs";
import { redirect } from "next/navigation";
import { verifySession } from "../../../../../libs/auth/dal";

export default async function Page() {
  const { user } = await verifySession();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div>
      <ProfileTabs profile={user} />
    </div>
  );
}

export const dynamic = "force-dynamic";
