import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Category.css"; // Import custom CSS file if needed

const AddCategory = () => {
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Category Name Validation
    if (!name) {
      newErrors.name = "Category name is required.";
    } else if (name.length < 3) {
      newErrors.name = "Category name must be at least 3 characters long.";
    } else if (!/^[a-zA-Z0-9\s]+$/.test(name)) {
      newErrors.name =
        "Category name can only contain letters, numbers, and spaces.";
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
      await axios.post("http://localhost:5000/api/category", {
        name,
        isActive,
      });
      navigate("/category/view-category");
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="w-50">
        <h1 className="text-center mb-4">Add New Category</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formCategoryName">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors({ ...errors, name: "" });
              }}
              isInvalid={!!errors.name} // Display error styling if validation fails
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
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default AddCategory;
