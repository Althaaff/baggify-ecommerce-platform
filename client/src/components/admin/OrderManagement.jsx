import { useCallback, useEffect, useState } from "react";
import { Package, User, IndianRupeeIcon, CheckCircle } from "lucide-react";
import { orderService } from "../../services/orderService";
import OrderStats from "./OrderStats";
import OrderFilters from "./OrderFilters";
import OrderTable from "./OrderTable";
import OrderDetailModal from "./OrderDetailModal";
import { toast } from "react-hot-toast";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    limit: 10,
  });

  const [filters, setFilters] = useState({
    status: "all",
    paymentStatus: "all",
    search: "",
    startDate: "",
    endDate: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  // fetch orders :
  const fetchOrders = useCallback(
    async (page = 1) => {
      setLoading(true);

      try {
        const params = {
          page,
          limit: pagination.limit,
          ...filters,
        };

        // remove empty params:
        Object.keys(params).forEach((key) => {
          (params[key] === "" || params[key] === "all") && delete params[key];
        });

        const response = await orderService.getAllOrders(params);

        if (response.success) {
          setOrders(response.data.orders);
          setPagination(response.data.pagination);
        }
      } catch (error) {
        console.error(
          error?.response?.data?.message || "Failed to fetch orders",
        );
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.limit],
  );

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);

    try {
      const response = await orderService.getOrdersStats();

      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch order stats", error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  console.log("statss", stats);

  useEffect(() => {
    fetchOrders(1);
  }, [filters]);

  const handleViewOrder = async (orderId) => {
    try {
      const response = await orderService.getOrderById(orderId);

      if (response && response.success) {
        const order = response.data;

        setSelectedOrder(order);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Failed to load order details", error.message);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    setUpdatingStatus({ id: orderId, type: "order" });
    try {
      const response = await orderService.updateOrderStatus(orderId, newStatus);

      const order = response.data;

      // update orders list:
      setOrders((prev) =>
        prev.map((item) =>
          item?._id === orderId ? { ...item, status: order?.status } : item,
        ),
      );

      // update modal if open :
      if (selectedOrder?._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: order?.status }));
      }

      // toast message here
      toast.success("Status updated");
      fetchStats();
    } catch (error) {
      console.error(
        error?.response?.data?.message || "Failed to update order status",
      );
    } finally {
      setUpdatingOrderId(null);
      setUpdatingStatus(null);
    }
  };

  const handlePaymentStatusUpdate = async (orderId, newPaymentStatus) => {
    setUpdatingOrderId(orderId);
    setUpdatingStatus({ id: orderId, type: "payment" });

    try {
      const response = await orderService.updatePaymentStatus(
        orderId,
        newPaymentStatus,
      );

      if (response && response.success) {
        const order = response.data;

        setOrders((prev) =>
          prev.map((item) =>
            item?._id === orderId
              ? { ...item, paymentStatus: order.paymentStatus }
              : item,
          ),
        );

        if (selectedOrder?._id === orderId) {
          setSelectedOrder((prev) => ({
            ...prev,
            paymentStatus: order.paymentStatus,
          }));
        }

        toast.success("Payment Status Updated.");
        fetchStats();
      } else {
        const errMessage =
          response.message || "Failed to update payment status";
        toast.error(errMessage);
      }
    } catch (error) {
      console.error(
        error?.response?.data?.message || "Failed to update payment status",
      );
    } finally {
      setUpdatingOrderId(null);
      setUpdatingStatus(null);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await orderService.deleteOrder(orderId);
      setOrders((prev) => prev.filter((order) => order?._id !== orderId));
      setPagination((prev) => ({ ...prev, totalOrders: prev.totalOrders - 1 }));
      // toast message:
      toast.success("Order Deleted Successfully.");
      fetchStats();
      if (isModalOpen && selectedOrder?._id === orderId) {
        setIsModalOpen(false);
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Failed to delete order", error.message);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handlePageChange = (page) => {
    fetchOrders(page);
  };

  const handleOrderUpdateSuccess = (updatedOrder) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order?._id === updatedOrder._id ? updatedOrder : order,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-500 mt-1">
            Manage and track all customer orders
          </p>
        </div>

        {/* Stats */}
        <OrderStats stats={stats} loading={statsLoading} />

        {/* Filters */}
        <OrderFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Orders table */}
        <OrderTable
          orders={orders}
          loading={loading}
          pagination={pagination}
          updatingOrderId={updatingOrderId}
          onStatusUpdate={handleStatusUpdate}
          loadingState={updatingStatus}
          onPaymentStatusUpdate={handlePaymentStatusUpdate}
          onViewOrder={handleViewOrder}
          onDeleteOrder={handleDeleteOrder}
          onPageChange={handlePageChange}
          onOrderUpdateSuccess={handleOrderUpdateSuccess}
        />

        {/* Order detail modal */}
        {isModalOpen && selectedOrder && (
          <OrderDetailModal
            isModalOpen={isModalOpen}
            order={selectedOrder}
            updatingOrderId={updatingOrderId}
            onClose={() => {
              setIsModalOpen(false);
              setUpdatingOrderId(null);
            }}
            loadingState={updatingStatus}
            onStatusUpdate={handleStatusUpdate}
            onPaymentStatusUpdate={handlePaymentStatusUpdate}
            onDeleteOrder={handleDeleteOrder}
          />
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
