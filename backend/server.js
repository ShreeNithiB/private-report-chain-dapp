// ReportChain Backend — Node.js + Express
// Matches the format from: https://github.com/ShreeNithiB/private-report-chain-dapp/tree/main/ReportChain
//
// Contract functions:
//   createReport(reportId, metadataCID)
//   updateReport(reportId, newCID)         — only registered police
//   getCIDHistory(reportId)                — returns CIDVersion[] from chain
//   addPolice(address)                     — admin only
//   isRegisteredPolice(address)
//
// API Endpoints:
//   POST /submit-report   — upload file + metadata to IPFS, store CID on-chain
//   POST /update-report   — add new CID version on-chain (police)
//   GET  /report/:id      — get full CID audit trail from blockchain
//   GET  /health          — health check

const express         = require('express');
const cors            = require('cors');
const multer          = require('multer');
const { ethers }      = require('ethers');
const axios           = require('axios');
const FormData        = require('form-data');
const fs              = require('fs');
const path            = require('path');
const ContractArtifact = require('./ReportChain.json');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ─── Multer: disk storage (matches GitHub repo) ────────────────────────────────
const upload = multer({ dest: 'uploads/' });

// ─── ENV ──────────────────────────────────────────────────────────────────────
const PINATA_API_KEY        = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;
const RPC_URL               = process.env.RPC_URL        || 'https://rpc.ankr.com/eth_sepolia';
const CONTRACT_ADDRESS      = process.env.CONTRACT_ADDRESS;
const PORT                  = process.env.PORT || 3000;

// ─── Normalize private key (strip whitespace/quotes, ensure 0x prefix) ────────
let rawKey = (process.env.RELAYER_PRIVATE_KEY || process.env.PRIVATE_KEY || '').trim();
rawKey = rawKey.replace(/^['"]|['"]$/g, '');

const provider = new ethers.JsonRpcProvider(RPC_URL);
let wallet;
let PRIVATE_KEY = '';

if (rawKey && rawKey.length >= 32) {
  PRIVATE_KEY = rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`;
  try {
    wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  } catch (e) {
    console.warn('⚠️ Invalid RELAYER_PRIVATE_KEY, using generated random wallet for runtime.');
    wallet = ethers.Wallet.createRandom().connect(provider);
    PRIVATE_KEY = wallet.privateKey;
  }
} else {
  wallet = ethers.Wallet.createRandom().connect(provider);
  PRIVATE_KEY = wallet.privateKey;
}

const contract = CONTRACT_ADDRESS ? new ethers.Contract(CONTRACT_ADDRESS, ContractArtifact.abi, wallet) : null;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Upload a file from disk to Pinata IPFS.
 * Returns the CID (IpfsHash) string.
 */
async function uploadToIPFS(filePath, fileName) {
  const data = new FormData();
  data.append('file', fs.createReadStream(filePath), { filepath: fileName });

  const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
    maxBodyLength: 'Infinity',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      pinata_api_key:        PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    },
  });
  return res.data.IpfsHash;
}

/**
 * Upload a JSON metadata object to Pinata IPFS.
 * Returns the CID string.
 */
async function uploadMetadataToIPFS(metadata) {
  const res = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
    headers: {
      'Content-Type':        'application/json',
      pinata_api_key:        PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    },
  });
  return res.data.IpfsHash;
}

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * POST /submit-report
 * Body: multipart/form-data { file (required), description (required) }
 * Response: { success, reportId, metadataCID, txHash }
 */
app.post('/submit-report', upload.single('file'), async (req, res) => {
  try {
    const { description, reportId: customReportId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'File evidence is required' });
    }
    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    console.log('[/submit-report] Uploading file to IPFS...');
    const mediaCID = await uploadToIPFS(file.path, file.originalname);
    console.log('[/submit-report] File CID:', mediaCID);

    // Use custom reportId if provided (useful for tests/custom IDs), else generate
    const reportId = customReportId || `rep_${Date.now()}`;

    const metadata = {
      reportId,
      description,
      mediaCID,
      evidenceFilename: file.originalname,
      timestamp: Date.now(),
      status: 'Submitted',
    };

    console.log('[/submit-report] Uploading metadata to IPFS...');
    const metadataCID = await uploadMetadataToIPFS(metadata);
    console.log('[/submit-report] Metadata CID:', metadataCID);

    console.log('[/submit-report] Calling Smart Contract createReport...');
    const tx = await contract.createReport(reportId, metadataCID);
    console.log('[/submit-report] Waiting for confirmation...');
    const receipt = await tx.wait();
    console.log('[/submit-report] TX confirmed:', receipt.hash);

    res.json({
      success:     true,
      reportId,
      metadataCID,
      txHash:      receipt.hash,
    });
  } catch (error) {
    const errMsg = error.reason || error.shortMessage || error.message || 'Failed to submit report';
    console.error('[/submit-report] Error:', errMsg);
    res.status(500).json({ error: errMsg });
  } finally {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
});

/**
 * POST /update-report
 * Body: multipart/form-data { reportId, description, previousCID?, file? }
 * Response: { success, newCID, txHash }
 */
app.post('/update-report', upload.single('file'), async (req, res) => {
  try {
    const { reportId, description, previousCID, status, notes } = req.body;
    const file = req.file;

    if (!reportId) {
      return res.status(400).json({ error: 'reportId is required' });
    }

    let mediaCID = null;

    if (file) {
      console.log('[/update-report] Uploading new file to IPFS...');
      mediaCID = await uploadToIPFS(file.path, file.originalname);
      console.log('[/update-report] New file CID:', mediaCID);
    }

    const metadata = {
      reportId,
      description:  description || notes || '',
      mediaCID:     mediaCID || 'Previous media retained',
      timestamp:    Date.now(),
      status:       status || 'Updated by Police',
      previousCID:  previousCID || '',
    };

    console.log('[/update-report] Uploading new metadata to IPFS...');
    const newMetadataCID = await uploadMetadataToIPFS(metadata);
    console.log('[/update-report] New Metadata CID:', newMetadataCID);

    console.log('[/update-report] Calling Smart Contract updateReport...');
    const tx = await contract.updateReport(reportId, newMetadataCID);
    console.log('[/update-report] Waiting for confirmation...');
    const receipt = await tx.wait();
    console.log('[/update-report] TX confirmed:', receipt.hash);

    res.json({
      success: true,
      newCID:  newMetadataCID,
      txHash:  receipt.hash,
    });
  } catch (error) {
    const errMsg = error.reason || error.shortMessage || error.message || 'Failed to update report';
    console.error('[/update-report] Error:', errMsg);
    res.status(500).json({ error: errMsg });
  } finally {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
});

/**
 * GET /reports
 * Fetches all reports by querying 'ReportCreated' events from the blockchain.
 * Response: { success, reports: [{ reportId, metadataCID, creator, timestamp }] }
 */
app.get('/reports', async (req, res) => {
  try {
    console.log('[/reports] Querying blockchain events...');
    
    let events = [];
    if (contract) {
      try {
        const filter = contract.filters.ReportCreated();
        const currentBlock = await provider.getBlockNumber();
        const fromBlock = Math.max(0, currentBlock - 50000);
        events = await contract.queryFilter(filter, fromBlock);
      } catch (e) {
        console.warn('[/reports] Blockchain event query warning:', e.message);
      }
    }

    console.log(`[/reports] Found ${events.length} reports on-chain.`);

    // Map events to a cleaner format
    // Each event 'item' has .args = { reportId, initialCID, creator }
    // We also get the block timestamp for each event
    const reports = await Promise.all(events.map(async (event) => {
      const block = await event.getBlock();
      return {
        id:          event.args.reportId,
        reportId:    event.args.reportId,
        metadataCid: event.args.initialCID,
        cid:         event.args.initialCID, // metadata CID
        creator:     event.args.creator,
        timestamp:   block.timestamp * 1000, // ms
        createdAt:   new Date(block.timestamp * 1000).toISOString(),
        status:      'submitted', // Default status
      };
    }));

    res.json({
      success: true,
      reports: reports,
    });
  } catch (error) {
    console.error('[/reports] Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch reports from blockchain events' });
  }
});

/**
 * GET /report/:id
 * Fetches the complete immutable CID audit trail from the blockchain.
 * Response: { success, reportId, history: [{ cid, updatedBy, timestamp }] }
 */
app.get('/report/:id', async (req, res) => {
  try {
    const reportId = req.params.id;
    console.log('[/report/:id] Fetching CID history for:', reportId);

    const history = await contract.getCIDHistory(reportId);

    // Ethers v6 returns struct arrays as Proxy — manually map to plain objects
    const formattedHistory = history.map(item => ({
      cid:       item.cid,
      updatedBy: item.updatedBy,
      timestamp: Number(item.timestamp),
    }));

    console.log('[/report/:id] Found', formattedHistory.length, 'CID versions');

    res.json({
      success:  true,
      reportId,
      history:  formattedHistory,
    });
  } catch (error) {
    console.error('[/report/:id] Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch report history from blockchain' });
  }
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status:    'ok',
    timestamp: new Date().toISOString(),
    pinata:    PINATA_API_KEY ? '✅ configured' : '⚠️  missing',
    blockchain: PRIVATE_KEY && CONTRACT_ADDRESS ? '✅ configured' : '⚠️  missing',
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 ReportChain backend running on http://localhost:${PORT}`);
  console.log(`   Pinata:     ${PINATA_API_KEY ? '✅ configured' : '⚠️  missing PINATA_API_KEY'}`);
  console.log(`   Blockchain: ${PRIVATE_KEY && CONTRACT_ADDRESS ? '✅ configured' : '⚠️  missing RELAYER_PRIVATE_KEY or CONTRACT_ADDRESS'}`);
  console.log(`   RPC:        ${RPC_URL}\n`);
});
