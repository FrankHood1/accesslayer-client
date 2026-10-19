import { useParams } from 'react-router';
import { useCreatorDetail } from '@/hooks/useCreators';
import CreatorBreadcrumb from '@/components/common/CreatorBreadcrumb';
import CreatorProfileHeader from '@/components/common/CreatorProfileHeader';
import { CreatorProfileHeaderSkeleton } from '@/components/common/CreatorSkeleton';
import { resolveCreatorKeyPriceStroops } from '@/utils/keyPriceDisplay.utils';
import { CurveParametersPanel } from '@/components/common/CurveParametersPanel';
import CreatorPageErrorBoundary from '@/components/common/CreatorPageErrorBoundary';
import { ApiError } from '@/services/api.service';
import { useNavigationTiming } from '@/hooks/useNavigationTiming';

export interface CreatorDashboardPageProps {
	creatorId?: string;
}

export function CreatorDashboardPageContent({
	creatorId: propCreatorId,
}: CreatorDashboardPageProps) {
	const { id: paramId } = useParams<{ id: string }>();
	const resolvedId = propCreatorId || paramId || '';
	const {
		data: creator,
		isLoading,
		error,
		refetch,
	} = useCreatorDetail(resolvedId);
	useNavigationTiming('creator_dashboard');

	if (isLoading) {
		return (
			<main className="min-h-screen bg-[#06111f] px-6 py-16 text-white md:px-12">
				<div className="mx-auto max-w-7xl space-y-6">
					<CreatorProfileHeaderSkeleton />
				</div>
			</main>
		);
	}

	if (error) {
		return (
			<main className="min-h-screen bg-[#06111f] px-6 py-16 text-white md:px-12">
				<div className="mx-auto max-w-7xl">
					<div
						className="p-6 border border-red-500/20 rounded-2xl bg-red-950/20 text-red-200"
						role="alert"
					>
						<h3 className="text-lg font-bold">
							Failed to load creator dashboard
						</h3>
						<p className="mt-1 text-sm text-red-300/80">
							{error instanceof Error
								? error.message
								: 'An unexpected error occurred while loading dashboard data.'}
						</p>
						<button
							onClick={() => void refetch()}
							className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
						>
							Retry Connection
						</button>
					</div>
				</div>
			</main>
		);
	}

	if (!creator) {
		throw new ApiError('Creator not found', 404);
	}

	return (
		<main className="min-h-screen bg-[#06111f] px-6 py-16 text-white md:px-12">
			<div className="mx-auto max-w-7xl space-y-8">
				<CreatorBreadcrumb
					parentLabel="Marketplace"
					parentHref="/"
					currentLabel={`${creator.title} Dashboard`}
				/>
				<CreatorProfileHeader
					name={creator.title}
					handle={creator.socialHandle || creator.instructorId}
					creatorId={creator.id}
					isVerified={creator.isVerified}
					avatarUrl={creator.thumbnail}
					bio={creator.description}
					priceStroops={resolveCreatorKeyPriceStroops(creator)}
				/>
				<CurveParametersPanel
					creatorId={creator.id}
					creatorName={creator.title}
					currentSupply={creator.creatorShareSupply ?? 10}
				/>
			</div>
		</main>
	);
}

export function CreatorDashboardPage(props: CreatorDashboardPageProps) {
	return (
		<CreatorPageErrorBoundary>
			<CreatorDashboardPageContent {...props} />
		</CreatorPageErrorBoundary>
	);
}

export default CreatorDashboardPage;
