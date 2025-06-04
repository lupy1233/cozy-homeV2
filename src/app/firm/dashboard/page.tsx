import { redirect } from "next/navigation";
import { getCurrentFirmSession } from "@/lib/firm-auth";
import FirmDashboard from "@/components/firm/FirmDashboard";

export default async function FirmDashboardPage() {
  const session = await getCurrentFirmSession();

  if (!session) {
    redirect("/firm/login");
  }

  return <FirmDashboard session={session} />;
}
