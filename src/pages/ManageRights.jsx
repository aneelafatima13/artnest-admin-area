import React, { useEffect, useState } from "react";
import axios from "../utils/axiosSetup";
import Layout from "../components/Layout";

const ManageRights = () => {
  const [existingRights, setExistingRights] = useState([]);
  const [selectedRights, setSelectedRights] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const allRights = [
    "Manage Roles Rights", "Assign Rights",
    "Manage Departments Rights", "Add User",
    "Update User", "View User",
    "Delete Users", 
    "Add Product", "Update Product",
    "View Product", "Delete Product",
    "Add Category", "Update Category",
    "View Category", "Delete Category",
    "Add Sub Category", "View Orders",
    "Assign Orders", "View Assigned Order",
  ];

  // ✅ Fetch existing rights
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/rights")
      .then((res) => setExistingRights(res.data.map((r) => r.right_name)))
      .catch((err) => console.error(err));
  }, []);

  const handleCheckbox = (value) => {
    if (selectedRights.includes(value)) {
      setSelectedRights(selectedRights.filter((r) => r !== value));
    } else {
      setSelectedRights([...selectedRights, value]);
    }
  };

  // ✅ Handle Select All
  const handleSelectAll = () => {
    if (!selectAll) {
      const availableRights = allRights.filter(
        (r) => !existingRights.includes(r)
      );
      setSelectedRights(availableRights);
    } else {
      setSelectedRights([]);
    }
    setSelectAll(!selectAll);
  };

  const handleSubmit = async () => {
    if (selectedRights.length === 0) return alert("No rights selected!");

    try {
      await axios.post("http://localhost:5000/api/rights", {
        rights: selectedRights,
      });
      alert("Rights added successfully!");
      setSelectedRights([]);
      setSelectAll(false);
      // Reload updated rights
      const res = await axios.get("http://localhost:5000/api/rights");
      setExistingRights(res.data.map((r) => r.right_name));
    } catch (err) {
      console.error(err);
      alert("Error adding rights.");
    }
  };

  return (
    <Layout>
      <div className="content-wrapper">
       
        <div className="card">
          <div className="card-body">
            <h4 className="card-title mb-4">Manage Rights</h4>

            {/* ✅ Select All */}
            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="selectAll"
                checked={selectAll}
                onChange={handleSelectAll}
              />
              <label className="form-check-label fw-bold" htmlFor="selectAll">
                Select All
              </label>
            </div>

            {/* ✅ Rights List */}
            <div className="rights-grid">
              {allRights.map((right) => (
                <div key={right} className="form-check mt-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={right}
                    id={right}
                    disabled={existingRights.includes(right)}
                    checked={selectedRights.includes(right)}
                    onChange={() => handleCheckbox(right)}
                  />
                  <label className="form-check-label" htmlFor={right}>
                    {right}
                  </label>
                </div>
              ))}
            </div>

            {/* ✅ Submit Button */}
            <div className="text-end mt-4">
              <button className="btn btn-gradient-primary" onClick={handleSubmit}>
                Add Selected Rights
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Inline styles for responsive grid */}
      <style>{`
        .rights-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem 1.5rem;
        }

        @media (min-width: 992px) {
          .rights-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </Layout>
  );
};

export default ManageRights;
