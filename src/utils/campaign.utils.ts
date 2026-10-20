import { formatNumber } from '@/utils/numberFormat.utils';

export type CampaignCriteriaType = 'hold_keys' | 'trade_volume' | 'trade_count';

export interface CampaignCriteria {
	type: CampaignCriteriaType;
	/** Amount the wallet must reach (keys, XLM volume or trades). */
	target: number;
}

export interface Campaign {
	id: string;
	name: string;
	creatorId: string;
	keyName: string;
	criteria: CampaignCriteria;
	/** Total reward pool in XLM. */
	rewardPoolXlm: number;
	/** ISO timestamp when the campaign closes. */
	endsAt: string;
	/** Connected wallet's progress toward `criteria.target`; absent when signed out. */
	walletProgress?: number | null;
}

export interface CampaignEligibility {
	current: number;
	target: number;
	/** Completion from 0 to 100. */
	percent: number;
	eligible: boolean;
}

/** Human-readable criteria line for a campaign card (#1226). */
export function describeCampaignCriteria(
	criteria: CampaignCriteria,
	keyName: string
): string {
	const target = formatNumber(criteria.target);
	switch (criteria.type) {
		case 'hold_keys':
			return `Hold ${target} ${keyName} ${criteria.target === 1 ? 'key' : 'keys'}`;
		case 'trade_volume':
			return `Trade ${target} XLM of ${keyName} volume`;
		case 'trade_count':
			return `Complete ${target} ${keyName} ${criteria.target === 1 ? 'trade' : 'trades'}`;
		default:
			return `Reach ${target} on ${keyName}`;
	}
}

/** Clamped eligibility progress for a wallet against a campaign target (#1226). */
export function getCampaignEligibility(
	walletProgress: number | null | undefined,
	target: number
): CampaignEligibility {
	const current =
		walletProgress != null && Number.isFinite(walletProgress) && walletProgress > 0
			? walletProgress
			: 0;
	if (!Number.isFinite(target) || target <= 0) {
		return { current, target: 0, percent: 100, eligible: true };
	}
	const percent = Math.min(100, Math.max(0, (current / target) * 100));
	return { current, target, percent, eligible: current >= target };
}

/** Drops campaigns whose end time has passed or is unparseable (#1226). */
export function filterActiveCampaigns(
	campaigns: readonly Campaign[],
	nowMs: number
): Campaign[] {
	return campaigns.filter(campaign => {
		const endsAtMs = new Date(campaign.endsAt).getTime();
		return Number.isFinite(endsAtMs) && endsAtMs > nowMs;
	});
}
