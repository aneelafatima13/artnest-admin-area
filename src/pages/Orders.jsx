import React, { useState, useEffect } from "react";
import axios from "../utils/axiosSetup";
import Layout from "../components/Layout";
const BASE_URL = import.meta.env.VITE_BASE_URL;


function Orders() {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);

const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");

  // 🔹 Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [statusList, setStatusList] = useState({
    list: [],
  type: null,
  });

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/orders/get-all-customers-with-orders`,
        { page, limit }
      );

      if (res.data.customers?.length > 0) {
        setCustomers(res.data.customers);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };


  const updateOrderStatus = async (mode, orderId, adminUserId, customerId) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/orders/manage-orders-status`, {
      Mode: mode,
      OrderId: orderId,
      AdminUserId: adminUserId,
      CustomerId: customerId,
    });
    console.log(res.data);
   alert(res.data.message);
    fetchCustomers(); 
  } catch (error) {
    console.error("Error updating order status:", error);
    alert("Failed to update order status.");
  }
};

 const updateOrderProductStatus = async (mode, orderId, orderproductId, adminUserId, customerId, productName) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/orders/manage-orders-status`, {
      Mode: mode,
      OrderId: orderId,
      OrderedProductId: orderproductId,
      AdminUserId: adminUserId,
      CustomerId: customerId,
      ProductName: productName
    });
    console.log(res.data);
   alert(res.data.message);
    fetchCustomers(); 
  } catch (error) {
    console.error("Error updating order status:", error);
    alert("Failed to update order status.");
  }
};
  const handleNext = () => setPage((prev) => prev + 1);
  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));

  // 🔹 Modal open/close handlers
  const openModal = (title, statuses, type) => {
  setModalTitle(title);
  setStatusList({ list: statuses || [], type });
  setShowModal(true);
};

const closeModal = () => {
  setShowModal(false);
  setModalTitle("");
  setStatusList({ list: [], type: null });
};


  if (loading) {
    return (
      <Layout>
        <div className="text-center mt-5">Loading data...</div>
      </Layout>
    );
  }

  if (customers.length === 0) {
    return (
      <Layout>
        <div className="text-center mt-5">No customers found.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="content-wrapper">
        <div className="container-fluid mt-4">
          <h2 className="text-center mb-4">Customers Orders</h2>

          {customers.map((cust, index) => (
            <div key={index} className="card mb-4 shadow-sm p-4">
              <h4 className="mb-2">
                {cust.FirstName} {cust.LastName}
              </h4>
              <p className="text-muted mb-3">
                <strong>Email:</strong> {cust.Email} <br />
                <strong>Phone:</strong> {cust.PhoneNo || "N/A"} <br />
                <strong>Address:</strong> {cust.Address || "N/A"}
              </p>

              {cust.orders?.length > 0 ? (
                cust.orders.map((order, i) => (
                  <div
                    key={i}
                    className="card mb-4 border border-2 border-light shadow-sm"
                    style={{
                      borderTop: "3px solid #b47cff",
                      borderBottom: "3px solid #b47cff",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mt-2 mb-2">
                      <div>
                        <h5 className="mb-0">Order #{order.OrderNumber}</h5>
                        <small className="text-muted">
                          {new Date(order.OrderDate).toLocaleDateString()}
                        </small>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <span
                          className={`badge ${
                            order.CurrentStatus === "Received"
                              ? "bg-success"
                              : order.CurrentStatus === "Rejected"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {order.CurrentStatus || "Pending"}
                        </span>

                        <div className="d-flex align-items-center gap-2">

  {/* View Tracking */}
  <button
    className="btn btn-sm btn-outline-dark"
    title="View Status Tracking"
    onClick={() =>
      openModal(`Order #${order.OrderNumber} Status Tracking`, order.statuses, 1)
    }
  >
    <i className="mdi mdi-timeline-text-outline"></i>
  </button>

  {/* Conditional Buttons */}
  {order.CurrentStatus === "Order Place" && (
    <>
      <button
        className="btn btn-sm btn-outline-primary"
        title="Mark as Approved"
        onClick={() => updateOrderStatus(1, order.OrderId, currentUser.Id, null)}
      >
        <span className="mdi mdi-check-decagram"></span>
      </button>

      <button
        className="btn btn-sm btn-outline-danger"
        title="Reject Order"
        onClick={() => updateOrderStatus(4, order.OrderId, currentUser.Id, null)}
      >
        <i className="mdi mdi-delete-outline"></i>
      </button>
    </>
  )}

  {order.CurrentStatus === "Approved" && (
    <>
      <button
        className="btn btn-sm btn-outline-info"
        title="Mark as Shipped"
        onClick={() => updateOrderStatus(2, order.OrderId, currentUser.Id, null)}
      >
        <span className="mdi mdi-truck"></span>
      </button>

      <button
        className="btn btn-sm btn-outline-secondary"
        title="Generate Receipt"
        onClick={() => handleGenerateReceipt(order.OrderId)}
      >
        <span className="mdi mdi-receipt"></span>
      </button>

      <button
        className="btn btn-sm btn-outline-danger"
        title="Cancel Order"
        onClick={() => updateOrderStatus(5, order.OrderId, currentUser.Id, null)}
      >
        <i className="mdi mdi-delete-outline"></i>
      </button>
    </>
  )}

  {order.CurrentStatus === "Shipped" && (
    <button
      className="btn btn-sm btn-outline-success"
      title="Mark as Received"
      onClick={() => updateOrderStatus(3, order.OrderId, currentUser.Id, null)}
    >
      <i className="mdi mdi-check-circle-outline"></i>
    </button>
  )}

  {order.CurrentStatus === "Received" && (
    <button
      className="btn btn-sm btn-outline-secondary"
      title="Generate Receipt"
      onClick={() => handleGenerateReceipt(order.OrderId)}
    >
      <span className="mdi mdi-receipt"></span>
    </button>
  )}

</div>
        </div>
                    </div>

                    {/* 🛍️ Ordered Products */}
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover">
                        <thead className="table-dark">
                          <tr>
                            <th>Product</th>
                             <th>Price</th>
                              <th>Qty</th>
                           
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.products.map((product, j) => {
                            const price = parseFloat(product.ProductActualPrice) || 0;
                            const discountRate =
                              parseFloat(product.DiscountRate) || 0;
                            const discountPrice =
                              parseFloat(product.DiscountPrice) || 0;
                            const quantity =
                              parseInt(product.OrderedQuantity) || 0;
                               const priceafterdiscount =
                              parseFloat(product.PriceafterDiscount) || 0;
                              const TotalProductPayment =
                              parseFloat(product.TotalProductPayment) || 0;
                              
                             
                            return (
                              <tr key={j}>
                                <td>
                                  <img
                                    src={
                                      product.ProductImage
                                        ? `${BASE_URL}/${product.ProductImage.replace(
                                            /\\/g,
                                            "/"
                                          )}`
                                        : "/img/default.png"
                                    }
                                    alt={product.ProductName}
                                    style={{
                                      width: "60px",
                                      height: "60px",
                                      objectFit: "contain",
                                      borderRadius: "8px",
                                    }}
                                  />
                                  <br />
                                  <span>
                                    {product.ProductName}
                                  </span>
                                </td>
                                <td>
  Rs {price.toFixed(2)}
  {discountRate > 0 && (
    <>
      <br />
      <span style={{ color: "purple", fontWeight: "500" }}>
       {discountRate.toFixed(2)}% OFF
      </span>
      <br />
      <span style={{ color: "purple", fontWeight: "500" }}>
         Rs {discountPrice.toFixed(2)}
      </span>
      <br />
      <span style={{ color: "green", fontWeight: "600" }}>
        Rs {priceafterdiscount.toFixed(2)}
      </span>
    </>
  )}
</td>

                                <td>{quantity}</td>
                               
                                <td>Rs {TotalProductPayment.toFixed(2)}</td>
                               <td>
  {product.CurrentStatus === 0 ? "Pending" :
   product.CurrentStatus === 1 ? "Approved" :
   product.CurrentStatus === 2 ? "Shipped" :
   product.CurrentStatus === 3 ? "Received" :
   product.CurrentStatus === 4 ? "Rejected" :
   product.CurrentStatus === 5 ? "Cancelled" :
   "Pending"}
</td>

                                <td>
                                 <div className="d-flex align-items-center gap-2">
  {/* 🔹 View Product Tracking Button */}
  <button
    className="btn btn-sm btn-outline-dark"
    title="View Product Status Tracking"
    onClick={() =>
      openModal(
        `${product.ProductName} Status Tracking`,
        product.statuses, 2
      )
    }
  >
    <i className="mdi mdi-timeline-text-outline"></i>
  </button>

  {/* 🔹 Conditional Action Buttons */}
  {product.CurrentStatus === 0 && (
    <>
      {/* Show only when Pending */}
      <button
        className="btn btn-sm btn-outline-primary"
        title="Mark as Approved"
        onClick={() =>
          updateOrderProductStatus(
            1,
            order.OrderId,
            product.OrderedProductId,
            currentUser.Id,
            null,
            product.ProductName
          )
        }
      >
        <span className="mdi mdi-check-decagram"></span>
      </button>

      <button
        className="btn btn-sm btn-outline-danger"
        title="Reject Order"
        onClick={() =>
          updateOrderProductStatus(
            4,
            order.OrderId,
            product.OrderedProductId,
            currentUser.Id,
            null,
            product.ProductName
          )
        }
      >
        <i className="mdi mdi-delete-outline"></i>
      </button>
    </>
  )}

  {product.CurrentStatus === 1 && (
    <>
      {/* Show when Approved */}
      <button
        className="btn btn-sm btn-outline-info"
        title="Mark as Shipped"
        onClick={() =>
          updateOrderProductStatus(
            2,
            order.OrderId,
            product.OrderedProductId,
            currentUser.Id,
            null,
            product.ProductName
          )
        }
      >
        <span className="mdi mdi-truck"></span>
      </button>

      <button
        className="btn btn-sm btn-outline-secondary"
        title="Generate Receipt"
        onClick={() => handleGenerateReceipt(order.OrderId)}
      >
        <span className="mdi mdi-receipt"></span>
      </button>

      <button
        className="btn btn-sm btn-outline-danger"
        title="Cancel Order"
        onClick={() =>
          updateOrderProductStatus(
            5,
            order.OrderId,
            product.OrderedProductId,
            currentUser.Id,
            null,
            product.ProductName
          )
        }
      >
        <i className="mdi mdi-delete-outline"></i>
      </button>
    </>
  )}

  {product.CurrentStatus === 2 && (
    <>
      {/* Show only when Shipped */}
      <button
        className="btn btn-sm btn-outline-success"
        title="Mark as Received"
        onClick={() =>
          updateOrderProductStatus(
            3,
            order.OrderId,
            product.OrderedProductId,
            currentUser.Id,
            null,
            product.ProductName
          )
        }
      >
        <i className="mdi mdi-check-circle-outline"></i>
      </button>
    </>
  )}

  {product.CurrentStatus >= 3 && (
    <>
      {/* Once Received, Rejected, or Cancelled → Disable Actions */}
      <span className="text-muted small">No further actions</span>
    </>
  )}
</div>

                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="text-end m-3">
                      <strong>
                        Subtotal: Rs {Number(order.ProductsTotal).toFixed(2)} <br />
                        Delivery: Rs {Number(order.DeliveryPayment).toFixed(2)} <br />
                        <span style={{ fontSize: "1.1em" }} className="mt-3">
                          Total:{" "}
                          <b>Rs {Number(order.TotalAmount).toFixed(2)}</b>
                        </span>
                      </strong>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">No orders for this customer.</p>
              )}
            </div>
          ))}

          {/* Pagination */}
          <div className="d-flex justify-content-center align-items-center my-4">
            <button
              className="btn btn-outline-primary me-2"
              disabled={page === 1}
              onClick={handlePrev}
            >
              ◀ Previous
            </button>
            <span className="mx-2 fw-bold">Page {page}</span>
            <button className="btn btn-outline-primary" onClick={handleNext}>
              Next ▶
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 Modal for Status Tracking */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
                <button className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                {statusList.list.length > 0 ? (
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statusList.list.map((h, i) => (
                        <tr key={i}>
                          <td>
            {statusList.type === 1
              ? h.Status
              : h.Status === 0
              ? "Approval Pending"
              : h.Status === 1
              ? "Approved"
              : h.Status === 2
              ? "Shipped"
              : h.Status === 3
              ? "Received"
              : h.Status === 4
              ? "Rejected"
              : h.Status === 5
              ? "Cancelled"
              : "Unknown"}
          </td>
                          <td>{new Date(h.AddedDate).toLocaleString()}</td>
                          <td>
                            {h.IsActive ? (
                              <span className="badge bg-success">Active</span>
                            ) : (
                              <span className="badge bg-secondary">Inactive</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-muted">No status history available.</p>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Orders;
