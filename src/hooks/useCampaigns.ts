import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { campaignsService } from '@/services/campaigns.service';

// Campaign progress only moves on trades, so a minute keeps it fresh without
// competing with the discovery page's own 60s refresh.
const CAMPAIGNS_POLL_INTERVAL_MS = 60_000;

/** Active seasonal campaigns, scoped to the connected wallet's progress (#1226). */
export function useActiveCampaigns(wallet: string | undefined) {
	return useQuery({
		queryKey: queryKeys.creators.discovery.campaigns(wallet),
		queryFn: () => campaignsService.getActiveCampaigns(wallet),
		refetchInterval: CAMPAIGNS_POLL_INTERVAL_MS,
	});
}
