import { useAccount } from 'wagmi';
import CampaignCard from '@/components/marketplace/CampaignCard';
import EmptyState from '@/components/common/EmptyState';
import Skeleton from '@/components/ui/skeleton';
import { useActiveCampaigns } from '@/hooks/useCampaigns';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useNowMs } from '@/hooks/useNowMs';
import { filterActiveCampaigns } from '@/utils/campaign.utils';

/** Full list of active seasonal campaigns, linked from the discovery page (#1226). */
export default function CampaignsPage() {
	useDocumentTitle('Campaigns — AccessLayer');
	const { address } = useAccount();
	const { data, isLoading, isError, refetch } = useActiveCampaigns(address);
	const nowMs = useNowMs();

	const campaigns = filterActiveCampaigns(data ?? [], nowMs);

	return (
		<main className="min-h-screen bg-slate-950 px-6 pt-12 pb-28 md:px-12 md:pb-16">
			<div className="mx-auto max-w-7xl">
				<header className="mb-8">
					<h1 className="font-grotesque text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
						Campaigns
					</h1>
					<p className="mt-2 max-w-2xl font-jakarta text-sm text-white/60">
						Seasonal reward campaigns for creator keys. Track how close your
						wallet is to qualifying before each campaign ends.
					</p>
				</header>

				{isLoading ? (
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{Array.from({ length: 3 }, (_, index) => (
							<Skeleton key={index} className="h-56 w-full rounded-2xl" />
						))}
					</div>
				) : isError ? (
					<EmptyState
						title="Couldn't load campaigns"
						description="We couldn't load active campaigns right now. Check your connection and try again."
						cta={{ label: 'Try again', onClick: () => void refetch() }}
						className="mx-auto w-full max-w-xl"
					/>
				) : campaigns.length === 0 ? (
					<EmptyState
						title="No active campaigns"
						description="There are no seasonal campaigns running right now. Check back soon."
						className="mx-auto w-full max-w-xl"
					/>
				) : (
					<div
						data-testid="campaigns-page-grid"
						className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
					>
						{campaigns.map(campaign => (
							<CampaignCard
								key={campaign.id}
								campaign={campaign}
								nowMs={nowMs}
								showProgress={Boolean(address)}
							/>
						))}
					</div>
				)}
			</div>
		</main>
	);
}
