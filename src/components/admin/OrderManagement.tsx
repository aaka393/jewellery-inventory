import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  GridOptions,
  ModuleRegistry
} from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { CsvExportModule } from 'ag-grid-community';
import {
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  Search,
  RefreshCw,
  FileDown,
  User,
  Calendar,
  MapPin,
  Send,
  Truck,
  Pencil
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import { SITE_CONFIG, staticImageBaseUrl } from '../../constants/siteConfig';
import { Order } from '../../types';
import { adminService } from '../../services';
import { formatReadableDate } from '../../utils/dateUtils';
import { OrderStats } from '../../types/dashboard';
import Card from './dashboard/Card';

// Register AG Grid modules
ModuleRegistry.registerModules([ClientSideRowModelModule, CsvExportModule]);

// Custom cell renderers with beautiful styling
const StatusCellRenderer = (params: any) => {
  const status = params.value;
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'paid':
        return {
          icon: CheckCircle,
          color: 'text-emerald-600',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-800'
        };
      case 'created':
        return {
          icon: Clock,
          color: 'text-amber-600',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-800'
        };
      case 'attempted':
        return {
          icon: Package,
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800'
        };
      default:
        return {
          icon: XCircle,
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${config.bg} ${config.border} ${config.text} shadow-sm`}>
      <Icon className={`h-3 w-3 mr-1.5 ${config.color}`} />
      <span className="capitalize font-medium">{status}</span>
    </div>
  );
};

const OrderIdCellRenderer = (params: any) => {
  return (
    <div className="flex items-center space-x-2">
      <div>
        <div className="font-semibold text-gray-900 text-sm">{params.value}</div>
      </div>
    </div>
  );
};

const CustomerCellRenderer = (params: any) => {
  const userId = params.data.notes?.userId || 'Unknown';
  const userEmail = params.data.notes?.userEmail || '';

  return (
    <div className="flex items-center space-x-3">
      <div className="min-w-0 flex-1">
        <div className="font-medium text-gray-900 text-sm truncate">{userId}</div>
        {userEmail && (
          <div className="text-xs text-gray-500 truncate">{userEmail}</div>
        )}
      </div>
    </div>
  );
};

const OrderItemsCellRenderer = (params: any) => {
  const items = params.value || [];
  const totalItems = items.length;

  return (
    <div className="flex items-center justify-center">
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
        {totalItems} {totalItems === 1 ? 'item' : 'items'}
      </span>
    </div>
  );
};


const AmountCellRenderer = (params: any) => {
  const amount = params.value;

  return (
    <div className="text-right">
      <div className="text-lg font-bold text-gray-900">
        {SITE_CONFIG.currencySymbol}{amount.toLocaleString()}
      </div>
      <div className="text-xs text-gray-500">Total Amount</div>
    </div>
  );
};

const DateCellRenderer = (params: any) => {
  const date = formatReadableDate(params.value);

  return (
    <div className="flex items-center space-x-2">
      <Calendar className="h-4 w-4 text-gray-400" />
      <div>
        <div className="text-sm font-medium text-gray-900">{date.split(' ')[0]}</div>
        <div className="text-xs text-gray-500">{date.split(' ').slice(1).join(' ')}</div>
      </div>
    </div>
  );
};

const AddressCellRenderer = (params: any) => {
  const address = params.value;
  if (!address) return <span className="text-gray-400 text-sm">No address</span>;

  return (
    <div className="py-2">
      <div className="flex items-start space-x-2">
        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="font-medium text-gray-900 text-sm">{address.fullName}</div>
          <div className="text-xs text-gray-600 space-y-0.5 mt-1">
            <div className="truncate">{address.houseNumber}, {address.streetArea}</div>
            {address.landmark && <div className="truncate">Near {address.landmark}</div>}
            <div className="truncate">{address.city}, {address.state} - {address.pincode}</div>
            <div className="flex items-center text-gray-500 mt-1">
              <span className="text-xs">📞 {address.mobileNumber}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionsCellRenderer = (params: any) => {
  const order = params.data;
  const [trackingId, setTrackingId] = useState(order.trackingNumber || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync tracking number if order changes
  useEffect(() => {
    setTrackingId(order?.trackingNumber || '');
    setIsEditing(false);
  }, [order?.trackingNumber]);

  const handleTrackIdSubmit = async () => {
    if (!trackingId.trim()) return;
    setIsSubmitting(true);
    try {
      await adminService.sendTrackingId(trackingId, order.id);
      setIsSubmitted(true);
      setIsEditing(false);
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error('Failed to update tracking ID', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-2">
      {order.status === 'paid' && (
        <div className="flex flex-col items-center justify-center space-y-3">
          {!isEditing && trackingId ? (
            // ✅ Tick with Edit
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-800">{trackingId}</span>
              <button
                onClick={() => setIsEditing(true)}
                className="text-indigo-600 hover:text-indigo-800 text-xs flex items-center space-x-1"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            // Input + Send
            <>
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter tracking ID"
                className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                disabled={isSubmitting}
              />

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleTrackIdSubmit}
                  disabled={!trackingId.trim() || isSubmitting}
                  className="flex items-center space-x-1 bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  <Send className="h-3 w-3" />
                  <span>{isSubmitting ? 'Sending...' : 'Send'}</span>
                </button>

                {isSubmitted && (
                  <div className="flex items-center space-x-1 text-emerald-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-xs font-medium">Sent!</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};


const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [quickFilterText, setQuickFilterText] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes] = await Promise.all([
        adminService.getOrderStats(),
        adminService.getAllOrders()
      ]);
      setStats(statsRes.result);
      setOrders(ordersRes.result || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadOrders();
    setIsRefreshing(false);
  };

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  }, []);

  const onViewOrder = useCallback((order: Order) => {
    setSelectedOrder(order);
  }, []);

  const onExportCsv = useCallback(() => {
    if (gridApi) {
      gridApi.exportDataAsCsv({
        fileName: `orders-${new Date().toISOString().split('T')[0]}.csv`,
        columnSeparator: ',',
      });
    }
  }, [gridApi]);

  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'Order',
      field: 'id',
      width: 200,
      pinned: 'left',
      cellRenderer: OrderIdCellRenderer,
      filter: 'agTextColumnFilter',
      sortable: true,
    },
    {
      headerName: 'Customer',
      field: 'notes.userId',
      width: 200,
      cellRenderer: CustomerCellRenderer,
      filter: 'agTextColumnFilter',
      sortable: true,
    },
    {
      headerName: 'Items',
      field: 'items',
      width: 280,
      cellRenderer: OrderItemsCellRenderer,
      sortable: false,
      filter: false,
      autoHeight: true,
    },
    {
      headerName: 'Amount',
      field: 'amount',
      width: 140,
      cellRenderer: AmountCellRenderer,
      filter: 'agNumberColumnFilter',
      sortable: true,
      type: 'numericColumn',
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 140,
      cellRenderer: StatusCellRenderer,
      filter: 'agSetColumnFilter',
      sortable: true,
    },
    {
      headerName: 'Date',
      field: 'createdAt',
      width: 160,
      cellRenderer: DateCellRenderer,
      filter: 'agDateColumnFilter',
      sortable: true,
      sort: 'desc',
    },
    {
      headerName: 'Shipping Address',
      field: 'shippingAddress',
      width: 300,
      cellRenderer: AddressCellRenderer,
      sortable: false,
      filter: false,
      autoHeight: true,
    },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 200,
      cellRenderer: ActionsCellRenderer,
      sortable: false,
      filter: false,
      pinned: 'right',
      autoHeight: true,
    },
  ], []);

  const defaultColDef: ColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
    minWidth: 120,
    flex: 1,
  }), []);

  const gridOptions: GridOptions = useMemo(() => ({
    pagination: true,
    paginationPageSize: 15,
    paginationPageSizeSelector: [10, 15, 25, 50],
    animateRows: true,
    enableRangeSelection: true,
    suppressMovableColumns: false,
    suppressMenuHide: false,
    rowHeight: 120,
    headerHeight: 50,
    context: {
      onViewOrder,
    },
  }), [onViewOrder]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Beautiful Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-gray-100 rounded-lg">
          <Card
            icon={Package}
            title="Total Orders"
            value={stats?.totalOrders ?? 0}
          />
        </div>

        <div className="bg-yellow-100 rounded-lg">
          <Card
            icon={() => <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-[#5f3c2c]" />}
            title="Pending"
            value={stats?.pendingOrders ?? 0}
          />
        </div>

        <div className="bg-green-100 rounded-lg">
          <Card
            icon={() => <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-[#5f3c2c]" />}
            title="Completed"
            value={stats?.completedOrders ?? 0}
          />
        </div>

        <div className="bg-blue-100 rounded-lg">
          <Card
            icon={() => <Download className="h-5 w-5 sm:h-6 sm:w-6 text-[#5f3c2c]" />}
            title="Revenue"
            value={`${SITE_CONFIG.currencySymbol}${(stats?.totalRevenue ?? 0).toLocaleString()}`}
          />
        </div>

      </div>

      {/* Orders Grid */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Header with Controls */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
              <p className="text-gray-600 mt-1">
                Manage and track all customer orders ({orders.length} total)
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              {/* Quick Filter */}
              <div className="relative flex-1 lg:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search orders, customers, items..."
                  value={quickFilterText}
                  onChange={(e) => setQuickFilterText(e.target.value)}
                  className="w-full lg:w-80 pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200 shadow-sm"
                  title="Refresh data"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>

                <button
                  onClick={onExportCsv}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium  text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200 shadow-sm"
                  title="Export to CSV"
                >
                  <FileDown className="h-4 w-4" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AG Grid */}
        <div className="ag-theme-alpine-custom" style={{ height: '630px', width: '100%' }}>
          <AgGridReact
            ref={gridRef}
            rowData={orders}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            gridOptions={gridOptions}
            onGridReady={onGridReady}
            quickFilterText={quickFilterText}
            suppressMenuHide={false}
            enableRangeSelection={true}
            rowSelection="multiple"
            suppressRowClickSelection={true}
            domLayout="normal"
          />
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

// Enhanced Order Detail Modal
const OrderDetailModal: React.FC<{
  order: Order;
  onClose: () => void;
}> = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>

        <div className="inline-block w-full max-w-6xl p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Order Details</h3>
                <p className="text-indigo-100 mt-1">#{order.id.slice(-8)}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 focus:outline-none p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Info */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                    <Package className="h-5 w-5 mr-2 text-indigo-600" />
                    Order Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">Order ID:</span>
                      <span className="font-bold text-gray-900">#{order.id.slice(-8)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">Status:</span>
                      <StatusCellRenderer value={order.status} />
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">Date:</span>
                      <span className="font-medium text-gray-900">{formatReadableDate(order.createdAt)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">Total Amount:</span>
                      <span className="font-bold text-2xl text-indigo-600">{SITE_CONFIG.currencySymbol}{order.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    Shipping Address
                  </h4>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <AddressCellRenderer value={order.shippingAddress} />
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-emerald-600" />
                  Order Items ({order.items.length})
                </h4>
                <div className="bg-white rounded-lg p-4 max-h-96 overflow-y-auto shadow-sm">
                  <OrderItemsCellRenderer value={order.items} />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;