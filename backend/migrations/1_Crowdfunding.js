const Crowdfunding = artifacts.require("Crowdfunding");

module.exports = function (deployer, network, accounts) {
    const owner = accounts[0]; // Owner address
    const goal = web3.utils.toWei("10", "ether"); // Example goal
    const deadline = Math.floor(Date.now() / 1000) + 604800; // 7 days from now
    const minContribution = web3.utils.toWei("0.1", "ether");
    const maxContribution = web3.utils.toWei("5", "ether");

    deployer.deploy(Crowdfunding, owner, goal, deadline, minContribution, maxContribution);
};
