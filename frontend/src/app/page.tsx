"use client";
import { useReadContract } from "thirdweb/react";
import { client, ganacheChain } from "./client";
import { getContract } from "thirdweb";
import { CampaignCard } from "@/components/CampaignCard";
import { CROWDFUNDING_FACTORY } from "./constants/contracts";

export default function Home() {
  // Get CrowdfundingFactory contract
  const chainConfig = {
    id: ganacheChain.id,
    rpc: ganacheChain.rpc[0],
  };

  const contract = getContract({
    client: client,
    chain: chainConfig,
    address: CROWDFUNDING_FACTORY,
  });

  // Get all campaigns deployed with CrowdfundingFactory
  const {
    data: campaigns,
    isLoading: isLoadingCampaigns,
    refetch: refetchCampaigns,
  } = useReadContract({
    contract: contract,
    method:
      "function getAllCampaigns() view returns ((address campaignAddress, address owner, string name)[])",
    params: [],
  });

  return (
    <main className="mx-auto max-w-7xl px-4 mt-4 sm:px-6 lg:px-8">
      <div className="py-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold">Campaigns:</h1>
          <button 
            onClick={() => refetchCampaigns()}
            className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
          >
            Refresh Campaigns
          </button>
        </div>
        {isLoadingCampaigns ? (
          <p>Loading campaigns...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns &&
              (campaigns.length > 0 ? (
                campaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.campaignAddress}
                    campaignAddress={campaign.campaignAddress}
                  />
                ))
              ) : (
                <p>No Campaigns</p>
              ))}
          </div>
        )}
      </div>
    </main>
  );
}
