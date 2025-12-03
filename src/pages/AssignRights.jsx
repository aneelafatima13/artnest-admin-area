import React, { useEffect, useState } from "react";
import axios from "../utils/axiosSetup";
import Layout from "../components/Layout";

const AssignRights = () => {
  const [roles, setRoles] = useState([]);
  const [rights, setRights] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [assignedRights, setAssignedRights] = useState([]);
  const [selectedRights, setSelectedRights] = useState([]);

  // 🔹 Load roles and rights
  useEffect(() => {
    axios.get("http://localhost:5000/api/assignrights/roles").then((res) => setRoles(res.data));
    axios.get("http://localhost:5000/api/assignrights/rights").then((res) => setRights(res.data));
  }, []);

  // 🔹 Load assigned rights for selected role
  useEffect(() => {
    if (selectedRole) {
      axios
        .get(`http://localhost:5000/api/assignrights/${selectedRole}`)
        .then((res) => setAssignedRights(res.data))
        .catch(() => setAssignedRights([]));
    }
  }, [selectedRole]);

  // Handle checkbox
  const toggleRight = (id) => {
    setSelectedRights((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  // Save to DB
  const handleSave = async () => {
    if (!selectedRole) return alert("Please select a role first!");
    try {
      await axios.post("http://localhost:5000/api/assignrights", {
        roleId: selectedRole,
        rightIds: selectedRights,
      });
      alert("Rights assigned successfully!");
    } catch (err) {
      console.error(err);
      alert("Error assigning rights");
    }
  };

  return (
    <Layout>
      <div className="content-wrapper">
       
        <div className="card">
          <div className="card-body">
            <h4 className="card-title mb-4">Manage Rights</h4>

          <select
            className="form-control"
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setSelectedRights([]); // clear selection
            }}
          >
            <option value="">-- Select Role --</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* Rights badges */}
        <div className="d-flex flex-wrap gap-2 m-5">
          {rights.map((r) => (
            <span
              key={r.id}
              className={`badge p-3 ${
                selectedRights.includes(r.id) || assignedRights.includes(r.id)
                  ? "bg-primary"
                  : "bg-secondary"
              }`}
              style={{ cursor: "pointer", fontSize: "1rem" }}
              onClick={() => toggleRight(r.id)}
            >
              {r.right_name}
            </span>
          ))}
        </div>

<div className="text-end m-4">
              <button className="btn btn-gradient-primary" onClick={handleSave}>
                Assign Rights
              </button>
            </div>
        
      </div>
      </div>
    </Layout>
  );
};

export default AssignRights;
