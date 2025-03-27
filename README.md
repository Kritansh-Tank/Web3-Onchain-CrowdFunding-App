## Web3 Onchain CrowdFunding App

#### This project was developed as part of our **Project-Based Learning (PBL)** for the subject **Blockchain and Digital Currency (BDC)**. Our team of four collaborated to build a blockchain-based solution inspired by the concepts covered in our coursework.

## Features
- **Smart Contract Implementation**: Developed using Solidity and deployed on a local blockchain.
- **Decentralized Transactions**: Ensures secure and transparent transactions.
- **Next.js Frontend**: A fast and modern frontend using Next.js with TypeScript.
- **Thirdweb Integration**: Simplifies blockchain interactions with Thirdweb SDK.
- **Tailwind CSS Styling**: Provides a responsive and clean UI.
- **Local Blockchain Testing**: Truffle and Ganache used for smart contract testing.
- **Deployment on Vercel**: Hosted frontend on Vercel for easy access.

## Smart Contracts
This project consists of two Solidity smart contracts:

### Crowdfunding.sol
- Implements an individual crowdfunding campaign.
- **Features:**
  - Campaign name, description, goal, and deadline.
  - Tracks contributions and backers.
  - Supports funding tiers (different levels of contributions).
  - Campaign states: Active, Successful, Failed.
  - Includes `paused` functionality to halt transactions if needed.

### CrowdfundingFactory.sol
- A factory contract to create and manage multiple crowdfunding campaigns.
- **Features:**
  - Allows users to deploy new **Crowdfunding** contracts.
  - Stores campaign details (name, owner, creation time).
  - Maps campaigns to their owners.
  - Includes `paused` functionality to disable new campaign creation.

## Technologies Used
### Backend
- **Solidity** - Smart contract development
- **Remix IDE** - Smart contract writing and testing
- **Truffle** - Smart contract testing framework
- **Ganache** - Local Ethereum blockchain for testing
- **Localhost** - Backend testing environment

### Frontend
- **Next.js** - React framework for building the UI
- **TypeScript** - Strongly typed JavaScript for better maintainability
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Thirdweb** - Web3 SDK for blockchain interactions
- **Vercel** - Deployment

## Team Members
1. [Kritansh Tank](https://github.com/Kritansh-Tank) - PRN: 2143110058, Roll No: 07 
2. [Ujjwal Singh](https://github.com/Kritansh-Tank) - PRN: 2143110035, Roll No: 08
3. [Mitali Chaudhari](https://github.com/Kritansh-Tank) - PRN: 2143110046, Roll No: 09
4. [Rohan Singh](https://github.com/Kritansh-Tank) - PRN: 2143110044, Roll No: 10

## Demo

- **Login Page**

![Login Page](https://drive.google.com/uc?id=1EAaQqMpIkM4ww7UW6KDuuWl3I_pZCvxV)


- **Home Page**

![Home Page](https://drive.google.com/uc?id=1uGr1FmgKbQ6ojLCLfbXRMWgpjrBSyrKi)


- **Campaign Details & Funding Tiers**

![Campaign Details & Funding Tiers](https://drive.google.com/uc?id=1eqDmKlU1gdCJLa6NawxcPnrULoK35tNQ)


- **Dashboard**

![Dashboard](https://drive.google.com/uc?id=1_jLxLjD5ySkbv4ruSLA7rPJmR2twDxmB)


- **Create New Campaign**

![Create New Campaign](https://drive.google.com/uc?id=1vgwEYRMt2VtXZ1b3mmDuAEAJpoL96t2G)
