"use client";
import { client, ganacheChain } from "@/app/client";
import { getContract, prepareContractCall } from "thirdweb";
import { TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { TierCard } from "@/components/TierCard";
import { useEffect, useState } from "react";

export default function CampaignDetailPage({
  params,
}: {
  params: { address: string };
}) {
  const [isOwner, setIsOwner] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTierName, setNewTierName] = useState("");
  const [newTierAmount, setNewTierAmount] = useState("");
  const account = useActiveAccount();

  const chainConfig = {
    id: ganacheChain.id,
    rpc: ganacheChain.rpc[0],
  };

  const contract = getContract({
    client: client,
    chain: chainConfig,
    address: params.address,
  });

  // Get Campaign Name
  const { data: campaignName } = useReadContract({
    contract: contract,
    method: "function name() view returns (string)",
    params: [],
  });

  // Get Campaign Description
  const { data: campaignDescription } = useReadContract({
    contract: contract,
    method: "function description() view returns (string)",
    params: [],
  });

  // Goal amount of the campaign
  const { data: goal } = useReadContract({
    contract: contract,
    method: "function goal() view returns (uint256)",
    params: [],
  });

  // Total funded balance of the campaign
  const { data: balance, refetch: refetchBalance } = useReadContract({
    contract: contract,
    method: "function getContractBalance() view returns (uint256)",
    params: [],
  });

  // Campaign owner
  const { data: owner } = useReadContract({
    contract: contract,
    method: "function owner() view returns (address)",
    params: [],
  });

  // Campaign state
  const { data: state, refetch: refetchState } = useReadContract({
    contract: contract,
    method: "function getCampaignStatus() view returns (uint8)",
    params: [],
  });

  // Campaign deadline
  const { data: deadline } = useReadContract({
    contract: contract,
    method: "function deadline() view returns (uint256)",
    params: [],
  });

  // Get tiers
  const { data: tiers, refetch: refetchTiers } = useReadContract({
    contract: contract,
    method: "function getTiers() view returns ((string name, uint256 amount, uint256 backers)[])",
    params: [],
  });

  // Calculate the total funded balance percentage
  const totalBalance = balance?.toString();
  const totalGoal = goal?.toString();
  let balancePercentage =
    totalBalance && totalGoal
      ? (Number(totalBalance) / Number(totalGoal)) * 100
      : 0;

  // If balance is greater than or equal to goal, percentage should be 100
  if (balancePercentage >= 100) {
    balancePercentage = 100;
  }

  useEffect(() => {
    if (account && owner) {
      setIsOwner(account.address.toLowerCase() === owner.toLowerCase());
    }
  }, [account, owner]);

  const stateLabels = ["Active", "Successful", "Failed"];
  const stateColors = ["bg-blue-500", "bg-green-500", "bg-red-500"];

  const deadlineDate = deadline
    ? new Date(Number(deadline) * 1000).toLocaleDateString()
    : "";

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">{campaignName}</h1>
          {state !== undefined && (
            <span
              className={`px-3 py-1 text-white rounded-full ${
                stateColors[Number(state)]
              }`}
            >
              {stateLabels[Number(state)]}
            </span>
          )}
        </div>

        <p className="text-gray-700 mb-6">{campaignDescription}</p>

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span>
              Progress: ${totalBalance || "0"} of ${totalGoal || "0"}
            </span>
            <span>{Math.round(balancePercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full"
              style={{ width: `${balancePercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold">Campaign Deadline</h3>
            <p>{deadlineDate}</p>
          </div>
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold">Campaign Owner</h3>
            <p className="truncate">{owner}</p>
          </div>
        </div>

        {isOwner && Number(state) === 0 && (
          <div className="flex space-x-4 mb-6">
            <TransactionButton
              transaction={() =>
                prepareContractCall({
                  contract: contract,
                  method: "function withdraw()",
                  params: [],
                })
              }
              onError={(error) => alert(`Error: ${error.message}`)}
              onTransactionConfirmed={async () => {
                alert("Funds withdrawn successfully!");
                refetchBalance();
                refetchState();
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Withdraw Funds
            </TransactionButton>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              {isEditing ? "Done Editing" : "Edit Tiers"}
            </button>
          </div>
        )}

        {Number(state) === 2 && (
          <TransactionButton
            transaction={() =>
              prepareContractCall({
                contract: contract,
                method: "function refund()",
                params: [],
              })
            }
            onError={(error) => alert(`Error: ${error.message}`)}
            onTransactionConfirmed={async () => {
              alert("Refund processed successfully!");
              refetchBalance();
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 mb-6"
          >
            Get Refund
          </TransactionButton>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">Funding Tiers</h2>

      {isOwner && isEditing && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4">Add New Tier</h3>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Tier Name"
              value={newTierName}
              onChange={(e) => setNewTierName(e.target.value)}
              className="border p-2 rounded-md flex-1"
            />
            <input
              type="number"
              placeholder="Amount (in wei)"
              value={newTierAmount}
              onChange={(e) => setNewTierAmount(e.target.value)}
              className="border p-2 rounded-md flex-1"
            />
            <TransactionButton
              transaction={() =>
                prepareContractCall({
                  contract: contract,
                  method: "function addTier(string memory _name, uint256 _amount)",
                  params: [newTierName, BigInt(newTierAmount || "0")],
                })
              }
              onError={(error) => alert(`Error: ${error.message}`)}
              onTransactionConfirmed={async () => {
                alert("Tier added successfully!");
                setNewTierName("");
                setNewTierAmount("");
                refetchTiers();
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              disabled={!newTierName || !newTierAmount}
            >
              Add Tier
            </TransactionButton>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiers &&
          tiers.map((tier, index) => (
            <TierCard
              key={index}
              tier={tier}
              index={index}
              contract={contract}
              isEditing={isEditing}
            />
          ))}
      </div>
    </main>
  );
} 