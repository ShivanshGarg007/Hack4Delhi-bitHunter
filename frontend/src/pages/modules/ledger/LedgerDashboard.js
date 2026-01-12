import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link2, Shield, AlertTriangle, CheckCircle2, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LedgerDashboard = () => {
  const [blocks, setBlocks] = useState([]);
  const [stats, setStats] = useState(null);
  const [verifyStatus, setVerifyStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    shop_id: 'SHOP001',
    dealer_id: 'DEALER001',
    beneficiary_id: 'BEN001',
    item: 'Rice',
    quantity: 10
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
      console.error('Failed to fetch ledger:', error);
      toast.error('Failed to load ledger data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLedger();
  }, [fetchLedger]);

  const verifyLedger = async () => {
    try {
      const response = await axios.get(`${API}/ledger/verify`);
      setVerifyStatus(response.data);
      if (response.data.status === 'SAFE') {
        toast.success('Blockchain verified: No tampering detected');
      } else {
        toast.error(`Tampering detected at block #${response.data.tampered_block}`);
      }
    } catch (error) {
      console.error('Verification failed:', error);
      toast.error('Verification failed');
    }
  };

  const addTransaction = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/ledger/transaction`, newTransaction);
      toast.success('Transaction added to blockchain');
      setShowAddForm(false);
      fetchLedger();
    } catch (error) {
      console.error('Failed to add transaction:', error);
      toast.error('Failed to add transaction');
    }
  };

  const simulateTamper = async () => {
    if (!window.confirm('This will simulate tampering with the blockchain. Continue?')) return;
    try {
      const response = await axios.post(`${API}/ledger/simulate-tamper`);
      toast.warning(response.data.message);
      setVerifyStatus(null);
    } catch (error) {
      console.error('Tamper simulation failed:', error);
    }
  };

  const resetLedger = async () => {
    if (!window.confirm('This will reset the entire blockchain to genesis. Continue?')) return;
    try {
      await axios.post(`${API}/ledger/reset`);
      toast.success('Ledger reset to genesis block');
      fetchLedger();
      setVerifyStatus(null);
    } catch (error) {
      console.error('Reset failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#71C9CE]"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">PDS Ledger (Kawach)</h1>
        <p className="text-slate-600">Tamper-proof blockchain for Public Distribution System transactions</p>
      </div>

      {/* Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Blocks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.total_blocks || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.total_transactions || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Unique Shops</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.unique_shops || 0}</p>
          </CardContent>
        </Card>

        <Card className={verifyStatus?.status === 'SAFE' ? 'border-green-300 bg-green-50' : verifyStatus?.status === 'COMPROMISED' ? 'border-red-300 bg-red-50' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Chain Status</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-2">
            {verifyStatus?.status === 'SAFE' ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <span className="text-xl font-bold text-green-600">SECURE</span>
              </>
            ) : verifyStatus?.status === 'COMPROMISED' ? (
              <>
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <span className="text-xl font-bold text-red-600">TAMPERED</span>
              </>
            ) : (
              <span className="text-xl font-bold text-slate-400">PENDING</span>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mb-8">
        <Button onClick={verifyLedger} className="bg-[#71C9CE] hover:bg-[#5fb8bd]">
          <Shield className="h-4 w-4 mr-2" />
          Verify Ledger
        </Button>
        
        <Button variant="outline" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>

        <Button variant="outline" onClick={simulateTamper} className="text-yellow-600 border-yellow-300 hover:bg-yellow-50">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Simulate Tamper
        </Button>

        <Button variant="outline" onClick={resetLedger} className="text-red-600 border-red-300 hover:bg-red-50">
          <Trash2 className="h-4 w-4 mr-2" />
          Reset Ledger
        </Button>
      </div>

      {/* Add Transaction Form */}
      {showAddForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Transaction</CardTitle>
            <CardDescription>Add a PDS distribution record to the blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={addTransaction} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="shop_id">Shop ID</Label>
                <Input
                  id="shop_id"
                  value={newTransaction.shop_id}
                  onChange={(e) => setNewTransaction({...newTransaction, shop_id: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dealer_id">Dealer ID</Label>
                <Input
                  id="dealer_id"
                  value={newTransaction.dealer_id}
                  onChange={(e) => setNewTransaction({...newTransaction, dealer_id: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="beneficiary_id">Beneficiary ID</Label>
                <Input
                  id="beneficiary_id"
                  value={newTransaction.beneficiary_id}
                  onChange={(e) => setNewTransaction({...newTransaction, beneficiary_id: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="item">Item</Label>
                <Select
                  value={newTransaction.item}
                  onValueChange={(value) => setNewTransaction({...newTransaction, item: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rice">Rice</SelectItem>
                    <SelectItem value="Wheat">Wheat</SelectItem>
                    <SelectItem value="Sugar">Sugar</SelectItem>
                    <SelectItem value="Pulses">Pulses</SelectItem>
                    <SelectItem value="Oil">Oil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">Quantity (kg)</Label>
                <div className="flex gap-2">
                  <Input
                    id="quantity"
                    type="number"
                    value={newTransaction.quantity}
                    onChange={(e) => setNewTransaction({...newTransaction, quantity: parseFloat(e.target.value)})}
                    required
                    min="1"
                  />
                  <Button type="submit" className="bg-[#71C9CE] hover:bg-[#5fb8bd]">Add</Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Transaction Ledger */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Ledger</CardTitle>
          <CardDescription>All PDS transactions recorded on the blockchain</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Block #</TableHead>
                <TableHead>Shop ID</TableHead>
                <TableHead>Beneficiary</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="w-48">Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blocks.map((block) => (
                <TableRow key={block.index}>
                  <TableCell className="font-medium">{block.index}</TableCell>
                  <TableCell>{block.transaction?.shop_id}</TableCell>
                  <TableCell>{block.transaction?.beneficiary_id}</TableCell>
                  <TableCell>{block.transaction?.item}</TableCell>
                  <TableCell>{block.transaction?.quantity} kg</TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {new Date(block.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-400">
                    {block.hash?.substring(0, 16)}...
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LedgerDashboard;
