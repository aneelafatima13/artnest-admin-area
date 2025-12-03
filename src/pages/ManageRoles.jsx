import React, { useState, useEffect } from "react";
import axios from "../utils/axiosSetup";
import DataTable from "react-data-table-component";
import Layout from "../components/Layout";

function ManageRoles() {
  const [roleName, setRoleName] = useState("");
  const [roles, setRoles] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showInfo, setShowInfo] = useState(null);

  // Fetch roles from backend
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/roles");
      setRoles(res.data);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roleName) return alert("Enter a role name");

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/roles/${editId}`, { name: roleName });
        alert("Role updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/roles", { name: roleName });
        alert("Role added successfully");
      }
      setRoleName("");
      setEditId(null);
      fetchRoles();
    } catch (err) {
      console.error("Error saving role:", err);
    }
  };

  const handleEdit = (role) => {
    setRoleName(role.name);
    setEditId(role.id);
  };

  const handleCancel = () => {
    setEditId(null);
    setRoleName("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await axios.delete(`http://localhost:5000/api/roles/${id}`);
        fetchRoles();
      } catch (err) {
        console.error("Error deleting role:", err);
      }
    }
  };

  const handleInfo = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/roles/${id}`);
      setShowInfo(res.data);
    } catch (err) {
      console.error("Error fetching role details:", err);
    }
  };

  // Define DataTable columns
  const columns = [
  { name: "ID", selector: (row) => row.id, sortable: true, width: "80px" },
  { name: "Role Name", selector: (row) => row.name, sortable: true},
  {
  name: "Actions",
  cell: (row) => (
    <div className="d-flex justify-content-center align-items-center" style={{ gap: "6px", padding: "4px 0" }}>
      <button
        type="button"
        className="btn btn-gradient-info btn-rounded btn-icon"
        style={{ width: "34px", height: "34px" }}
        title="Info"
        onClick={() => handleInfo(row.id)}
      >
        <i className="mdi mdi-information-outline" style={{ fontSize: "16px" }}></i>
      </button>

      <button
        type="button"
        className="btn btn-gradient-warning btn-rounded btn-icon"
        style={{ width: "34px", height: "34px" }}
        title="Edit"
        onClick={() => handleEdit(row)}
      >
        <i className="mdi mdi-pencil-outline" style={{ fontSize: "16px" }}></i>
      </button>

      <button
        type="button"
        className="btn btn-gradient-danger btn-rounded btn-icon me-6"
        style={{ width: "34px", height: "34px" }}
        title="Delete"
        onClick={() => handleDelete(row.id)}
      >
        <i className="mdi mdi-delete-outline" style={{ fontSize: "16px" }}></i>
      </button>
    </div>
  ),
  ignoreRowClick: true,
  allowOverflow: true,
  button: true,
},
];


  return (
    <Layout>
      <div className="content-wrapper">
        <h3>Manage Roles</h3>

        {/* Add/Edit Role Form */}
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">{editId ? "Edit Role" : "Add Role"}</h4>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="form-control"
                placeholder="Enter role name"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
              />
              <div className="mt-2">
                <button type="submit" className="btn btn-gradient-primary me-2">
                  {editId ? "Update" : "Add"}
                </button>
                {editId && (
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Roles Table */}
        <div className="card mt-3">
          <div className="card-body">
            <h4 className="card-title">Existing Roles</h4>
            <DataTable
              columns={columns}
              data={roles}
              pagination
              highlightOnHover
              striped
              dense
              customStyles={{
                headCells: { style: { backgroundColor: "#f3f3f3", fontWeight: "bold" } },
              }}
            />
          </div>
        </div>

        {/* Info Popup */}
        {showInfo && (
          <div
  className="modal"
  style={{
    display: "block",
    background: "rgba(0, 0, 0, 0.5)", // semi-transparent dark overlay behind modal
  }}
>
  <div className="modal-dialog">
    <div
      className="modal-content"
      style={{
        backgroundColor: "#fff", // ✅ white modal background
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      <div className="modal-header">
        <h5 className="modal-title">Role Details</h5>
        <button
          type="button"
          className="btn-close"
          onClick={() => setShowInfo(null)}
        ></button>
      </div>
      <div className="modal-body">
        <p>
          <strong>ID:</strong> {showInfo.id}
        </p>
        <p>
          <strong>Name:</strong> {showInfo.name}
        </p>
      </div>
      <div className="modal-footer">
        <button
          type="button"
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

export default ManageRoles;
