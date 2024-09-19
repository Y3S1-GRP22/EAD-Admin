import React, { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ViewInventory = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCategoryStatus, setSelectedCategoryStatus] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [updateQuantity, setUpdateQuantity] = useState('');
  const [removeQuantity, setRemoveQuantity] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5153/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5153/api/category');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = products.filter(product => {
    const isCategoryMatch = selectedCategory === 'all' || product.categoryId === selectedCategory;
    const isCategoryStatusMatch = selectedCategoryStatus === 'all' || 
      (selectedCategoryStatus === 'active' && product.categoryStatus) || 
      (selectedCategoryStatus === 'inactive' && !product.categoryStatus);
    const isStatusMatch = statusFilter === 'all' || 
      (statusFilter === 'inStock' && product.stock > 0) || 
      (statusFilter === 'outOfStock' && product.stock <= 0) || 
      (statusFilter === 'active' && product.isActive) || 
      (statusFilter === 'inactive' && !product.isActive);

    return isCategoryMatch && isCategoryStatusMatch && isStatusMatch;
  });

  // Validation for stock update and removal
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
      newErrors.removeQuantity = "Quantity to remove cannot exceed available stock.";
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
        await axios.put(`http://localhost:5153/api/inventory/update-stock/${currentProduct.id}`, { stock: parseInt(updateQuantity) });
        alert('Stock updated successfully');
        setShowUpdateModal(false);
        setUpdateQuantity('');
        const response = await axios.get('http://localhost:5153/api/products');
        setProducts(response.data);
        setErrors({});
      } catch (error) {
        console.error('Error updating stock:', error);
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
        await axios.put(`http://localhost:5153/api/inventory/remove-stock/${currentProduct.id}`, { stock: parseInt(removeQuantity) });
        alert('Stock removed successfully');
        setShowRemoveModal(false);
        setRemoveQuantity('');
        const response = await axios.get('http://localhost:5153/api/products');
        setProducts(response.data);
        setErrors({});
      } catch (error) {
        console.error('Error removing stock:', error);
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

      {/* <div className="d-flex justify-content-end mb-3">
        <Button
          variant="outline-primary"
          onClick={() => navigate('/product/add-product')}
        >
          Add Product
        </Button>
      </div> */}

       {/*<div className="row mb-4">
        <div className="col-md-4">
          <Button
            variant={statusFilter === 'all' ? 'outline-info' : 'outline-primary'}
            onClick={() => setStatusFilter('all')}
            className="me-2"
          >
            All Products
          </Button>
          <Button
            variant={statusFilter === 'inStock' ? 'outline-info' : 'outline-primary'}
            onClick={() => setStatusFilter('inStock')}
            className="me-2"
          >
            In Stock
          </Button>
          <Button
            variant={statusFilter === 'outOfStock' ? 'outline-info' : 'outline-primary'}
            onClick={() => setStatusFilter('outOfStock')}
          >
            Out of Stock
          </Button>
          <Button
            variant={statusFilter === 'active' ? 'outline-info' : 'outline-primary'}
            onClick={() => setStatusFilter('active')}
            className="me-2"
          >
            Active
          </Button>
          <Button
            variant={statusFilter === 'inactive' ? 'outline-info' : 'outline-primary'}
            onClick={() => setStatusFilter('inactive')}
          >
            Inactive
          </Button>
        </div>

        <div className="col-md-4">
          <Form.Group>
            <Form.Label>Filter by Category</Form.Label>
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>

        <div className="col-md-4">
          <Form.Group>
            <Form.Label>Filter by Category Status</Form.Label>
            <Form.Select
              value={selectedCategoryStatus}
              onChange={(e) => setSelectedCategoryStatus(e.target.value)}
            >
              <option value="all">All Category Statuses</option>
              <option value="active">Active Categories</option>
              <option value="inactive">Inactive Categories</option>
            </Form.Select>
          </Form.Group>
        </div>
      </div> */}

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
            const category = categories.find(cat => cat.id === product.categoryId);
            return (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{category ? category.name : 'Unknown'}</td>
                <td>{category ? (category.isActive ? 'Active' : 'Inactive') : 'Unknown'}</td>
                <td>{product.isActive ? 'Active' : 'Inactive'}</td>
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
          <Form onSubmit={(e) => { e.preventDefault(); handleUpdateStock(); }}>
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
            <Button variant="outline-primary" type="submit" className="mt-2">
              Update Stock
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Remove Stock Modal */}
      <Modal show={showRemoveModal} onHide={() => setShowRemoveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Remove Stock from {currentProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => { e.preventDefault(); handleRemoveStock(); }}>
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
            <Button variant="outline-danger" type="submit" className="mt-2">
              Remove Stock
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ViewInventory;
