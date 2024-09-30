import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  // Handler for Edit button
  const handleEdit = () => {
    navigate(`/product/update-product/${id}`);
  };

  // Handler for Delete button
  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (!confirmed) return; // Exit if the user cancels

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      navigate('/product/view-products'); // Redirect after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Handler for Toggle Active/Inactive
  const handleToggleActive = async () => {
    try {
      if (product.isActive) {
        await axios.put(`http://localhost:5000/api/products/deactivate/${id}`);
      } else {
        await axios.put(`http://localhost:5000/api/products/activate/${id}`);
      }
      setProduct(prevProduct => ({ ...prevProduct, isActive: !prevProduct.isActive }));
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1 className="text-center mb-4">Product Details</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ID</td>
            <td>{product.id}</td>
          </tr>
          <tr>
            <td>Name</td>
            <td>{product.name}</td>
          </tr>
          <tr>
            <td>Description</td>
            <td>{product.description}</td>
          </tr>
          <tr>
            <td>Price</td>
            <td>${product.price}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>{product.isActive ? 'Active' : 'Inactive'}</td>
          </tr>
        </tbody>
      </Table>
      
      <div className="d-flex justify-content-end mt-3">
        <Button 
          variant={product.isActive ? 'outline-warning' : 'outline-success'} 
          onClick={handleToggleActive}
          className="me-2"
        >
          {product.isActive ? 'Deactivate' : 'Activate'}
        </Button>
        <Button 
          variant="outline-primary" 
          onClick={handleEdit}
          className="me-2"
        >
          Edit
        </Button>
        <Button 
          variant="outline-danger" 
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>
    </>
  );
};

export default ProductDetails;
