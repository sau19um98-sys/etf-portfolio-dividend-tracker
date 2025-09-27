import { useState } from 'react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { etfData, formatCurrency } from '../../data/mockData';

const AddHoldingModal = ({ isOpen, onClose, onAddHolding }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedETF, setSelectedETF] = useState(null);
  const [shares, setShares] = useState('');
  const [avgPrice, setAvgPrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);

  // Filter ETFs based on search term
  const filteredETFs = etfData.filter(etf =>
    etf && 
    etf.id && 
    etf.name && 
    (etf.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     etf.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleETFSelect = (etf) => {
    if (etf && etf.price !== undefined) {
      setSelectedETF(etf);
      setAvgPrice(etf.price.toString());
    } else {
      console.error('Invalid ETF selected:', etf);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      console.log('Form submitted with:', { selectedETF, shares, avgPrice, purchaseDate });
      
      if (!selectedETF || !shares || !avgPrice) {
        alert('Please fill in all required fields');
        return;
      }

      const sharesNum = parseFloat(shares);
      const avgPriceNum = parseFloat(avgPrice);
      
      if (isNaN(sharesNum) || isNaN(avgPriceNum)) {
        alert('Please enter valid numbers for shares and price');
        return;
      }
      
      if (sharesNum <= 0 || avgPriceNum <= 0) {
        alert('Shares and average price must be positive numbers');
        return;
      }

      const newHolding = {
        id: selectedETF.id,
        symbol: selectedETF.id, // Use id as symbol since that's the ticker
        name: selectedETF.name,
        shares: sharesNum,
        avgPrice: avgPriceNum,
        costBasis: sharesNum * avgPriceNum,
        purchaseDate,
        sector: selectedETF.sector
      };

      console.log('Calling onAddHolding with:', newHolding);
      onAddHolding(newHolding);
      
      // Reset form
      setSelectedETF(null);
      setShares('');
      setAvgPrice('');
      setPurchaseDate(new Date().toISOString().split('T')[0]);
      setSearchTerm('');
      onClose();
    } catch (error) {
      console.error('Error in form submission:', error);
      alert('Error adding holding: ' + error.message);
    }
  };

  const handleClose = () => {
    setSelectedETF(null);
    setShares('');
    setAvgPrice('');
    setPurchaseDate(new Date().toISOString().split('T')[0]);
    setSearchTerm('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add New Holding
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ETF Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search ETF
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by symbol or name..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* ETF Search Results */}
              {searchTerm && (
                <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                  {filteredETFs.length > 0 ? (
                    filteredETFs.slice(0, 10).map((etf) => (
                      <button
                        key={etf.id}
                        type="button"
                        onClick={() => handleETFSelect(etf)}
                        className={`w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors ${
                          selectedETF?.id === etf.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {etf.id}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {etf.name}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {formatCurrency(etf.price)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {etf.sector}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="p-3 text-gray-500 dark:text-gray-400 text-center">
                      No ETFs found
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Selected ETF Display */}
            {selectedETF && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                      {selectedETF.id} - {selectedETF.name}
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Current Price: {formatCurrency(selectedETF.price)} | Sector: {selectedETF.sector}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number of Shares *
                </label>
                <input
                  type="number"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.001"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Average Price *
                </label>
                <input
                  type="number"
                  value={avgPrice}
                  onChange={(e) => setAvgPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Purchase Date
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Cost Basis Display */}
            {shares && avgPrice && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">Total Cost Basis:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(parseFloat(shares) * parseFloat(avgPrice))}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedETF || !shares || !avgPrice}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Add Holding
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddHoldingModal;
