import React, { useState, useEffect } from "react";
import axios from "../utils/axiosSetup";
import DataTable from "react-data-table-component";
import Layout from "../components/Layout";

const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");

function ManageDeliveryTypes() {
  const [form, setForm] = useState({
    Type: "",
    Payment: "",
    IsActive: true,
  });
  const [deliverytypes, setDeliveryTypes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showInfo, setShowInfo] = useState(null);

  useEffect(() => {
    fetchDeliveryTypes();
  }, []);

  const fetchDeliveryTypes = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/deliverytypes", {
        mode: 7,
      });
      setDeliveryTypes(res.data);
    } catch (err) {
      console.error("Error fetching delivery types:", err);
    }
  };

  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  if (name === "Type") {
    // Only one type can be selected at a time
    setForm({
      ...form,
      Type: value,
      Payment: value === "Free" ? "" : form.Payment, // Clear payment if Free
    });
  } else if (type === "checkbox") {
    setForm({ ...form, [name]: checked });
  } else {
    setForm({ ...form, [name]: value });
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.Type) return alert("Select Delivery Type (Free or Paid)");

    const payload = {
      ...form,
      mode: editId ? 2 : 1,
      Id: editId,
      UserId: currentUser.id,
    };

    try {
      await axios.post("http://localhost:5000/api/deliverytypes", payload);
      alert(editId ? "Updated successfully" : "Added successfully");
      setForm({ Type: "", Payment: "", IsActive: true });
      setEditId(null);
      fetchDeliveryTypes();
    } catch (err) {
      console.error("Error saving delivery type:", err);
    }
  };

  const handleEdit = (item) => {
    setForm({
      Type: item.Type,
      Payment: item.Payment,
      IsActive: item.IsActive === 1,
    });
    setEditId(item.Id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.post("http://localhost:5000/api/deliverytypes", {
          mode: 5,
          Id: id,
        });
        fetchDeliveryTypes();
      } catch (err) {
        console.error("Error deleting record:", err);
      }
    }
  };

  const handleInfo = async (id) => {
    try {
      const res = await axios.post("http://localhost:5000/api/deliverytypes", {
        mode: 6,
        Id: id,
      });
      setShowInfo(res.data[0]);
    } catch (err) {
      console.error("Error fetching info:", err);
    }
  };

  // ✅ NEW: Toggle Active/Inactive handler
  const handleToggleActive = async (row) => {
    const newMode = row.IsActive === 1 ? 4 : 3; // 3 = Activate, 4 = Deactivate
    const actionText = row.IsActive === 1 ? "deactivate" : "activate";

    if (
      window.confirm(
        `Are you sure you want to ${actionText} this delivery type?`
      )
    ) {
      try {
        await axios.post("http://localhost:5000/api/deliverytypes", {
          mode: newMode,
          Id: row.Id,
          UserId: currentUser.id,
        });
        fetchDeliveryTypes();
      } catch (err) {
        console.error("Error toggling active status:", err);
      }
    }
  };

  const columns = [
    { name: "ID", selector: (row) => row.Id, sortable: true, width: "80px" },
    { name: "Type", selector: (row) => row.Type, sortable: true },
    { name: "Payment", selector: (row) => row.Payment },
    {
      name: "Is Active",
      selector: (row) => (row.IsActive === 1 ? "Active" : "Inactive"),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            className="btn btn-gradient-info btn-sm"
            onClick={() => handleInfo(row.Id)}
          >
            <i className="mdi mdi-information"></i>
          </button>
          <button
            className="btn btn-gradient-warning btn-sm"
            onClick={() => handleEdit(row)}
          >
            <span class="mdi mdi-circle-edit-outline"></span>
          </button>
          <button
            className="btn btn-gradient-danger btn-sm"
            onClick={() => handleDelete(row.Id)}
          >
            
<span class="mdi mdi-delete-circle"></span>
          </button>

          {/* ✅ Toggle Active / Inactive Button */}
          {row.IsActive === 1 ? (
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => handleToggleActive(row)}
            >
              

<span class="mdi mdi-cancel"></span>
            </button>
          ) : (
            <button
              className="btn btn-outline-success btn-sm"
              onClick={() => handleToggleActive(row)}
            >
              
<span class="mdi mdi-access-point"></span>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="content-wrapper">
        <h3>Manage Delivery Types</h3>

        {/* Add/Edit Form */}
        <div className="card">
          <div className="card-body">
            <h4>{editId ? "Edit Delivery Type" : "Add Delivery Type"}</h4>
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Type Checkboxes */}
                <div className="col-md-4">
                  <label className="form-label">Delivery Type</label>
                  <div className="d-flex flex-row">
                   <input
  type="radio"
  id="Free"
  name="Type"
  value="Free"
  checked={form.Type === "Free"}
  onChange={handleChange}
/>
<label htmlFor="Free">Free</label>

<input
  type="radio"
  id="Paid"
  name="Type"
  value="Paid"
  checked={form.Type === "Paid"}
  onChange={handleChange}
/>
<label htmlFor="Paid">Paid</label>

                  </div>
                </div>

                {/* Payment Input */}
                <div className="col-md-4">
                  <label className="form-label">Payment Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter payment"
                    name="Payment"
                    value={form.Payment}
                    onChange={handleChange}
                    disabled={form.Type === "Free"}
                  />
                </div>

                {/* Active Checkbox */}
                <div className="col-md-4 mt-4">
                  <div className="form-check">
                    <input
  type="checkbox"
  name="IsActive"
  checked={form.IsActive}
  onChange={handleChange}
  className="form-check-input"
/>
<label htmlFor="IsActive" className="form-check-label">
  Active
</label>


                    
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <button type="submit" className="btn btn-gradient-primary me-2">
                  {editId ? "Update" : "Add"}
                </button>
                {editId && (
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => {
                      setEditId(null);
                      setForm({ Type: "", Payment: "", IsActive: true });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Data Table */}
        <div className="card mt-3">
          <div className="card-body">
            <h4>Existing Delivery Types</h4>
            <DataTable
              columns={columns}
              data={deliverytypes}
              pagination
              highlightOnHover
              striped
              dense
            />
          </div>
        </div>

        {/* Info Modal */}
        {showInfo && (
          <div
            className="modal"
            style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5>Delivery Type Info</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowInfo(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    <strong>ID:</strong> {showInfo.Id}
                  </p>
                  <p>
                    <strong>Type:</strong> {showInfo.Type}
                  </p>
                  <p>
                    <strong>Payment:</strong> {showInfo.Payment}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {showInfo.IsActive === 1 ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowInfo(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ManageDeliveryTypes;
