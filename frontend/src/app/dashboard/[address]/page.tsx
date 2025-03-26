"use client";
import { client, ganacheChain } from "@/app/client";
import { getContract, prepareContractCall } from "thirdweb";
import { TransactionButton, useReadContract } from "thirdweb/react";
import { MyCampaignCard } from "@/components/MyCampaignCard";
import { CROWDFUNDING_FACTORY } from "@/app/constants/contracts";
import { useState } from "react";

export default function DashboardPage({
  params,
}: {
  params: { address: string };
}) {
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [campaignGoal, setCampaignGoal] = useState("");
  const [campaignDuration, setCampaignDuration] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const chainConfig = {
    id: ganacheChain.id,
    rpc: ganacheChain.rpc[0],
  };

  const factoryContract = getContract({
    client: client,
    chain: chainConfig,
    address: CROWDFUNDING_FACTORY,
  });

  // Get user campaigns
  const {
    data: userCampaigns,
    isLoading,
    refetch: refetchCampaigns,
  } = useReadContract({
    contract: factoryContract,
    method:
      "function getUserCampaigns(address _user) view returns ((address campaignAddress, address owner, string name)[])",
    params: [params.address],
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">My Campaigns</h2>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {isCreating ? "Cancel" : "Create New Campaign"}
          </button>
        </div>

        {isCreating && (
          <div className="border rounded-lg p-4 mb-6">
            <h3 className="text-xl font-semibold mb-4">Create New Campaign</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Campaign Name</label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full border p-2 rounded-md"
                  placeholder="Enter campaign name"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  value={campaignDescription}
                  onChange={(e) => setCampaignDescription(e.target.value)}
                  className="w-full border p-2 rounded-md"
                  placeholder="Enter campaign description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Goal Amount (in wei)
                  </label>
                  <input
                    type="number"
                    value={campaignGoal}
                    onChange={(e) => setCampaignGoal(e.target.value)}
                    className="w-full border p-2 rounded-md"
                    placeholder="Enter goal amount"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">
                    Duration (in days)
                  </label>
                  <input
                    type="number"
                    value={campaignDuration}
                    onChange={(e) => setCampaignDuration(e.target.value)}
                    className="w-full border p-2 rounded-md"
                    placeholder="Enter duration in days"
                  />
                </div>
              </div>
              <TransactionButton
                transaction={() =>
                  prepareContractCall({
                    contract: factoryContract,
                    method:
                      "function createCampaign(string memory _name, string memory _description, uint256 _goal, uint256 _durationInDays)",
                    params: [
                      campaignName,
                      campaignDescription,
                      BigInt(campaignGoal || "0"),
                      BigInt(campaignDuration || "0"),
                    ],
                  })
                }
                onError={(error) => alert(`Error: ${error.message}`)}
                onTransactionConfirmed={async () => {
                  alert("Campaign created successfully!");
                  setCampaignName("");
                  setCampaignDescription("");
                  setCampaignGoal("");
                  setCampaignDuration("");
                  setIsCreating(false);
                  refetchCampaigns();
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-full"
                disabled={
                  !campaignName ||
                  !campaignDescription ||
                  !campaignGoal ||
                  !campaignDuration
                }
              >
                Create Campaign
              </TransactionButton>
            </div>
          </div>
        )}

        {isLoading ? (
          <p>Loading your campaigns...</p>
        ) : userCampaigns && userCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCampaigns.map((campaign) => (
              <MyCampaignCard
                key={campaign.campaignAddress}
                contractAddress={campaign.campaignAddress}
              />
            ))}
          </div>
        ) : (
          <p>You do not have any campaigns yet.</p>
        )}
      </div>
    </main>
  );
} 