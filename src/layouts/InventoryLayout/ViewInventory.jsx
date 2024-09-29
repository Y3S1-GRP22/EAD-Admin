import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ViewInventory = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCategoryStatus, setSelectedCategoryStatus] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [updateQuantity, setUpdateQuantity] = useState("");
  const [removeQuantity, setRemoveQuantity] = useState("");
  const [errors, setErrors] = useState({});
  const [role, setRole] = useState(""); // Store role
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/category");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchUserRole = () => {
      const token = localStorage.getItem("token"); // Get the token
      if (token) {
        const decodedToken = jwtDecode(token);
        setRole(decodedToken.role); // Set the role from decoded token
      }
    };

    fetchProducts();
    fetchCategories();
    fetchUserRole(); // Fetch user role
  }, []);

  const filteredProducts = products.filter((product) => {
    const isCategoryMatch =
      selectedCategory === "all" || product.categoryId === selectedCategory;
    const isCategoryStatusMatch =
      selectedCategoryStatus === "all" ||
      (selectedCategoryStatus === "active" && product.categoryStatus) ||
      (selectedCategoryStatus === "inactive" && !product.categoryStatus);
    const isStatusMatch =
      statusFilter === "all" ||
      (statusFilter === "inStock" && product.stock > 0) ||
      (statusFilter === "outOfStock" && product.stock <= 0) ||
      (statusFilter === "active" && product.isActive) ||
      (statusFilter === "inactive" && !product.isActive);

    return isCategoryMatch && isCategoryStatusMatch && isStatusMatch;
  });

  const validateUpdateQuantity = () => {
    const newErrors = {};
    if (updateQuantity <= 0) {
      newErrors.updateQuantity = "Quantity must be a positive number.";
    }
    return newErrors;
  };

  const validateRemoveQuantity = () => {
    const newErrors = {};
    if (removeQuantity <= 0) {
      newErrors.removeQuantity = "Quantity must be a positive number.";
    } else if (removeQuantity > currentProduct.stockQuantity) {
      newErrors.removeQuantity =
        "Quantity to remove cannot exceed available stock.";
    }
    return newErrors;
  };

  const handleUpdateStock = async () => {
    const validationErrors = validateUpdateQuantity();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (currentProduct) {
      try {
        await axios.put(
          `http://localhost:5153/api/inventory/update-stock/${currentProduct.id}`,
          { stock: parseInt(updateQuantity) }
        );
        alert("Stock updated successfully");
        setShowUpdateModal(false);
        setUpdateQuantity("");
        const response = await axios.get("http://localhost:5153/api/products");
        setProducts(response.data);
        setErrors({});
      } catch (error) {
        console.error("Error updating stock:", error);
      }
    }
  };

  const handleRemoveStock = async () => {
    const validationErrors = validateRemoveQuantity();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (currentProduct) {
      try {
        await axios.put(
          `http://localhost:5153/api/inventory/remove-stock/${currentProduct.id}`,
          { stock: parseInt(removeQuantity) }
        );
        alert("Stock removed successfully");
        setShowRemoveModal(false);
        setRemoveQuantity("");
        const response = await axios.get("http://localhost:5153/api/products");
        setProducts(response.data);
        setErrors({});
      } catch (error) {
        console.error("Error removing stock:", error);
      }
    }
  };

  const handleShowUpdateModal = (product) => {
    setCurrentProduct(product);
    setShowUpdateModal(true);
  };

  const handleShowRemoveModal = (product) => {
    setCurrentProduct(product);
    setShowRemoveModal(true);
  };

  return (
    <div className="container">
      <h1 className="text-center mb-4">Product Inventory Management</h1>

      {/* Add Product Button - only for vendor */}
      {role === "vendor" && (
        <div className="d-flex justify-content-end mb-3">
          <Button
            variant="outline-primary"
            onClick={() => navigate("/product/add-product")}
          >
            Add Product
          </Button>
        </div>
      )}

      {/* Product Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Category Status</th>
            <th>Status</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product, index) => {
            const category = categories.find(
              (cat) => cat.id === product.categoryId
            );
            return (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td style={{ width: "250px" }}>{product.description}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{category ? category.name : "Unknown"}</td>
                <td>
                  {category
                    ? category.isActive
                      ? "Active"
                      : "Inactive"
                    : "Unknown"}
                </td>
                <td>{product.isActive ? "Active" : "Inactive"}</td>
                <td>{product.stockQuantity}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    className="me-2"
                    onClick={() => handleShowUpdateModal(product)}
                  >
                    Add Stock
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="me-2"
                    onClick={() => handleShowRemoveModal(product)}
                  >
                    Remove Stock
                  </Button>

                  {/* Vendor-specific actions */}
                  {role === "vendor" && (
                    <>
                      <Button variant="outline-info" className="me-2">
                        Edit Category
                      </Button>
                      <Button variant="outline-warning" className="me-2">
                        Activate/Deactivate
                      </Button>
                      <Button variant="outline-danger">Delete Category</Button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Update Stock Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Stock for {currentProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateStock();
            }}
          >
            <Form.Group controlId="updateQuantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={updateQuantity}
                onChange={(e) => setUpdateQuantity(e.target.value)}
                isInvalid={!!errors.updateQuantity}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.updateQuantity}
              </Form.Control.Feedback>
            </Form.Group>
            <div className="mt-3 d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={() => setShowUpdateModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="ms-2"
                onClick={handleUpdateStock}
              >
                Update
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Remove Stock Modal */}
      <Modal show={showRemoveModal} onHide={() => setShowRemoveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Remove Stock for {currentProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleRemoveStock();
            }}
          >
            <Form.Group controlId="removeQuantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={removeQuantity}
                onChange={(e) => setRemoveQuantity(e.target.value)}
                isInvalid={!!errors.removeQuantity}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.removeQuantity}
              </Form.Control.Feedback>
            </Form.Group>
            <div className="mt-3 d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={() => setShowRemoveModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="ms-2"
                onClick={handleRemoveStock}
              >
                Remove
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ViewInventory;
