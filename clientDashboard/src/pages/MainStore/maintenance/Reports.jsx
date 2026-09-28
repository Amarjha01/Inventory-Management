import React, { useState } from 'react';

const Reports = ({ record = [], onClick }) => {
  console.log(onClick);
  
  const [filterKitchen, setFilterKitchen] = useState('ALL');

  // Ensure record is always an array
  const reportsList = Array.isArray(record) ? record : [];

  // Extract unique kitchen names for filtering
  const uniqueKitchens = [...new Set(reportsList.map(r => r.kitchenName || r.kitchenId?.name).filter(Boolean))];

  // Filter logic based on kitchen
  const filteredReports = reportsList.filter(item => {
    const kitchen = item.kitchenName || item.kitchenId?.name;
    return filterKitchen === 'ALL' || kitchen === filterKitchen;
  });

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>Kitchen Reports Dashboard</h1>
          <span style={{ backgroundColor: '#e5e7eb', padding: '6px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: '500' }}>
            Total Records: {reportsList.length}
          </span>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#4b5563' }}>Filter by Kitchen:</label>
            <select 
              value={filterKitchen} 
              onChange={(e) => setFilterKitchen(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#fff' }}
            >
              <option value="ALL">All Kitchens</option>
              {uniqueKitchens.map((k, idx) => (
                <option key={idx} value={k}>{k}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Reports Table/Grid */}
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb', color: '#374151' }}>
                <th style={{ padding: '12px 16px' }}>Kitchen</th>
                <th style={{ padding: '12px 16px' }}>Type</th>
                <th style={{ padding: '12px 16px' }}>Primary Details</th>
                <th style={{ padding: '12px 16px' }}>Secondary Info</th>
                <th style={{ padding: '12px 16px' }}>User (Staff)</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((item) => {
                  
                  // Determine type and extract fields accordingly
                  let typeBadge = { label: 'Standard Report', bg: '#dbeafe', color: '#1e40af' };
                  let primaryText = item.reason || 'N/A';
                  let secondaryText = item.narration || item.status || 'N/A';

                  if (item.purchaseRecord) {
                    typeBadge = { label: 'Purchase', bg: '#d1fae5', color: '#065f46' };
                    primaryText = `Company: ${item.purchaseRecord.companyName}`;
                    secondaryText = `Party: ${item.purchaseRecord.partyName} | Warranty: ${item.purchaseRecord.expiryWarrantyYear}`;
                  } else if (item.visitor || item.visitorName) {
                    const vis = item.visitor || {};
                    typeBadge = { label: 'Visitor', bg: '#ede9fe', color: '#6d28d9' };
                    primaryText = `Visitor: ${vis.visitorName || item.visitorName}`;
                    secondaryText = `Phone: ${vis.phoneNumber || item.phoneNumber} | Reason: ${vis.reason || item.reason}`;
                  }

                  return (
                    <tr key={item._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px 16px', fontWeight: '600', color: '#1f2937' }}>
                        {item.kitchenName || item.kitchenId?.name || 'N/A'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600',
                          backgroundColor: typeBadge.bg,
                          color: typeBadge.color
                        }}>
                          {typeBadge.label}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#111827', fontWeight: '500', maxWidth: '250px' }}>
                        {primaryText}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#4b5563', fontSize: '13px', maxWidth: '250px' }}>
                        {secondaryText}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#4b5563' }}>
                        {item.userId?.name || 'N/A'}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#4b5563', fontSize: '13px' }}>
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <button 
                          onClick={() => onClick && onClick(item)}
                          style={{ padding: '6px 12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
                    No reports found matching the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;