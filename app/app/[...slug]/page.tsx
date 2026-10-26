import Link from "next/link";
import { Icon, PageHeader } from "@/components/ui";

/** Placeholder for dashboard pages that are linked from the nav but not yet built. */
export default async function NotYetBuilt({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return (
    <div className="stack-lg">
      <PageHeader title="Coming soon" sub={`/app/${slug.join("/")}`} />
      <div className="card card-pad stack">
        <p>This part of the workspace isn't available in the demo yet.</p>
        <div className="row wrap">
          <Link href="/app" className="btn btn-primary">Back to dashboard <Icon name="arrow" size={16} /></Link>
          <Link href="/demo" className="btn btn-ghost">Open the interactive demo</Link>
        </div>
      </div>
    </div>
  );
}
