import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

import Select from 'react-select';
import SalesCycles from './SalesCycle';
import SalesPhase from './SalesPhase';
import OpportunityStatus from './OpportunityStatus'
import CategoriesSelect from './CategoriesSelect';
function OpportunityCreation() {

    const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
    const [opportunityName, setOpportunityName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('')
    const [selectedCycle, setSelectedCycle] = useState<any | null>(null);

    const [selectedPhase, setSelectedPhase] = useState('')

    const [loading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState<any[]>([])
    const [ownerFilter, setOwnerFilter] = useState('All Owners');

    const baseUrl = import.meta.env.VITE_API_URL as string
    console.log("baseUrl:", baseUrl)

    const fetchAccounts = async () => {
        try {
            const results = await axios.get(`${baseUrl}/sap-accounts`)
            // console.log("res:", results.data)
            setAccounts(results.data)
            // console.log("accounts:", accounts)

        }
        catch (err: any) {
            console.log("error:", err)
        }

    }
    useEffect(() => {
        fetchAccounts()

    }, [])
    const ownersFromAccounts = [
        ...new Set(accounts.map((owner) => owner.ownerFormattedName)
            .filter(Boolean))]
        .sort()
    const owners = ['All Owners', ...ownersFromAccounts];
    const ownerOptions = owners.map((o) => ({ value: o, label: o }))

    const filteredAccounts = ownerFilter === 'All Owners' ? accounts :
        accounts.filter(acc => acc.ownerFormattedName == ownerFilter)

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAccounts = filteredAccounts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage)






    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedAccounts(accounts.map(acc => acc.displayId));
        } else {
            setSelectedAccounts([]);
        }
    };

    const handleSelectAccount = (displayId: string) => {
        setSelectedAccounts(prev =>
            prev.includes(displayId)
                ? prev.filter(c => c !== displayId)
                : [...prev, displayId]
        );
    };
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    const handleCreateOpportunities = async () => {

        if (selectedAccounts.length === 0) {
            alert('נא לבחור לפחות לקוח אחד');
            return;
        }

        setLoading(true);

        try {

            const accountGUIDs = selectedAccounts.map(displayId => {
                const account = accounts.find(acc => acc.displayId === displayId);
                return account?.id;
            }).filter(Boolean);

            console.log('Creating opportunities for:', accountGUIDs);


            const response = await axios.post(`${baseUrl}/opportunities`, {
                name: opportunityName,
                accountIds: accountGUIDs,
                salesCycleCode: selectedCycle,
                salesPhaseCode: selectedPhase,
                lifeCycleStatus: selectedStatus,
                processingTypeCode: selectedCategory
            });

            console.log('Response:', response.data);

            const { successful, failed, results } = response.data;

            if (failed === 0) {
                alert(`✅ נוצרו ${successful} הזדמנויות בהצלחה!`);
            } else {
                const failedDetails = results
                    .filter((r: any) => !r.success)
                    .map((r: any) => `${r.accountId}: ${r.error}`)
                    .join('\n');

                alert(`נוצרו ${successful} הזדמנויות\n${failed} נכשלו:\n${failedDetails}`);
            }


            setSelectedAccounts([]);
            setOpportunityName('');
            setSelectedStatus('');
            setSelectedPhase('');
            setSelectedCycle('')
            setSelectedStatus('');
            setSelectedCategory('');

        } catch (error: any) {
            console.error('Error:', error);
            alert('שגיאה: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    }
    const handleCancel = () => {
        setSelectedAccounts([]);
        setOpportunityName('');
        setSelectedStatus('');
        setSelectedPhase('');
        setSelectedCycle('')
        setSelectedStatus('');
        setSelectedCategory('');

    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <h2 className="text-3xl font-semibold text-gray-900 mb-8">
                    New Brand Opportunities Creation
                </h2>

                {/* Filter Section */}
                <div className="flex gap-8">
                    <div className="flex flex-col items-start">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Filter by:
                        </h3>
                        <div className="max-w-md w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Owner
                            </label>
                            <Select
                                options={ownerOptions}

                                value={{ value: ownerFilter, label: ownerFilter }}
                                onChange={(option) => setOwnerFilter(option?.value || '')}
                                isSearchable={true}
                                placeholder="Search owner..."
                            />
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedAccounts.length === accounts.length && accounts.length > 0}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Account Code
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Account Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Owner
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Territory
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {currentAccounts.map((account) => {
                                    // console.log("account:", account);
                                    return (
                                        <tr key={account.displayId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedAccounts.includes(account.displayId)}
                                                    onChange={() => handleSelectAccount(account.displayId)}
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{account?.displayId}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{account?.formattedName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{account?.ownerFormattedName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{account?.salesTerritories?.[0]?.salesTerritoryName || 'N/A'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-gray-700">
                            <span>Total Records: {accounts.length}</span>
                            <span>Total Selected: {selectedAccounts.length}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                                >
                                    <ChevronRight className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Create Opportunity Form */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h5 className="text-lg font-medium text-gray-900 mb-6">
                        Create Opportunity with:
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Row 1 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Opportunity Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={opportunityName}
                                onChange={(e) => setOpportunityName(e.target.value)}
                                placeholder="Enter opportunity name"
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sales Cycle <span className="text-red-500">*</span>
                            </label>
                            < SalesCycles
                                value={selectedCycle}
                                onChange={setSelectedCycle} />

                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sales Phase <span className="text-red-500">*</span>
                            </label>

                            < SalesPhase
                                
                                value={selectedPhase}
                                onChange={setSelectedPhase}
                                 selectedCycleCode={selectedCycle} />
                        </div>

                        {/* Row 2 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status <span className="text-red-500">*</span>
                            </label>
                            < OpportunityStatus
                                value={selectedStatus}
                                onChange={setSelectedStatus} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <CategoriesSelect
                                value={selectedCategory}
                                onChange={setSelectedCategory} />
                        </div>


                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex justify-end gap-4">
                        <button
                            className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg
                             text-gray-700 font-medium hover:bg-gray-50 focus:ring-2
                              focus:ring-gray-500 focus:ring-offset-2"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-6 py-2.5 rounded-lg text-white font-medium"
                            style={{ backgroundColor: '#2563eb' }}
                            onClick={handleCreateOpportunities}
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Opportunities'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OpportunityCreation;