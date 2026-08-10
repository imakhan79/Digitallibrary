import { getPendingAccessRequests } from "@/lib/queries";
import { AccessRequestsList } from "@/components/manage/access-requests-list";

export default async function AccessRequestsPage() {
  const requests = await getPendingAccessRequests();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-heading text-3xl font-semibold">Access Requests</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Institutional users requesting access to restricted resources.
      </p>
      <AccessRequestsList initialRequests={requests} />
    </main>
  );
}
