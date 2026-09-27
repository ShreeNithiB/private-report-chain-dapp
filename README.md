# DecentraReport – Blockchain Verified Anonymous Reporting System

DecentraReport is a decentralized application (DApp) designed for secure, anonymous, and tamper-proof complaint reporting. It leverages **IPFS** for immutable evidence storage and **Ethereum Sepolia** for a verifiable audit trail of reports.

## 🚀 Overview

This platform allows users to submit complaints with media evidence without needing a Web3 wallet. A gasless relayer backend handles the blockchain interactions, while an AI verification system ensures evidence authenticity.

### Key Features
-   **Anonymous Reporting**: Submit complaints without revealing your identity.
-   **Blockchain Integrity**: All reports and updates are hashed and stored on-chain.
-   **Immutable Storage**: Evidence is pinned to IPFS via Pinata.
-   **AI Verification**: Automated analysis of evidence for authenticity.
-   **Admin Portal**: Secure status updates and investigation management by authorized officers.

---

## 📂 Project Structure

```text
report-dapp/
├── frontend/             # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/   # UI & Layout components
│   │   ├── hooks/        # Custom React hooks (useComplaint, etc.)
│   │   ├── pages/        # Dashboard, Report, Track, e-Sakshya
│   │   └── config/       # API and Web3 configuration
│   └── public/           # Static assets
└── backend/              # Node.js + Express Relayer
    ├── contracts/        # Solidity Smart Contracts
    ├── ReportChain.json  # Contract ABI
    ├── server.js         # Express API & Ethers.js logic
    └── .env              # Environment variables
```

---

## 🛠️ Technology Stack

-   **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Shadcn UI.
-   **Backend**: Node.js, Express, Ethers.js.
-   **Blockchain**: Solidity, Ethereum Sepolia Testnet.
-   **Storage**: IPFS (Pinata).
-   **Authentication**: Admin-only status updates.

---

## ⚙️ Setup Instructions

### 1. Smart Contract
The `ReportChain` contract is deployed at: `0x826B472E14698cF588118B749EB2A9DDF0F55aDF`.
The source code is available in `backend/contracts/ReportChain.sol`.

### 2. Backend Setup
Navigate to the `backend` folder and install dependencies:
```bash
npm install
```
Create a `.env` file with the following:
```env
PORT=3000
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_API_KEY=your_pinata_secret
RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_key
RELAYER_PRIVATE_KEY=your_wallet_private_key
CONTRACT_ADDRESS=0x826B472E14698cF588118B749EB2A9DDF0F55aDF
```
Start the server:
```bash
npm start
```

### 3. Frontend Setup
Navigate to the `frontend` folder and install dependencies:
```bash
npm install
```
Start the development server:
```bash
npm run dev
```

---

## 📜 License
This project is licensed under the MIT License.
