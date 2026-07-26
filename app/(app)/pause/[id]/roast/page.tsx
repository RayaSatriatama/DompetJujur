import { notFound } from 'next/navigation';
import { getPauseSession } from '@/modules/pause/repository';
import { RoastStream } from './RoastStream';

export default async function RoastPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const session = await getPauseSession(resolvedParams.id);

  if (!session) {
    notFound();
  }

  // Mapping from current schema
  const itemName = 'Barang impulsif ini';
  const itemPrice = session.amount || 0;
  const intentDesc = session.trigger_type || 'Hanya lapar mata';

  return (
    <div className="container py-12 flex-1 flex flex-col">
      <RoastStream 
        pauseId={session.id}
        itemName={itemName}
        itemPrice={itemPrice}
        intentDescription={intentDesc}
      />
    </div>
  );
}
