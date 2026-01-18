import { requireRole } from "@/lib/utils/auth-utils";
import { ROLE } from "@/lib/constants/roles";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(ROLE.STUDENT);

  return <>{children}</>;
}
