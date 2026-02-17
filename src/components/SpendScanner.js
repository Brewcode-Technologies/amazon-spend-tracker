'use client';

import { useState, useEffect } from 'react';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { FiCalendar, FiBox, FiLock, FiUploadCloud, FiTrash2, FiFolder, FiCheckCircle, FiPlus, FiX, FiFile, FiEdit3 } from 'react-icons/fi';
import { parseTransactions } from '../utils/amazonParser';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function SpendScanner() {
  const [text, setText] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [currencyRate, setCurrencyRate] = useState(0.012);
  const [dragActive, setDragActive] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showPrintView, setShowPrintView] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [filter, setFilter] = useState('all');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isScanned, setIsScanned] = useState(false);
  const [pastedText, setPastedText] = useState('');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('amazonTransactions');
    const savedText = localStorage.getItem('amazonText');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert date strings back to Date objects
      const withDates = parsed.map(t => ({
        ...t,
        date: t.date ? new Date(t.date) : null
      }));
      setTransactions(withDates);
    }
    if (savedText) setText(savedText);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('amazonTransactions', JSON.stringify(transactions));
      localStorage.setItem('amazonText', text);
    }
  }, [transactions, text]);

  function handleScan() {
    setError('');
    setTransactions([]);

    if (uploadedFiles.length === 0 && !pastedText.trim()) {
      showToast('Please upload files or paste transaction data', 'error');
      return;
    }

    let allTxns = [];
    
    uploadedFiles.forEach(file => {
      const txns = parseTransactions(file.content);
      console.log(`Parsed ${txns.length} transactions from ${file.name}:`, txns);
      allTxns = [...allTxns, ...txns];
    });
    
    if (pastedText.trim()) {
      const txns = parseTransactions(pastedText);
      console.log(`Parsed ${txns.length} transactions from pasted text:`, txns);
      allTxns = [...allTxns, ...txns];
    }

    console.log('All transactions:', allTxns);
    console.log('Transaction types:', {
      debit: allTxns.filter(t => t.type === 'debit').length,
      credit: allTxns.filter(t => t.type === 'credit').length,
      cancelled: allTxns.filter(t => t.type === 'cancelled').length,
      refunded_order: allTxns.filter(t => t.type === 'refunded_order').length
    });

    if (allTxns.length === 0) {
      showToast('No transactions found', 'error');
      return;
    }

    const orderIds = allTxns.map(t => t.order).filter(Boolean);
    const duplicates = orderIds.filter((id, idx) => orderIds.indexOf(id) !== idx);
    if (duplicates.length > 0) {
      setError(`Warning: ${duplicates.length} duplicate order(s) detected.`);
    }

    setTransactions(allTxns);
    setIsScanned(true);
    showToast(`${allTxns.length} transactions scanned!`, 'success');
    triggerConfetti();
  }

  function showToast(message, type = 'success') {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  }

  function triggerConfetti() {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  }
  
  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(Array.from(e.dataTransfer.files));
    }
  }

  function handleFileUpload(files) {
    if (uploadedFiles.length + files.length > 10) {
      showToast('Maximum 10 files allowed', 'error');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target.result;
        setUploadedFiles(prev => [...prev, {
          id: Date.now() + Math.random(),
          name: file.name,
          content: content,
          size: file.size
        }]);
        showToast(`${file.name} added`, 'success');
      };
      reader.readAsText(file);
    });
    setIsScanned(false);
  }

  function removeFile(id) {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
    setIsScanned(false);
    setTransactions([]);
  }

  function loadSampleData() {
    const sample = `Visa **0835-$11.98 Order #111-3433669-5709803 AMZN Mktp US December 28, 2025
Visa **0835-$19.99 Order #111-3433669-5709804 AMZN Mktp US December 18, 2025
Visa **0835+$15.00 Refund Order #111-3433669-5709805 AMZN Mktp US December 17, 2025
Visa **0835-$72.74 Order #111-5802401-5988231 AMAZON RETAIL December 15, 2025
Visa **0835-$54.73 Order #111-8388537-4875428 AMZN Mktp US Cancelled December 13, 2025
Visa **0835-$21.09 Order #111-3925611-7949033 AMZN Mktp US December 10, 2025
Visa **0835-$46.00 Order #111-3446712-2942623 AMZN Mktp US December 12, 2025`;
    setUploadedFiles([{
      id: Date.now(),
      name: 'sample-data.txt',
      content: sample,
      size: sample.length
    }]);
    setIsScanned(false);
    showToast('Sample data loaded', 'success');
  }

  function clearData() {
    setUploadedFiles([]);
    setPastedText('');
    setTransactions([]);
    setError('');
    setIsScanned(false);
    localStorage.removeItem('amazonTransactions');
    localStorage.removeItem('amazonText');
    showToast('Cleared!', 'info');
  }

  function formatCurrency(amount, currencySymbol) {
    if (!currencySymbol) return amount.toFixed(2);
    
    // Normalize Rs to ₹ if passed in
    if (currencySymbol === 'Rs' || currencySymbol === 'Rs.') currencySymbol = '₹';
    
    // If INR
    if (currencySymbol === '₹' || currencySymbol === 'INR') {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount).replace('₹', '').trim(); // Remove symbol as we often display it separately or handle it
    }
    
    return amount.toFixed(2);
  }

// --- Analytics ---
  // Calculates net spend by subtracting refunds from debits
  
  const debits = transactions.filter(t => t.type === 'debit');
  const credits = transactions.filter(t => t.type === 'credit');
  const cancelled = transactions.filter(t => t.type === 'cancelled');
  const refundedOrders = transactions.filter(t => t.type === 'refunded_order');

  // Gross Spend includes normal debits + orders that were later refunded
  const grossSpend = debits.reduce((acc, t) => acc + t.amount, 0) + 
                     refundedOrders.reduce((acc, t) => acc + t.amount, 0);
  
  // Total Refunds includes standalone credits + refunded orders
  const totalRefunds = credits.reduce((acc, t) => acc + t.amount, 0) + 
                       refundedOrders.reduce((acc, t) => acc + t.amount, 0);

  const totalCancelled = cancelled.reduce((acc, t) => acc + t.amount, 0);
  
  const netSpend = grossSpend - totalRefunds;
  
  // Group by Month (Net Spend)
  const monthlyData = {};
  transactions.forEach(t => {
      const d = t.date;
      const key = d ? d.toLocaleString('default', { month: 'short', year: 'numeric' }) : 'Unknown Date';
      
      const amt = t.amount;
      if (t.type === 'debit') {
          monthlyData[key] = (monthlyData[key] || 0) + amt;
      } else if (t.type === 'credit') {
          monthlyData[key] = (monthlyData[key] || 0) - amt;
      } else if (t.type === 'refunded_order') {
          // Net effect is 0, so we don't add to monthly net logic? 
          // Or do we? gross += amt, refund += amt. Net += 0. 
          // So correctly, we do nothing for net chart.
          // But if we want to show volume, we might handle differently.
          // For Net Trend, do nothing.
      }
  });

  // Prepare Chart Data
  const displayCurrency = transactions.find(t => t.currency)?.currency || '$';
  
  const chartLabels = Object.keys(monthlyData);
  const chartValues = Object.values(monthlyData);
  
  const barData = {
    labels: chartLabels,
    datasets: [{
      label: `Net Monthly Spend (${displayCurrency})`,
      data: chartValues,
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
    }]
  };

  return (
    <section id="scanner" className={`min-h-[800px] py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6 bg-gray-900 border-t border-gray-800 relative`}
        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
    >
        {/* Confetti & Toast */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center">
             <div className="absolute top-1/4 animate-bounce">
                <FiCheckCircle className="text-9xl text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
             </div>
          </div>
        )}
        {toast.show && (
            <div className={`fixed top-20 sm:top-24 right-2 sm:right-4 z-50 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-lg border border-white/10 backdrop-blur-md text-white text-sm sm:text-base font-semibold ${toast.type === 'error' ? 'bg-red-500/80' : 'bg-green-500/80'}`}>
                {toast.message}
            </div>
        )}

        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 md:space-y-12">
            <div className="text-center space-y-2 sm:space-y-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                    Spend Scanner
                </h2>
                <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto px-2">
                    Securely parse your Amazon transaction history directly in your browser. <br className="hidden sm:block"/>
                    <span className="flex items-center justify-center gap-1 text-xs sm:text-sm mt-2 text-green-400"><FiLock className="text-green-400"/> 100% Local & Private</span>
                </p>
            </div>

            <div className="grid md:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
                {/* Input Section */}
                <div className="md:col-span-12 lg:col-span-5 space-y-3 sm:space-y-4">
                     {/* Paste Text Area */}
                     <div className="bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-700 space-y-3 sm:space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-200 flex items-center gap-2">
                          <FiEdit3 className="text-purple-400" size={18} />
                          Paste Transaction Data
                        </h3>
                        <textarea
                          className="w-full h-[120px] sm:h-[150px] p-3 sm:p-4 bg-gray-900/80 text-gray-200 rounded-lg sm:rounded-xl outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-[10px] sm:text-xs"
                          placeholder="Paste your Amazon transactions here...\n\nExample:\nVisa **0835-$11.98 Order #111-3433669-5709803 AMZN Mktp US December 28, 2025"
                          value={pastedText}
                          onChange={(e) => {
                            setPastedText(e.target.value);
                            setIsScanned(false);
                          }}
                        />
                     </div>

                     {/* Upload Files Section */}
                     <div className="bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-700 space-y-3 sm:space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-200 flex items-center gap-2">
                          <FiUploadCloud className="text-blue-400" size={18} />
                          Upload Files ({uploadedFiles.length}/10)
                        </h3>
                        
                        {/* File List */}
                        <div className="space-y-2 min-h-[150px] sm:min-h-[200px] max-h-[250px] sm:max-h-[300px] overflow-y-auto">
                          {uploadedFiles.map(file => (
                            <div key={file.id} className="flex items-center justify-between bg-gray-900/50 p-2 sm:p-3 rounded-lg border border-gray-700 group hover:border-blue-500/50 transition">
                              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                <FiFile className="text-blue-400 shrink-0" size={16} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs sm:text-sm text-gray-200 truncate">{file.name}</p>
                                  <p className="text-[10px] sm:text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                              </div>
                              <button
                                onClick={() => removeFile(file.id)}
                                className="p-1.5 sm:p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition shrink-0"
                                title="Remove file"
                              >
                                <FiX size={16} />
                              </button>
                            </div>
                          ))}
                          
                          {uploadedFiles.length === 0 && (
                            <div className="flex items-center justify-center h-[150px] sm:h-[200px] border-2 border-dashed border-gray-700 rounded-lg">
                              <p className="text-gray-500 text-xs sm:text-sm">No files uploaded yet</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Add File Button */}
                        {uploadedFiles.length < 10 && (
                          <label className="flex items-center justify-center gap-2 w-full py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm sm:text-base rounded-lg sm:rounded-xl cursor-pointer transition font-medium">
                            <FiPlus size={18} />
                            Add File
                            <input
                              type="file"
                              multiple
                              accept=".csv,.txt,.pdf"
                              onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                  handleFileUpload(Array.from(e.target.files));
                                  e.target.value = '';
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        )}
                     </div>

                     {/* Action Buttons */}
                     <div className="flex gap-2">
                        <button
                          onClick={handleScan}
                          disabled={uploadedFiles.length === 0 && !pastedText.trim()}
                          className="flex-1 py-2.5 sm:py-3 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm sm:text-base rounded-lg sm:rounded-xl font-bold transition flex items-center justify-center gap-2"
                        >
                          <FiCheckCircle size={18} />
                          Scan Data
                        </button>
                        
                        <button onClick={loadSampleData} className="px-3 sm:px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-mono" title="Load Sample Data">
                            Sample
                        </button>
                        <button onClick={clearData} className="px-3 sm:px-4 bg-red-900/50 hover:bg-red-900 text-red-200 rounded-lg sm:rounded-xl" title="Clear All">
                            <FiTrash2 size={18} />
                        </button>
                     </div>
                     {error && <div className="text-red-400 text-xs sm:text-sm bg-red-900/20 p-2 sm:p-3 rounded-lg border border-red-500/20">{error}</div>}
                </div>

                {/* Results Section */}
                <div className="md:col-span-12 lg:col-span-7 space-y-4 sm:space-y-6">
                    {transactions.length > 0 ? (
                        <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Big Stats */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                <div className="col-span-2 bg-gray-800/50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-700">
                                    <div className="text-gray-400 text-xs sm:text-sm mb-1">Net Spend</div>
                                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white break-all">{displayCurrency}{formatCurrency(netSpend, displayCurrency)}</div>
                                    {totalRefunds > 0 && <div className="text-[10px] sm:text-xs text-green-400 mt-1">Saved {displayCurrency}{formatCurrency(totalRefunds, displayCurrency)} in refunds</div>}
                                </div>
                                <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-700">
                                    <div className="text-gray-400 text-[10px] sm:text-xs mb-1">Refunds/Credits</div>
                                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-400 break-all">{displayCurrency}{formatCurrency(totalRefunds, displayCurrency)}</div>
                                </div>
                                <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-700">
                                    <div className="text-gray-400 text-[10px] sm:text-xs mb-1">Cancelled</div>
                                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-500 break-all">{displayCurrency}{formatCurrency(totalCancelled, displayCurrency)}</div>
                                </div>
                            </div>

                            {/* Charts Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {/* Bar Chart (Monthly Trend) */}
                                <div className="bg-gray-800/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-700 min-h-[200px] sm:min-h-[250px] flex flex-col items-center justify-center">
                                    <h3 className="text-gray-400 text-[10px] sm:text-xs uppercase mb-2">Monthly Net Trend</h3>
                                    {Object.keys(monthlyData).length > 0 ? 
                                        <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} /> 
                                        : <div className="text-gray-500 text-xs sm:text-sm">No data</div>
                                    }
                                </div>

                                {/* Pie Chart (Distribution) */}
                                <div className="bg-gray-800/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-700 min-h-[200px] sm:min-h-[250px] flex flex-col items-center justify-center">
                                     <h3 className="text-gray-400 text-[10px] sm:text-xs uppercase mb-2">Spend Distribution</h3>
                                     {Object.keys(monthlyData).length > 0 ? 
                                        <div className="w-[140px] sm:w-[180px]">
                                            <Pie data={{
                                                labels: chartLabels,
                                                datasets: [{
                                                    data: chartValues,
                                                    backgroundColor: [
                                                        'rgba(99, 102, 241, 0.8)',
                                                        'rgba(34, 197, 94, 0.8)',
                                                        'rgba(234, 179, 8, 0.8)',
                                                        'rgba(239, 68, 68, 0.8)',
                                                        'rgba(168, 85, 247, 0.8)',
                                                        'rgba(236, 72, 153, 0.8)',
                                                    ],
                                                    borderWidth: 0
                                                }]
                                            }} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                                        </div>
                                        : <div className="text-gray-500 text-xs sm:text-sm">No data</div>
                                     }
                                </div>
                            </div>
                            
{/* Transaction History & Filters */}
                            <div className="bg-gray-800/50 rounded-xl sm:rounded-2xl border border-gray-700 overflow-hidden flex flex-col">
                                <div className="px-3 sm:px-4 py-3 sm:py-4 border-b border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                                    <h3 className="text-sm sm:text-base font-semibold text-gray-200 shrink-0">Transaction History</h3>
                                    <div className="flex w-full sm:w-auto overflow-x-auto no-scrollbar bg-gray-900/50 p-1 rounded-lg gap-1">
                                        {['all', 'debit', 'credit', 'cancelled'].map(f => (
                                            <button
                                                key={f}
                                                onClick={() => setFilter(f)}
                                                className={`px-3 sm:px-4 py-1.5 rounded-md text-[10px] sm:text-xs font-medium capitalize transition whitespace-nowrap ${
                                                    filter === f 
                                                    ? 'bg-blue-600 text-white shadow-lg' 
                                                    : 'text-gray-400 hover:text-gray-200'
                                                }`}
                                            >
                                                {f === 'debit' ? 'Purchases' : f === 'credit' ? 'Refunds' : f}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="overflow-y-auto max-h-[400px] sm:max-h-[500px] divide-y divide-gray-700">
                                    {transactions
                                        .filter(t => {
                                            if (filter === 'all') return true;
                                            if (filter === 'credit') return t.type === 'credit' || t.type === 'refunded_order';
                                            return t.type === filter;
                                        })
                                        .map((t, i) => (
                                        <div key={i} className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2 hover:bg-gray-800/30 transition">
                                            <div className="flex-1 min-w-0 space-y-1">
                                                <div className="flex items-start justify-between sm:justify-start gap-2 sm:gap-3 flex-wrap">
                                                    <span className="text-xs sm:text-sm font-medium text-gray-200 line-clamp-2">{t.product}</span>
                                                    {t.type === 'refunded_order' && <span className="bg-orange-500/10 text-orange-400 text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full border border-orange-500/20 uppercase font-bold tracking-wider whitespace-nowrap">Refunded Order</span>}
                                                    {t.type === 'credit' && <span className="bg-green-500/10 text-green-400 text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full border border-green-500/20 uppercase font-bold tracking-wider whitespace-nowrap">Refund/Credit</span>}
                                                    {t.type === 'cancelled' && <span className="bg-gray-700 text-gray-400 text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full border border-gray-600 uppercase font-bold tracking-wider whitespace-nowrap">Cancelled</span>}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 text-[10px] sm:text-xs text-gray-500 font-mono">
                                                    <span className="flex items-center gap-1">
                                                        <FiCalendar className="text-gray-400" size={12} /> {t.date ? t.date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Date Unknown'}
                                                    </span>
                                                    {t.order && (
                                                        <span className="flex items-center gap-1 select-all truncate">
                                                            <FiBox className="text-blue-400/70" size={12} /> <span className="truncate">{t.order}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={`font-mono font-bold text-base sm:text-lg whitespace-nowrap ${
                                                t.type === 'credit' || t.type === 'refunded_order' ? 'text-green-400' : 
                                                t.type === 'cancelled' ? 'text-gray-600 line-through' :
                                                'text-white'
                                            }`}>
                                                {t.type === 'credit' ? '+' : ''}
                                                {t.type === 'refunded_order' ? 'Ref ' : ''}
                                                {t.currency || displayCurrency}{formatCurrency(t.amount, t.currency || displayCurrency)}
                                            </div>
                                        </div>
                                    ))}
                                    {transactions.length === 0 && (
                                        <div className="p-6 sm:p-8 text-center text-gray-500 text-sm">No transactions found</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-3 sm:space-y-4 border-2 border-dashed border-gray-800 rounded-2xl sm:rounded-3xl bg-gray-900/30 min-h-[300px] sm:min-h-[400px] p-4">
                            <FiFolder className="text-5xl sm:text-6xl text-gray-700" />
                            <p className="text-center text-xs sm:text-sm px-4">
                              {uploadedFiles.length === 0 && !pastedText.trim() ? 'Paste data or upload files, then click Scan' : 'Click "Scan Data" to analyze'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            
            {dragActive && (
                <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl sm:rounded-3xl border-4 border-blue-500 border-dashed">
                    <div className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">Drop file here!</div>
                </div>
            )}
        </div>
    </section>
  );
}
