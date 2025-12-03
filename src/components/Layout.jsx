import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axiosSetup";

function Layout({ children }) {
  const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");

  // Logout function
  const navigate = useNavigate(); // ✅ useNavigate hook

  // Logout function
  const handleLogout = async () => {
    try {
      // 1. Clear frontend session
      sessionStorage.removeItem("user");

      // 2. Call backend logout API to destroy server session
      await axios.post("http://localhost:5000/api/logout", {}, { withCredentials: true });

      // 3. Redirect to login page
      navigate("/"); // ✅ now this works

    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  

  return (
    <>
   
    
      {/* partial:partials/_navbar.html */}
      <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
          <Link className="navbar-brand brand-logo" to="/"><img src="/assets/images/logo.svg" alt="logo" /></Link>
          <Link className="navbar-brand brand-logo-mini" to="/"><img src="/assets/images/logo-mini.svg" alt="logo" /></Link>
        </div>
        <div className="navbar-menu-wrapper d-flex align-items-stretch">
          <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
            <span className="mdi mdi-menu"></span>
          </button>
          <div className="search-field d-none d-md-block">
            <form className="d-flex align-items-center h-100" action="#">
              <div className="input-group">
                <div className="input-group-prepend bg-transparent">
                  <i className="input-group-text border-0 mdi mdi-magnify"></i>
                </div>
                <input type="text" className="form-control bg-transparent border-0" placeholder="Search projects" />
              </div>
            </form>
          </div>
          <ul className="navbar-nav navbar-nav-right">
            <li className="nav-item nav-profile dropdown">
              <a className="nav-link dropdown-toggle" id="profileDropdown" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                <div className="nav-profile-img">
                  <img src="/assets/images/faces/face1.jpg" alt="image" />
                  <span className="availability-status online"></span>
                </div>
                <div className="nav-profile-text">
                  <p className="mb-1 text-black">{currentUser.UserName || "Guest"}</p>
                </div>
              </a>
              <div className="dropdown-menu navbar-dropdown" aria-labelledby="profileDropdown">
                <a className="dropdown-item" href="#">
                  <i className="mdi mdi-cached me-2 text-success"></i> Activity Log </a>
                <div className="dropdown-divider"></div>
                <a
  href="#"
  className="dropdown-item"
  onClick={(e) => {
    e.preventDefault(); // prevent the page from jumping
    handleLogout();     // call your logout function
  }}
>
  <i className="mdi mdi-logout me-2 text-primary"></i> Signout
</a>

              </div>
            </li>
            <li className="nav-item d-none d-lg-block full-screen-link">
              <a className="nav-link">
                <i className="mdi mdi-fullscreen" id="fullscreen-button"></i>
              </a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link count-indicator dropdown-toggle" id="messageDropdown" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="mdi mdi-email-outline"></i>
                <span className="count-symbol bg-warning"></span>
              </a>
              <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="messageDropdown">
                <h6 className="p-3 mb-0">Messages</h6>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <img src="/assets/images/faces/face4.jpg" alt="image" className="profile-pic"/>
                  </div>
                  <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                    <h6 className="preview-subject ellipsis mb-1 font-weight-normal">Mark send you a message</h6>
                    <p className="text-gray mb-0"> 1 Minutes ago </p>
                  </div>
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <img src="/assets/images/faces/face2.jpg" alt="image" className="profile-pic"/>
                  </div>
                  <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                    <h6 className="preview-subject ellipsis mb-1 font-weight-normal">Cregh send you a message</h6>
                    <p className="text-gray mb-0"> 15 Minutes ago </p>
                  </div>
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <img src="/assets/images/faces/face3.jpg" alt="image" className="profile-pic"/>
                  </div>
                  <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                    <h6 className="preview-subject ellipsis mb-1 font-weight-normal">Profile picture updated</h6>
                    <p className="text-gray mb-0"> 18 Minutes ago </p>
                  </div>
                </a>
                <div className="dropdown-divider"></div>
                <h6 className="p-3 mb-0 text-center">4 new messages</h6>
              </div>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link count-indicator dropdown-toggle" id="notificationDropdown" href="#" data-bs-toggle="dropdown">
                <i className="mdi mdi-bell-outline"></i>
                <span className="count-symbol bg-danger"></span>
              </a>
              <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="notificationDropdown">
                <h6 className="p-3 mb-0">Notifications</h6>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-success">
                      <i className="mdi mdi-calendar"></i>
                    </div>
                  </div>
                  <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                    <h6 className="preview-subject font-weight-normal mb-1">Event today</h6>
                    <p className="text-gray ellipsis mb-0"> Just a reminder that you have an event today </p>
                  </div>
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-warning">
                      <i className="mdi mdi-settings"></i>
                    </div>
                  </div>
                  <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                    <h6 className="preview-subject font-weight-normal mb-1">Settings</h6>
                    <p className="text-gray ellipsis mb-0"> Update dashboard </p>
                  </div>
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-info">
                      <i className="mdi mdi-link-variant"></i>
                    </div>
                  </div>
                  <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                    <h6 className="preview-subject font-weight-normal mb-1">Launch Admin</h6>
                    <p className="text-gray ellipsis mb-0"> New admin wow! </p>
                  </div>
                </a>
                <div className="dropdown-divider"></div>
                <h6 className="p-3 mb-0 text-center">See all notifications</h6>
              </div>
            </li>
            <li className="nav-item nav-logout d-none d-lg-block">
  <a
    className="nav-link"
    href="#"
    onClick={(e) => {
      e.preventDefault(); // prevent page reload
      handleLogout();     // call your logout function
    }}
  >
    <i className="mdi mdi-power"></i>
  </a>
</li>

            <li className="nav-item nav-settings d-none d-lg-block">
              <a className="nav-link" href="#">
                <i className="mdi mdi-format-line-spacing"></i>
              </a>
            </li>
          </ul>
          <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
            <span className="mdi mdi-menu"></span>
          </button>
        </div>
      </nav>
      {/* partial */}
      <div className="container-fluid page-body-wrapper">
        {/* partial:partials/_sidebar.html */}
        <nav className="sidebar sidebar-offcanvas" id="sidebar">
          <ul className="nav">
            <li className="nav-item nav-profile">
              <Link to="/home" className="nav-link">
                <div className="nav-profile-image">
                  <img src="/assets/images/faces/face1.jpg" alt="profile"/>
                  <span className="login-status online"></span>
                  {/*change to offline or busy as needed*/}
                </div>
                <div className="nav-profile-text d-flex flex-column">
                  <span className="font-weight-bold mb-2">David Grey. H</span>
                  <span className="text-secondary text-small">Project Manager</span>
                </div>
                <i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/home">
                <span className="menu-title">Dashboard</span>
                <i className="mdi mdi-home menu-icon"></i>
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="collapse" href="#ui-basic" aria-expanded="false" aria-controls="ui-basic">
                <span className="menu-title">Manage Roles/Rights</span>
                <i className="menu-arrow"></i>
                <i className="mdi mdi-crosshairs-gps menu-icon"></i>
              </a>
              <div className="collapse" id="ui-basic">
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
  <Link className="nav-link" to="/manageroles">Manage Roles</Link>
  <Link className="nav-link" to="/managerights">Manage Rights</Link>
  <Link className="nav-link" to="/assignrights">Assign Rights</Link>
</li>

   </ul>
              </div>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link" to="/manageusers">
                <span className="menu-title">Manage Users</span>
                <i className="mdi mdi-chart-bar menu-icon"></i>
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/managecategories">
                <span className="menu-title">Manage Categories</span>
                <i className="mdi mdi-chart-bar menu-icon"></i>
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/products">
                <span className="menu-title">Manage Products</span>
                <i className="mdi mdi-chart-bar menu-icon"></i>
              </Link>
            </li>
<li className="nav-item">
              <Link className="nav-link" to="/DeliveriesTypes">
                <span className="menu-title">Manage Delivery Types</span>
                <i className="mdi mdi-chart-bar menu-icon"></i>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/orders">
                <span className="menu-title">Manage Orders</span>
                <i className="mdi mdi-chart-bar menu-icon"></i>
              </Link>
            </li>
           <li className="nav-item">
              <a className="nav-link" data-bs-toggle="collapse" href="#ui-basic" aria-expanded="false" aria-controls="ui-basic">
                <span className="menu-title">Reports</span>
                <i className="menu-arrow"></i>
                <i className="mdi mdi-crosshairs-gps menu-icon"></i>
              </a>
              <div className="collapse" id="ui-basic">
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
  <Link className="nav-link" to="/manageroles">Products Report</Link>
  <Link className="nav-link" to="/managerights">Category Reports</Link>
  <Link className="nav-link" to="/assignrights">Users Report</Link>
</li>

   </ul>
              </div>
            </li>
          </ul>
        </nav>
        {/* partial */}
        
        
          <div className="main-panel col-lg-12 col-12">
{children}
         
          {/* content-wrapper ends */}
          {/* partial:partials/_footer.html */}
          <footer className="footer">
            <div className="container-fluid d-flex justify-content-between">
              <span className="text-muted d-block text-center text-sm-start d-sm-inline-block">Copyright © bootstrapdash.com 2021</span>
              <span className="float-none float-sm-end mt-1 mt-sm-0 text-end"> Free <a href="https://www.bootstrapdash.com/bootstrap-admin-template/" target="_blank">Bootstrap admin template</a> from Bootstrapdash.com</span>
            </div>
          </footer>
          {/* partial */}
          </div>
        </div>
         
       
        {/* main-panel ends */}
      
      {/* page-body-wrapper ends */}
    
  
          {/* Footer section */}
    </>
  );
}

export default Layout;
