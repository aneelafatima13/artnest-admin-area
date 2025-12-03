import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "../utils/axiosSetup";
import { toast } from "react-toastify";

const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/users");
    setUsers(res.data);
    setTimeout(() => {
      if (!$.fn.DataTable.isDataTable("#usersTable")) {
        $("#usersTable").DataTable();
      }
    }, 300);
  };

  const loadRoles = async () => {
    const res = await axios.get("http://localhost:5000/api/assignrights/roles");
    setRoles(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveUser = async () => {
    if (!form.UserName) {
    toast.error("Username is required!");
    return;
  }

  if (!form.Password) {
    toast.error("Password is required!");
    return;
  }

  if (!form.Email) {
    toast.error("Email is required!");
    return;
  }

  if (!form.RoleId) {
    toast.error("Role is required!");
    return;
  }
    const mode = editing ? 2 : 1;
    const userPayload = {
      mode,
      Id: form.Id || null,
      FirstName: form.FirstName || null,
      LastName: form.LastName || null,
      UserName: form.UserName || null,
      Password: form.Password || null,
      Email: form.Email || null,
      PhoneNo: form.PhoneNo || null,
      Address: form.Address || null,
      Gender: form.Gender || null,
      CNIC: form.CNIC || null,
      Religion: form.Religion || null,
      Nationality: form.Nationality || null,
      RoleId: form.RoleId || null,
      DateofBirth: form.DateofBirth || null,
      MaritalStatus: form.MaritalStatus || null,
      CreatedBy: currentUser.id, // Replace with logged-in user ID if available
      ModifiedBy: editing ? currentUser.id : null,
    };

    await axios.post("http://localhost:5000/api/users", userPayload);
    alert(editing ? "User updated!" : "User added!");
    setEditing(false);
    setForm({});
    $("#usersTable").DataTable().destroy();
    loadUsers();
  };

  const showInfo = async (id) => {
    const res = await axios.get(`http://localhost:5000/api/users/${id}`);
    setSelectedUser(res.data);
    $("#infoModal").modal("show");
  };

  const editUser = async (id) => {
    const res = await axios.get(`http://localhost:5000/api/users/${id}`);
    setForm(res.data);
    setEditing(true);
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await axios.post("http://localhost:5000/api/users", { mode: 4, Id: id });
      alert("User deleted!");
      $("#usersTable").DataTable().destroy();
      loadUsers();
    }
  };

  const toggleActive = async (id) => {
    await axios.post("http://localhost:5000/api/users", { mode: 3, Id: id });
    $("#usersTable").DataTable().destroy();
    loadUsers();
  };

  return (
    <Layout>
      <div className="content-wrapper">
        <div className="card mb-4">
          <div className="card-body">
            <h4 className="card-title mb-4">
              {editing ? "Edit User" : "Add New User"}
            </h4>

            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  name="FirstName"
                  value={form.FirstName || ""}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="First Name"
                />
              </div>
              <div className="col-md-6 mb-3">
                <input
                  name="LastName"
                  value={form.LastName || ""}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Last Name"
                />
              </div>
              <div className="col-md-6 mb-3">
                <input
                  name="CNIC"
                  value={form.CNIC || ""}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="CNIC"
                />
              </div>
              <div className="col-md-6 mb-3">
                <input
                  name="UserName"
                  value={form.UserName || ""}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Username"
                />
              </div>
              <div className="col-md-6 mb-3">
                <input
                  type="password"
                  name="Password"
                  value={form.Password || ""}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Password"
                />
              </div>
              <div className="col-md-6 mb-3">
                <input
                  name="Email"
                  value={form.Email || ""}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Email"
                />
              </div>
              <div className="col-md-6 mb-3">
                <input
                  name="PhoneNo"
                  value={form.PhoneNo || ""}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Phone No"
                />
              </div>
              <div className="col-md-6 mb-3">
                <input
                  name="Address"
                  value={form.Address || ""}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Address"
                />
              </div>
             <div className="col-md-6 mb-3">
  <label className="form-label d-block">Gender</label>
  <div className="d-flex flex-row ms-2">
    <div className="form-check form-check-inline">
      <input
        className="form-check-input ms-1"
        type="checkbox"
        id="male"
        name="Gender"
        value="Male"
        checked={form.Gender === "Male"}
        onChange={() => setForm({ ...form, Gender: "Male" })}
      />
      <label className="form-check-label me-3" htmlFor="male">
        Male
      </label>
    </div>

    <div className="form-check form-check-inline">
      <input
        className="form-check-input ms-1"
        type="checkbox"
        id="female"
        name="Gender"
        value="Female"
        checked={form.Gender === "Female"}
        onChange={() => setForm({ ...form, Gender: "Female" })}
      />
      <label className="form-check-label" htmlFor="female">
        Female
      </label>
    </div>
  </div>
</div>

              
              <div className="col-md-6 mb-3">
                <input
                  name="Religion"
                  value={form.Religion || ""}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Religion"
                />
              </div>
              <div className="col-md-6 mb-3">
                <input
                  name="Nationality"
                  value={form.Nationality || ""}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Nationality"
                />
              </div>
              <div className="col-md-6 mb-3">
                <select
                  name="RoleId"
                  value={form.RoleId || ""}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Role</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <input
                  type="date"
                  name="DateofBirth"
                  value={form.DateofBirth || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            <div className="col-md-6 mb-3">
  <label className="form-label d-block">Marital Status</label>
  <div className="d-flex flex-row ms-2">
    <div className="form-check form-check-inline">
      <input
        className="form-check-input ms-1"
        type="checkbox"
        id="single"
        name="MaritalStatus"
        value="Single"
        checked={form.MaritalStatus === "Single"}
        onChange={() =>
          setForm((prev) => ({
            ...prev,
            MaritalStatus: prev.MaritalStatus === "Single" ? "" : "Single",
          }))
        }
      />
      <label className="form-check-label me-2" htmlFor="single">
        Single
      </label>
    </div>

    <div className="form-check form-check-inline">
      <input
        className="form-check-input ms-1"
        type="checkbox"
        id="married"
        name="MaritalStatus"
        value="Married"
        checked={form.MaritalStatus === "Married"}
        onChange={() =>
          setForm((prev) => ({
            ...prev,
            MaritalStatus: prev.MaritalStatus === "Married" ? "" : "Married",
          }))
        }
      />
      <label className="form-check-label me-2" htmlFor="married">
        Married
      </label>
    </div>
  </div>
</div>


            </div>
<div className="text-end m-4">
              <button className="btn btn-primary me-2" onClick={saveUser}>
              {editing ? "Update" : "Save"}
            </button>
            {editing && (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setEditing(false);
                  setForm({});
                }}
              >
                Cancel
              </button>
            )}
            </div>
            
          </div>
        </div>

        {/* USERS TABLE */}
        <div className="card">
          <div className="card-body">
            <h4 className="card-title mb-4">Users List</h4>
            <table id="usersTable" className="display table table-bordered">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.Id}>
                    <td>{u.UserName}</td>
                    <td>{u.RoleName}</td>
                    <td>{u.IsActive ? "Yes" : "No"}</td>
                    <td>
                      <button
                        className="btn btn-info btn-sm me-2"
                        onClick={() => showInfo(u.Id)}
                      >
                        Info
                      </button>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => editUser(u.Id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm me-2"
                        onClick={() => deleteUser(u.Id)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => toggleActive(u.Id)}
                      >
                        {u.IsActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Modal */}
        <div className="modal fade" id="infoModal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content p-3">
              {selectedUser && (
                <>
                  <h5>{selectedUser.UserName} - Info</h5>
                  <p><b>Email:</b> {selectedUser.Email}</p>
                  <p><b>Phone:</b> {selectedUser.PhoneNo}</p>
                  <p><b>Address:</b> {selectedUser.Address}</p>
                  <p><b>Gender:</b> {selectedUser.Gender}</p>
                  <p><b>CNIC:</b> {selectedUser.CNIC}</p>
                  <p><b>Religion:</b> {selectedUser.Religion}</p>
                  <p><b>Nationality:</b> {selectedUser.Nationality}</p>
                  <p><b>Role:</b> {selectedUser.RoleId}</p>
                  <p><b>Date of Birth:</b> {selectedUser.DateofBirth}</p>
                  <p><b>Marital Status:</b> {selectedUser.MaritalStatus}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageUsers;
