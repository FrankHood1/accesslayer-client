import { Link } from 'react-router';
import { BadgeCheck, Clock, Gift } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
	describeCampaignCriteria,
	getCampaignEligibility,
	type Campaign,
} from '@/utils/campaign.utils';
import { formatNumber } from '@/utils/numberFormat.utils';
import { formatSpotlightTimeRemaining } from '@/utils/spotlightAuction.utils';

interface CampaignCardProps {
	campaign: Campaign;
	nowMs: number;
	/** Hides the progress bar when no wallet is connected. */
	showProgress: boolean;
}

/** One seasonal campaign with criteria, reward pool, countdown and eligibility (#1226). */
export default function CampaignCard({
	campaign,
	nowMs,
	showProgress,
}: CampaignCardProps) {
	const timeRemaining =
		formatSpotlightTimeRemaining(campaign.endsAt, nowMs) ?? 'Ended';
	const eligibility = getCampaignEligibility(
		campaign.walletProgress,
		campaign.criteria.target
	);
	const progressPercent = Math.round(eligibility.percent);

	return (
		<article
			data-testid={`campaign-card-${campaign.id}`}
			aria-labelledby={`campaign-${campaign.id}-title`}
			className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur-md"
		>
			<header className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<Link
						to={`/creator/${campaign.creatorId}`}
						className="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300"
					>
						{campaign.keyName}
					</Link>
					<h3
						id={`campaign-${campaign.id}-title`}
						className="mt-1 truncate font-grotesque text-lg font-bold text-white"
					>
						{campaign.name}
					</h3>
				</div>
				{showProgress && eligibility.eligible && (
					<span
						data-testid="campaign-eligible-badge"
						className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/15 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-emerald-300"
					>
						<BadgeCheck className="size-3.5" aria-hidden="true" />
						Eligible
					</span>
				)}
			</header>

			<p
				data-testid="campaign-criteria"
				className="font-jakarta text-sm text-white/70"
			>
				{describeCampaignCriteria(campaign.criteria, campaign.keyName)}
			</p>

			<dl className="grid grid-cols-2 gap-3 text-xs">
				<div>
					<dt className="flex items-center gap-1 font-semibold uppercase tracking-wider text-white/45">
						<Gift className="size-3" aria-hidden="true" />
						Reward pool
					</dt>
					<dd
						data-testid="campaign-reward-pool"
						className="mt-1 font-mono text-sm font-semibold text-white"
					>
						{formatNumber(campaign.rewardPoolXlm)} XLM
					</dd>
				</div>
				<div>
					<dt className="flex items-center gap-1 font-semibold uppercase tracking-wider text-white/45">
						<Clock className="size-3" aria-hidden="true" />
						Time left
					</dt>
					<dd
						role="timer"
						aria-live="off"
						data-testid="campaign-time-remaining"
						className="mt-1 font-mono text-sm font-semibold text-amber-200"
					>
						{timeRemaining}
					</dd>
				</div>
			</dl>

			{showProgress && (
				<div className="mt-auto space-y-1.5">
					<div className="flex items-center justify-between text-xs text-white/60">
						<span>Your progress</span>
						<span
							data-testid="campaign-progress-label"
							className="font-mono tabular-nums"
						>
							{formatNumber(eligibility.current)} /{' '}
							{formatNumber(eligibility.target)}
						</span>
					</div>
					<Progress
						value={progressPercent}
						aria-label={`${campaign.name} eligibility progress`}
						data-testid="campaign-progress-bar"
						className={cn(
							'h-1.5 bg-white/10',
							eligibility.eligible &&
								'[&>div]:bg-emerald-400'
						)}
					/>
				</div>
			)}
		</article>
	);
}
