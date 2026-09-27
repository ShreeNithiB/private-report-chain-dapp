# DecentraReport Frontend

The frontend of **DecentraReport**, a decentralized, anonymous complaint reporting system. Built with **React**, **Vite**, and **Tailwind CSS**, it provides a modern, high-performance interface for submitting and tracking reports on the blockchain.

## 🌟 Key Features

-   **Anonymous Submission**: Multi-step reporting flow with evidence upload.
-   **Blockchain Tracking**: Real-time status retrieval from Ethereum Sepolia.
-   **AI Verification Insights**: Visual feedback from automated evidence analysis.
-   **Admin Dashboard**: Secure management interface for authorized officers.
-   **Modern UI/UX**: Dark-themed, glassmorphic design using **Shadcn UI** and **Framer Motion**.
-   **Web3 Integrated**: Connect wallet support for administrative functions and secure relaying.

## 🛠️ Tech Stack

-   **Core**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Components**: [Shadcn UI](https://ui.shadcn.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Web3**: [Ethers.js](https://docs.ethers.org/v6/), [Wagmi](https://wagmi.sh/)
-   **Networking**: [Axios](https://axios-http.com/)

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18.x or later) and **npm** installed.

### 2. Installation
Navigate to the `frontend` directory and install dependencies:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the `frontend` root:
```env
VITE_API_BASE=http://localhost:3000
```
This points to the **DecentraReport Backend** relayer.

### 4. Run Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:8080/`.

## 🏗️ Building for Production
To create an optimized production build:
```bash
npm run build
```
The output will be in the `dist/` folder.

## 📜 License
This project is licensed under the MIT License.
