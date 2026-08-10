import { CollectionForm } from "@/components/manage/collection-form";

export default function NewCollectionPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="font-heading text-3xl font-semibold">New Collection</h1>
      <div className="mt-8">
        <CollectionForm />
      </div>
    </main>
  );
}
