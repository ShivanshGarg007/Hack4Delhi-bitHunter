import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link2, Shield, AlertTriangle, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LedgerDashboard = () => {
  const [blocks, setBlocks] = useState([]);
  const [stats, setStats] = useState(null);
  const [verifyStatus, setVerifyStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    shop_id: 'SHOP001', dealer_id: 'DEALER001', beneficiary_id: 'BEN001', item: 'Rice', quantity: 10
  });

  const fetchLedger = useCallback(async () => {
    try {
      const [ledgerRes, statsRes] = await Promise.all([
        axios.get(`${API}/ledger/blocks`),
        axios.get(`${API}/ledger/stats`)
      ]);
      setBlocks(ledgerRes.data.blocks || []);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to load ledger data');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchLedger(); }, [fetchLedger]);

  const verifyLedger = async () => {
    try {
      const response = await axios.get(`${API}/ledger/verify`);
      setVerifyStatus(response.data);
      if (response.data.status === 'SAFE') toast.success('Blockchain verified: No tampering detected');
      else toast.error(`Tampering detected at block #${response.data.tampered_block}`);
    } catch (error) { toast.error('Verification failed'); }
  };

  const addTransaction = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/ledger/transaction`, newTransaction);
      toast.success('Transaction added to blockchain');
      setShowAddForm(false);
      fetchLedger();
    } catch (error) { toast.error('Failed to add transaction'); }
  };

  const simulateTamper = async () => {
    if (!window.confirm('This will simulate tampering with the blockchain. Continue?')) return;
    try {
      const response = await axios.post(`${API}/ledger/simulate-tamper`);
      toast.warning(response.data.message);
      setVerifyStatus(null);
    } catch (error) { console.error(error); }
  };

  const resetLedger = async () => {
    if (!window.confirm('This will reset the entire blockchain to genesis. Continue?')) return;
    try {
      await axios.post(`${API}/ledger/reset`);
      toast.success('Ledger reset to genesis block');
      fetchLedger(); setVerifyStatus(null);
    } catch (error) { console.error(error); }
  };

  if (loading) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <div className="animate-spin rounded-full" style={{ width: 32, height: 32, border: '3px solid #003087', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto' }}></div>
    </div>
  );

  return (
    <div style={{ padding: 24, background: '#F5F5F0', minHeight: '100%' }}>
      <div style={{ marginBottom: 16, borderBottom: '2px solid #FF6200', paddingBottom: 8 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#003087', fontFamily: 'Noto Serif, Georgia, serif', margin: 0 }}>
          PDS Ledger (Kawach)
        </h1>
        <div style={{ fontSize: 12, color: '#666', marginTop: 3 }}>
          Tamper-proof blockchain for Public Distribution System transactions
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Blocks', value: stats?.total_blocks || 0, color: '#003087' },
          { label: 'Transactions', value: stats?.total_transactions || 0, color: '#6a0dad' },
          { label: 'Unique Shops', value: stats?.unique_shops || 0, color: '#e67e22' },
          {
            label: 'Chain Status',
            value: verifyStatus?.status === 'SAFE' ? 'SECURE' : verifyStatus?.status === 'COMPROMISED' ? 'TAMPERED' : 'PENDING',
            color: verifyStatus?.status === 'SAFE' ? '#27ae60' : verifyStatus?.status === 'COMPROMISED' ? '#c0392b' : '#888'
          },
        ].map((stat, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #ccc', borderTop: `3px solid ${stat.color}`, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{stat.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button onClick={verifyLedger} className="gov-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Shield style={{ width: 13, height: 13 }} /> Verify Ledger
        </button>
        <button onClick={() => setShowAddForm(!showAddForm)} className="gov-btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Plus style={{ width: 13, height: 13 }} /> Add Transaction
        </button>
        <button onClick={simulateTamper} style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#fff', color: '#e67e22', border: '1px solid #e67e22', padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', borderRadius: 2 }}>
          <AlertTriangle style={{ width: 13, height: 13 }} /> Simulate Tamper
        </button>
        <button onClick={resetLedger} style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#fff', color: '#c0392b', border: '1px solid #c0392b', padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', borderRadius: 2 }}>
          <Trash2 style={{ width: 13, height: 13 }} /> Reset Ledger
        </button>
      </div>

      {/* Add Transaction Form */}
      {showAddForm && (
        <div style={{ background: '#fff', border: '1px solid #ccc', borderTop: '3px solid #003087', marginBottom: 16 }}>
          <div style={{ background: '#003087', padding: '8px 14px' }}>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>Add New Transaction</span>
          </div>
          <div style={{ padding: 16 }}>
            <form onSubmit={addTransaction}>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { id: 'shop_id', label: 'Shop ID', key: 'shop_id' },
                  { id: 'dealer_id', label: 'Dealer ID', key: 'dealer_id' },
                  { id: 'beneficiary_id', label: 'Beneficiary ID', key: 'beneficiary_id' },
                ].map(field => (
                  <div key={field.id}>
                    <label className="gov-label">{field.label}</label>
                    <input id={field.id} value={newTransaction[field.key]}
                      onChange={e => setNewTransaction({ ...newTransaction, [field.key]: e.target.value })}
                      required className="gov-input" />
                  </div>
                ))}
                <div>
                  <label className="gov-label">Item</label>
                  <select value={newTransaction.item} onChange={e => setNewTransaction({ ...newTransaction, item: e.target.value })} className="gov-select" style={{ width: '100%' }}>
                    {['Rice', 'Wheat', 'Sugar', 'Pulses', 'Oil'].map(item => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                <div>
                  <label className="gov-label">Quantity (kg)</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input type="number" value={newTransaction.quantity}
                      onChange={e => setNewTransaction({ ...newTransaction, quantity: parseFloat(e.target.value) })}
                      required min="1" className="gov-input" />
                    <button type="submit" className="gov-btn-primary" style={{ whiteSpace: 'nowrap' }}>Add</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ledger Table */}
      <div style={{ background: '#fff', border: '1px solid #ccc', borderTop: '3px solid #003087' }}>
        <div style={{ background: '#003087', padding: '8px 14px' }}>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>Transaction Ledger — Blockchain Records</span>
        </div>
        <div style={{ padding: 14, overflowX: 'auto' }}>
          <table className="gov-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Block #</th>
                <th>Shop ID</th>
                <th>Beneficiary</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Timestamp</th>
                <th>Hash (truncated)</th>
              </tr>
            </thead>
            <tbody>
              {blocks.map(block => (
                <tr key={block.index}>
                  <td style={{ fontWeight: 700, color: '#003087' }}>{block.index}</td>
                  <td>{block.transaction?.shop_id}</td>
                  <td>{block.transaction?.beneficiary_id}</td>
                  <td>{block.transaction?.item}</td>
                  <td>{block.transaction?.quantity} kg</td>
                  <td style={{ fontSize: 11, color: '#888' }}>{new Date(block.timestamp).toLocaleString()}</td>
                  <td style={{ fontFamily: 'Courier New, monospace', fontSize: 11, color: '#888' }}>{block.hash?.substring(0, 16)}...</td>
                </tr>
              ))}
            </tbody>
          </table>
          {blocks.length === 0 && <div style={{ textAlign: 'center', padding: 24, color: '#888', fontSize: 13 }}>No transactions recorded yet.</div>}
        </div>
      </div>
    </div>
  );
};

export default LedgerDashboard;
