import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import './Category.css'; // Custom CSS if needed

const UpdateCategory = () => {
  const { id } = useParams(); 
  const [name, setName] = useState(''); 
  const [isActive, setIsActive] = useState(true); 
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/category/${id}`);
        setName(response.data.name);
        setIsActive(response.data.isActive);
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    };

    fetchCategory();
  }, [id]);

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Validate category name
    if (!name) {
      newErrors.name = "Category name is required.";
    } else if (name.length < 3) {
      newErrors.name = "Category name must be at least 3 characters long.";
    } else if (!/^[a-zA-Z0-9\s]+$/.test(name)) {
      newErrors.name = "Category name can only contain letters, numbers, and spaces.";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/category/${id}`, { name, isActive });
      navigate('/category/view-category');
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="w-50">
        <h1 className="text-center mb-4">Update Category</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formCategoryName">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors({ ...errors, name: '' }); // Clear error on change
              }}
              isInvalid={!!errors.name} // Add invalid style if there's an error
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCategoryStatus">
            <Form.Check
              type="checkbox"
              label="Active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          </Form.Group>

          <Button variant="outline-primary" type="submit" className="w-100">
            Update
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default UpdateCategory;
