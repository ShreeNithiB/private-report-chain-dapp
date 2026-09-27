import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '@/config/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SubmitReportResponse {
  success: boolean;
  reportId: string;
  metadataCid: string;
  txHash: string;
  fileCid?: string;
  error?: string;
}

export interface ReportRecord {
  id: string;
  cidHash: string;           // metadata CID (used as tracking ID)
  fileCid?: string;
  txHash: string;
  title?: string;
  description: string;
  evidenceFilename?: string;
  status: 'pending' | 'submitted' | 'verified' | 'investigating' | 'resolved';
  isAuthentic: boolean;
  verificationConfidence: number;
  verificationRemarks: string;
  createdAt: string;
  updatedAt: string;
  // CID history for track view
  cidHistory?: Array<{ cid: string; timestamp: string; status: string; notes?: string }>;
}

export interface UpdateReportPayload {
  reportId: string;
  notes?: string;
  status?: string;
  file?: File;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useComplaint() {
  const [isUploading, setIsUploading]   = useState(false);
  const [isVerifying, setIsVerifying]   = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRelaying, setIsRelaying]     = useState(false);

  /**
   * Submit a new report.
   * Sends file + description to backend → IPFS → blockchain.
   * Returns real reportId, metadataCid, txHash from backend.
   */
  const submitReport = useCallback(async (
    file: File,
    description: string,
    title?: string
  ): Promise<SubmitReportResponse> => {
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    if (title) formData.append('title', title);

    try {
      console.log('[ReportChain] Submitting report to backend…');
      const response = await axios.post(API_ENDPOINTS.submitReport, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('[ReportChain] Backend response:', response.data);

      const data = response.data;
      return {
        success: true,
        reportId:    data.reportId    || data.id        || '',
        // GitHub repo backend returns metadataCID (capital CID)
        metadataCid: data.metadataCID || data.metadataCid || data.cid || '',
        txHash:      data.txHash      || data.tx_hash   || '',
        fileCid:     data.mediaCID    || data.fileCid   || '',
      };
    } catch (error: unknown) {
      console.error('[ReportChain] Submit error:', error);
      const axiosError = error as { response?: { data?: { error?: string; message?: string } }; message?: string };
      const msg = axiosError?.response?.data?.error
               || axiosError?.response?.data?.message
               || axiosError?.message
               || 'Submission failed';
      return { success: false, reportId: '', metadataCid: '', txHash: '', error: msg };
    } finally {
      setIsUploading(false);
    }
  }, []);

  /**
   * AI verification simulation — runs in parallel with the API call.
   * Purely UI-side; does NOT block backend submission.
   */
  const runAIAnimation = useCallback(async (durationMs = 2000): Promise<{
    isAuthentic: boolean;
    confidence: number;
    remarks: string;
    verificationHash: string;
  }> => {
    setIsVerifying(true);
    try {
      await new Promise(resolve => setTimeout(resolve, durationMs));
      const confidence = Math.floor(Math.random() * 30) + 70; // 70–99
      const isAuthentic = confidence > 75;
      return {
        isAuthentic,
        confidence,
        remarks: isAuthentic
          ? 'Evidence appears authentic based on AI analysis.'
          : 'Evidence requires manual review.',
        verificationHash: `0x${Array.from({ length: 40 }, () =>
          Math.floor(Math.random() * 16).toString(16)).join('')}`,
      };
    } finally {
      setIsVerifying(false);
    }
  }, []);

  /**
   * Simulate blockchain relay animation.
   * Real tx goes through backend; this is just UI feedback.
   */
  const simulateRelayAnimation = useCallback(async (durationMs = 1500): Promise<void> => {
    setIsRelaying(true);
    try {
      await new Promise(resolve => setTimeout(resolve, durationMs));
    } finally {
      setIsRelaying(false);
    }
  }, []);

  /**
   * Track a report by its ID (reportId OR metadataCid).
   * GET /report/:id
   */
  const trackComplaint = useCallback(async (id: string): Promise<ReportRecord> => {
    setIsSubmitting(true);
    try {
      console.log('[ReportChain] Tracking report:', id);
      const response = await axios.get(API_ENDPOINTS.getReport(id));
      console.log('[ReportChain] Track response:', response.data);

      const d = response.data;

      // GitHub repo backend returns:
      // { success, reportId, history: [{ cid, updatedBy, timestamp }] }
      const history: Array<{ cid: string; updatedBy: string; timestamp: number }>
        = d.history || [];

      // The latest CID is the last entry in history
      const latestCid = history.length > 0 ? history[history.length - 1].cid : id;
      const latestTimestamp = history.length > 0
        ? new Date(history[history.length - 1].timestamp * 1000).toISOString()
        : new Date().toISOString();

      const record: ReportRecord = {
        id:                     d.reportId || id,
        cidHash:                latestCid,
        fileCid:                undefined,
        txHash:                 '',
        title:                  'Report ' + (d.reportId || id),
        description:            '',
        evidenceFilename:       '',
        status:                 'submitted',
        isAuthentic:            true,
        verificationConfidence: 80,
        verificationRemarks:    'Blockchain-verified CID history retrieved.',
        createdAt:              history.length > 0
          ? new Date(history[0].timestamp * 1000).toISOString()
          : new Date().toISOString(),
        updatedAt:              latestTimestamp,
        // Map the on-chain history to our cidHistory format
        cidHistory: history.map((h, idx) => ({
          cid:       h.cid,
          timestamp: new Date(h.timestamp * 1000).toISOString(),
          status:    idx === 0 ? 'submitted' : 'updated',
          notes:     `Updated by: ${h.updatedBy}`,
        })),
      };

      return record;
    } catch (error: unknown) {
      console.error('[ReportChain] Track error:', error);
      const axiosError = error as { response?: { status?: number }; message?: string };
      if (axiosError?.response?.status === 404) {
        throw new Error('No report found with this ID. Please check and try again.');
      }
      throw new Error(axiosError?.message || 'Failed to fetch report.');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  /**
   * Update a report (police/admin).
   * POST /update-report
   */
  const updateReport = useCallback(async (payload: UpdateReportPayload): Promise<{
    success: boolean;
    newCid?: string;
    prevCid?: string;
    txHash?: string;
    error?: string;
  }> => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('reportId', payload.reportId);
      if (payload.notes)  formData.append('notes',  payload.notes);
      if (payload.status) formData.append('status', payload.status);
      if (payload.file)   formData.append('file',   payload.file);

      console.log('[ReportChain] Updating report:', payload.reportId);
      const response = await axios.post(API_ENDPOINTS.updateReport, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('[ReportChain] Update response:', response.data);
      const d = response.data;
      return {
        success: true,
        // GitHub repo backend returns newCID (capital CID)
        newCid:  d.newCID  || d.newCid   || d.metadataCID || '',
        prevCid: d.prevCid || d.prev_cid || '',
        txHash:  d.txHash  || d.tx_hash  || '',
      };
    } catch (error: unknown) {
      console.error('[ReportChain] Update error:', error);
      const axiosError = error as { response?: { data?: { error?: string } }; message?: string };
      return {
        success: false,
        error: axiosError?.response?.data?.error || axiosError?.message || 'Update failed',
      };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  /**
   * Fetch all reports (for admin dashboard).
   * GET /reports
   */
  const getAllReports = useCallback(async (): Promise<ReportRecord[]> => {
    try {
      console.log('[ReportChain] Fetching all reports…');
      const response = await axios.get(API_ENDPOINTS.getAllReports);
      console.log('[ReportChain] All reports:', response.data);

      const list = Array.isArray(response.data)
        ? response.data
        : response.data?.reports ?? [];

      return list.map((d: Record<string, unknown>) => ({
        id:                    (d.id            || d.reportId     || '') as string,
        cidHash:               (d.metadataCid   || d.cidHash      || d.cid || '') as string,
        fileCid:               (d.fileCid       || d.file_cid     || '') as string,
        txHash:                (d.txHash        || d.tx_hash      || '') as string,
        title:                 (d.title         || 'Report') as string,
        description:           (d.description   || '') as string,
        evidenceFilename:      (d.evidenceFilename || d.filename  || '') as string,
        status:                (d.status        || 'submitted') as ReportRecord['status'],
        isAuthentic:           (d.isAuthentic   ?? d.is_authentic ?? true) as boolean,
        verificationConfidence: (d.verificationConfidence ?? d.confidence ?? 80) as number,
        verificationRemarks:   (d.verificationRemarks   || d.remarks || '') as string,
        createdAt:             (d.createdAt     || d.created_at  || new Date().toISOString()) as string,
        updatedAt:             (d.updatedAt     || d.updated_at  || new Date().toISOString()) as string,
        cidHistory:            (d.cidHistory    || []) as ReportRecord['cidHistory'],
      }));
    } catch (error) {
      console.error('[ReportChain] getAllReports error:', error);
      return [];
    }
  }, []);

  return {
    // State
    isUploading,
    isVerifying,
    isSubmitting,
    isRelaying,
    isProcessing: isUploading || isVerifying || isSubmitting || isRelaying,
    // Actions
    submitReport,
    runAIAnimation,
    simulateRelayAnimation,
    trackComplaint,
    updateReport,
    getAllReports,
  };
}
