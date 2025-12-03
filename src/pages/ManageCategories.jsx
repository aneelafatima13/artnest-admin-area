import React, { useState, useEffect } from "react";
import axios from "../utils/axiosSetup";
import DataTable from "react-data-table-component";
import Layout from "../components/Layout";
import { toast } from "react-toastify";

const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");

function ManageCategories() {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showInfo, setShowInfo] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error("Failed to load categories.", { position: "top-right" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName) {
      toast.warn("Enter a category name.", { position: "top-right" });
      return;
    }

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/categories/${editId}`, {
          name: categoryName,
          ModifiedBy: currentUser.Id,
        });
        toast.success("Category updated successfully!", { position: "top-right" });
      } else {
        await axios.post("http://localhost:5000/api/categories", {
          name: categoryName,
          CreatedBy: currentUser.Id,
        });
        toast.success("Category added successfully!", { position: "top-right" });
      }

      setCategoryName("");
      setEditId(null);
      fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err);
      toast.error("Error saving category.", { position: "top-right" });
    }
  };

  const handleEdit = (category) => {
    setCategoryName(category.name);
    setEditId(category.id);
    toast.info("Edit mode enabled.", { position: "top-right" });
  };

  const handleCancel = () => {
    setEditId(null);
    setCategoryName("");
    toast.info("Edit canceled.", { position: "top-right" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`http://localhost:5000/api/categories/${id}`);
        fetchCategories();
        toast.success("Category deleted successfully!", { position: "top-right" });
      } catch (err) {
        console.error("Error deleting category:", err);
        toast.error("Failed to delete category.", { position: "top-right" });
      }
    }
  };

  const handleInfo = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/categories/${id}`);
      setShowInfo(res.data);
    } catch (err) {
      console.error("Error fetching category details:", err);
      toast.error("Unable to fetch category details.", { position: "top-right" });
    }
  };

  const columns = [
    { name: "ID", selector: (row) => row.Id, sortable: true, width: "80px" },
    { name: "Category Name", selector: (row) => row.Name, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ gap: "6px", padding: "4px 0" }}
        >
          <button
            type="button"
            className="btn btn-gradient-info btn-rounded btn-icon"
            style={{ width: "34px", height: "34px" }}
            title="Info"
            onClick={() => handleInfo(row.Id)}
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
            onClick={() => handleDelete(row.Id)}
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
        <h3>Manage Categories</h3>

        {/* Add/Edit Category Form */}
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">{editId ? "Edit Category" : "Add Category"}</h4>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="form-control"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
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

        {/* Categories Table */}
        <div className="card mt-3">
          <div className="card-body">
            <h4 className="card-title">Existing Categories</h4>
            <DataTable
              columns={columns}
              data={categories}
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
              background: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <div className="modal-dialog">
              <div
                className="modal-content"
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
              >
                <div className="modal-header">
                  <h5 className="modal-title">Category Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowInfo(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p><strong>ID:</strong> {showInfo.Id}</p>
                  <p><strong>Name:</strong> {showInfo.Name}</p>
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

export default ManageCategories;
