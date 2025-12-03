import React, { useState, useEffect } from "react";
import axios from "../utils/axiosSetup";
import DataTable from "react-data-table-component";
import Layout from "../components/Layout";
import { toast } from "react-toastify";

const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");

const initialFormState = {
  Name: "",
  Price: "",
  AvailableQuantity: "",
  CategoryId: "",
  OnSale: false,
  InStock: true,
  Details: "",
  SalePercentage: "",
  Height: "",
  Width: "",
  Shape: "",
};

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editId, setEditId] = useState(null);
  const [showInfo, setShowInfo] = useState(null);

  // Main form image states
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [primaryImage, setPrimaryImage] = useState(null);

  // Modal image management
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [modalNewImages, setModalNewImages] = useState([]);
  const [modalPreviewImages, setModalPreviewImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);



const handleViewDetails = async (id) => {
  try {
    const res = await fetch(`http://localhost:5000/api/products/${id}`);
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Failed to fetch product details.");
      return;
    }

    setSelectedProduct(data); // store in state
    setShowDetailsModal(true); // open modal
  } catch (error) {
    console.error("Error fetching product details:", error);
    toast.error("Server error fetching product details.");
  }
};


  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      toast.error("Failed to load products.");
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Auto set InStock based on quantity
    if (name === "AvailableQuantity") {
      const qty = Number(value);
      setForm((prev) => ({
        ...prev,
        [name]: qty,
        InStock: qty > 0,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Create unique preview URLs
    const uniquePreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setPreviewImages(uniquePreviews);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (previewImages.length > 0 && primaryImage === null) {
    toast.error("Please select one Primary Image before saving.");
    return;
  }

  const formData = new FormData();
  const updatedForm = {
    ...form,
    InStock: form.AvailableQuantity > 0 ? 1 : 0, // ✅ auto set InStock
  };

  Object.keys(updatedForm).forEach((key) => {
    formData.append(key, updatedForm[key]);
  });

  formData.append("Addedby", currentUser.Id);
  formData.append("Modifiedby", currentUser.Id);
  formData.append("UserName", currentUser.UserName);

  selectedFiles.forEach((file, index) => {
    formData.append("Images", file);
    formData.append("IsPrimaryFlags", index === primaryImage ? "true" : "false");
  });

  try {
    const url = editId
      ? `http://localhost:5000/api/products/${editId}`
      : "http://localhost:5000/api/products";
    const method = editId ? "put" : "post";

    await axios({
      method,
      url,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success(editId ? "Product updated!" : "Product added!");
    fetchProducts();
    resetForm();
  } catch (err) {
    toast.error("Error saving product");
    console.error(err);
  }
};

  const resetForm = () => {
    setForm(initialFormState);
    setEditId(null);
    setSelectedFiles([]);
    setPreviewImages([]);
    setPrimaryImage(null);
  };


const handleEdit = async (id) => {
  try {
    const res = await fetch(`http://localhost:5000/api/products/${id}`);
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Failed to fetch product details.");
      return;
    }

    // ✅ Populate form data
    setForm({
      Name: data.Name || "",
      Price: data.Price || "",
      AvailableQuantity: data.AvailableQuantity || 0,
      CategoryId: data.CategoryId || "",
      OnSale: !!data.OnSale,
      InStock: !!data.InStock,
      Details: data.Details || "",
      SalePercentage: data.SalePercentage || "",
      Height: data.Height || "",
      Width: data.Width || "",
      Shape: data.Shape || "",
    });

    setEditId(data.Id);

    // ✅ Normalize IsPrimary (Buffer → Boolean)
    const normalizedImages =
      data.Images?.map((img) => ({
        url: `http://localhost:5000/${img.ImageFile}`,
        isPrimary:
          img.IsPrimary === true ||
          img.IsPrimary === 1 ||
          img.IsPrimary?.data?.[0] === 1,
      })) || [];

    setPreviewImages(normalizedImages);

    // ✅ Automatically detect which one is primary
    const primaryIndex = normalizedImages.findIndex((img) => img.isPrimary);
    setPrimaryImage(primaryIndex !== -1 ? primaryIndex : null);

    setSelectedFiles([]);
    toast.info("Edit mode enabled. Product data loaded.");
  } catch (error) {
    console.error("Error fetching product details:", error);
    toast.error("Error fetching product details.");
  }
};

  const handleCancel = () => {
    resetForm();
    toast.info("Edit canceled.");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
      toast.success("Product deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete product.");
      console.error(err);
    }
  };

  const handleManageImages = async (product) => {
    setSelectedProduct(product);
    setShowImageModal(true);
    await fetchProductImages(product.Id);
  };

  const fetchProductImages = async (productId) => {
  if (!productId) {
    console.warn("⚠️ fetchProductImages called without a valid productId");
    return;
  }

  try {
    const res = await axios.get(`http://localhost:5000/api/products/${productId}`);
    console.log("📦 Product data:", res.data);

    const images = Array.isArray(res.data)
      ? res.data[0]?.Images || []
      : res.data.Images || [];

    setProductImages(images);
    setModalPreviewImages([]);
    setModalNewImages([]);
  } catch (err) {
    console.error("❌ Error fetching product images:", err);
  }
};


  const handleModalImageChange = (e) => {
    const files = Array.from(e.target.files);
    setModalNewImages(files);
    const previews = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setModalPreviewImages(previews);
  };

  const handleUploadNewImages = async () => {
    if (!modalNewImages.length) return;

    try {
      const formData = new FormData();
      formData.append("Name", selectedProduct.Name);
      formData.append("CategoryId", selectedProduct.CategoryId);
      formData.append("Addedby", currentUser.Id);
      formData.append("Username", currentUser.UserName);

      modalNewImages.forEach((file) => formData.append("Images", file));

      await axios.post(
        `http://localhost:5000/api/products/${selectedProduct.Id}/images`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Images uploaded!");
      await fetchProductImages(selectedProduct.Id);
      setModalNewImages([]);
      setModalPreviewImages([]);
    } catch (err) {
      toast.error("Error uploading images");
      console.error(err);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await axios.delete(`http://localhost:5000/api/product-images/${imageId}`);
      toast.success("Image deleted");
      await fetchProductImages(selectedProduct.Id);
    } catch (err) {
      toast.error("Error deleting image");
      console.error(err);
    }
  };

  const handleSetPrimaryImage = async (imageId) => {
    try {
      await axios.put(
  `http://localhost:5000/api/products/product-images/${imageId}/set-primary`,
  { productId: selectedProduct.Id }
);
toast.success("Primary image updated");
      await fetchProductImages(selectedProduct.Id);
    } catch (err) {
      toast.error("Error setting primary image");
      console.error(err);
    }
  };

  

  const columns = [
  { name: "ID", selector: (row) => row.Id, sortable: true, width: "80px" },
  { name: "Name", selector: (row) => row.Name, sortable: true },
  { name: "Price", selector: (row) => row.Price, sortable: true },
  { name: "Quantity", selector: (row) => row.AvailableQuantity, sortable: true },
  {
    name: "In Stock",
    selector: (row) => (row.InStock ? "Yes" : "No"),
    sortable: true,
  },
  {
    name: "On Sale",
    selector: (row) => (row.OnSale ? "Yes" : "No"),
    sortable: true,
  },
  {
    name: "Actions",
    cell: (row) => (
      <div className="d-flex content-center gap-1">
        <button
          className="btn btn-gradient-info btn-sm"
          title="View Details"
          onClick={() => handleViewDetails(row.Id)}
        >
          <i className="mdi mdi-eye-outline"></i>
        </button>
        <button
          className="btn btn-gradient-warning btn-sm"
          title="Edit"
          onClick={() => handleEdit(row.Id)}
        >
          <i className="mdi mdi-pencil-outline"></i>
        </button>
        <button
          className="btn btn-gradient-danger btn-sm"
          title="Delete"
          onClick={() => handleDelete(row.Id)}
        >
          <i className="mdi mdi-delete-outline"></i>
        </button>
        <button
          className="btn btn-gradient-primary btn-sm"
          title="Manage Images"
          onClick={() => handleManageImages(row)}
        >
          <i className="mdi mdi-image-album"></i>

        </button>
      </div>
    ),
  },
];


  return (
    <Layout>
      <div className="content-wrapper">
        <h3>Manage Products</h3>

        {/* Form */}
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">{editId ? "Edit Product" : "Add Product"}</h4>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="row g-3">
                {/* Left side */}
                <div className="col-md-8">
                  <div className="row">
                    <div className="col-md-6 mt-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Product Name"
                        name="Name"
                        value={form.Name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mt-2">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Price"
                        name="Price"
                        value={form.Price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                     <div className="col-md-6 mt-2">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Height"
                        name="Height"
                        value={form.Height}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 mt-2">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Width"
                        name="Width"
                        value={form.Width}
                        onChange={handleChange}
                      />
                    </div>

                   

                    <div className="col-md-6 form-check mt-3">
                      <input
                        type="checkbox"
                        className="form-check-input ms-4 me-2"
                        id="onSale"
                        name="OnSale"
                        checked={form.OnSale}
                        onChange={handleChange}
                        style={{ appearance: "auto" }}
                      />
                      <label htmlFor="onSale" className="form-check-label">
                        On Sale
                      </label>
                    </div>

                    <div className="col-md-6 mt-2">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Sale Percentage"
                        name="SalePercentage"
                        value={form.SalePercentage}
                        onChange={handleChange}
                        disabled={!form.OnSale}
                      />
                    </div>

                    
                    <div className="col-md-6 mt-2">
                      <select
                        className="form-control"
                        name="CategoryId"
                        value={form.CategoryId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.Id} value={cat.Id}>
                            {cat.Name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mt-2">
                      <select
                        className="form-control"
                        name="Shape"
                        value={form.Shape}
                        onChange={handleChange}
                      >
                        <option value="">Select Shape</option>
                        <option value="Square">Square</option>
                        <option value="Rectangle">Rectangle</option>
                        <option value="Circle">Circle</option>
                        <option value="Triangle">Triangle</option>
                        <option value="Pentagon">Pentagon</option>
                        <option value="Hexagon">Hexagon</option>
                        <option value="Heptagon">Heptagon</option>
                        <option value="Octagon">Octagon</option>
                      </select>
                    </div>

                    <div className="col-md-6 mt-2">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Available Quantity"
                        name="AvailableQuantity"
                        value={form.AvailableQuantity}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Right side */}
                <div className="col-md-4">
                  <textarea
                    className="form-control mt-2"
                    placeholder="Product Details"
                    name="Details"
                    rows="16"
                    value={form.Details}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="mt-4 border-top pt-3">
                <label className="fw-bold">Upload Product Images</label>
                <input
                  type="file"
                  className="form-control"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />

                {previewImages.length > 0 && (
                  <div className="table-responsive mt-3">
                    <table className="table table-bordered align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Preview</th>
                          <th>Primary</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewImages.map((img, index) => (
                          <tr key={index}>
                            <td>
                              <img
                                src={img.url}
                                alt={img.name}
                                style={{
                                  width: "70px",
                                  height: "70px",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                }}
                              />
                            </td>
                           <td className="text-center">
                              <input
                                type="radio"
                                name="primaryImage"
                                checked={primaryImage === index}
                                onChange={() => setPrimaryImage(index)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="mt-4 text-end">
                <button type="submit" className="btn btn-gradient-primary me-2">
                  {editId ? "Update Product" : "Add Product"}
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

        {/* Products Table */}
        <div className="card mt-3">
          <div className="card-body">
            <h4 className="card-title">Existing Products</h4>
            <DataTable
              columns={columns}
              data={products}
              pagination
              highlightOnHover
              striped
              dense
            />
          </div>
        </div>
{showDetailsModal && selectedProduct && (
  <div
    className="modal fade show"
    style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
  >
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Product Details</h5>
          <button className="btn-close" onClick={() => setShowDetailsModal(false)}></button>
        </div>
        <div className="modal-body">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>ID</th>
                <td>{selectedProduct.Id}</td>
                <th>Name</th>
                <td>{selectedProduct.Name}</td>
              </tr>
              <tr>
                <th>Price</th>
                <td>{selectedProduct.Price}</td>
                <th>Quantity</th>
                <td>{selectedProduct.AvailableQuantity}</td>
              </tr>
              <tr>
                <th>In Stock</th>
                <td>{selectedProduct.InStock ? "Yes" : "No"}</td>
                <th>On Sale</th>
                <td>{selectedProduct.OnSale ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <th>Sale %</th>
                <td>{selectedProduct.SalePercentage ?? "-"}</td>
                <th>Shape</th>
                <td>{selectedProduct.Shape}</td>
              </tr>
              <tr>
                <th>Height</th>
                <td>{selectedProduct.Height}</td>
                <th>Width</th>
                <td>{selectedProduct.Width}</td>
              </tr>
            </tbody>
          </table>

          <h5 className="mt-4">Images</h5>
          <table className="table table-bordered text-center">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Is Primary</th>
              </tr>
            </thead>
            <tbody>
              {selectedProduct.Images?.length ? (
                selectedProduct.Images.map((img, idx) => (
                  <tr key={img.Id}>
                    <td>{idx + 1}</td>
                    <td>
                      <img
                        src={`http://localhost:5000/${img.ImageFile}`}
                        alt="product"
                        width="200"
                        height="200"
                        style={{ objectFit: "cover" }}
                      />
                    </td>
                    <td>{img.IsPrimary ? "✅" : "❌"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No images found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
)}
        {/* Image Management Modal */}
        {showImageModal && (
          <div
            className="modal show"
            style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5>Manage Images — {selectedProduct?.Name}</h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowImageModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleModalImageChange}
                      className="form-control"
                    />
                    <button
                      className="btn btn-gradient-primary mt-2"
                      onClick={handleUploadNewImages}
                    >
                      Upload
                    </button>
                  </div>

                  {modalPreviewImages.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {modalPreviewImages.map((img, index) => (
                        <div key={index} className="text-center">
                          <img
                            src={img.url}
                            alt={img.name}
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                              borderRadius: "6px",
                              border: "1px solid #ccc",
                            }}
                          />
                          <div style={{ fontSize: "12px" }}>{img.name}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Preview</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productImages.map((img, index) => (
                        <tr key={img.Id}>
                          <td>{index + 1}</td>
                          <td>
                            <img
                              src={`http://localhost:5000/${img.ImageFile}`}
                              alt="Product"
                              style={{
                                width: "70px",
                                height: "70px",
                                objectFit: "cover",
                              }}
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-gradient-danger me-2"
                              onClick={() => handleDeleteImage(img.Id)}
                            >
                              Delete
                            </button>
                            <button
                              className={`btn btn-sm ${
              img.IsPrimary
                ? "btn-gradient-success"
                : "btn-gradient-primary"
            }`}
                              onClick={() => handleSetPrimaryImage(img.Id)}
                             
                            >
                              {img.IsPrimary ? "Primary Img" : "Set Primary"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ManageProducts;
