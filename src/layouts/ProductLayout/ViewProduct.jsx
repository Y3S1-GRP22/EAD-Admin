import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
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

    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((product) => {
    const isCategoryMatch =
      selectedCategory === "all" || product.categoryId === selectedCategory;
    const isStatusMatch =
      statusFilter === "all" ||
      (statusFilter === "active" && product.isActive) ||
      (statusFilter === "inactive" && !product.isActive);
    return isCategoryMatch && isStatusMatch;
  });

  const handleEdit = (id) => {
    navigate(`/product/update-product/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5153/api/products/${id}`);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      if (isActive) {
        await axios.put(`http://localhost:5153/api/products/deactivate/${id}`);
      } else {
        await axios.put(`http://localhost:5153/api/products/activate/${id}`);
      }
      const updatedProducts = products.map((product) =>
        product.id === id ? { ...product, isActive: !isActive } : product
      );
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error toggling product status:", error);
    }
  };

  return (
    <>
      <h1 className="text-center">Products</h1>

      <div className="d-flex flex-column align-items-end mb-3">
        <Button
          variant="outline-primary"
          onClick={() => navigate("/product/add-product")}
        >
          Add Product
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <td colSpan="8" className="text-center">
              <div className="mt-6">
                <Button
                  variant={
                    statusFilter === "all" ? "outline-info" : "outline-primary"
                  }
                  onClick={() => setStatusFilter("all")}
                >
                  All Status
                </Button>
                <Button
                  variant={
                    statusFilter === "active"
                      ? "outline-info"
                      : "outline-primary"
                  }
                  className="ml-2"
                  onClick={() => setStatusFilter("active")}
                >
                  Active
                </Button>
                <Button
                  variant={
                    statusFilter === "inactive"
                      ? "outline-info"
                      : "outline-primary"
                  }
                  className="ml-2"
                  onClick={() => setStatusFilter("inactive")}
                >
                  Inactive
                </Button>

                <Form.Group className="mt-3">
                  <Form.Label>Filter by Category</Form.Label>
                  <Form.Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </td>
          </tr>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category Status</th>
            <th>Status</th>
            <th>Image</th> {/* New Column */}
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
                <td>{product.description}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  {category
                    ? category.isActive
                      ? "Active"
                      : "Inactive"
                    : "Unknown"}
                </td>
                <td>
                  {product.isActive ? "Active" : "Inactive"}
                  <Button
                    variant={
                      product.isActive ? "outline-warning" : "outline-success"
                    }
                    className="ml-2"
                    onClick={() =>
                      handleToggleActive(product.id, product.isActive)
                    }
                  >
                    {product.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </td>
                <td>
                  {product.imagePath ? (
                    <img
                      src={`http://localhost:5153${product.imagePath}`} // Adjust URL if necessary
                      alt={product.name}
                      style={{ width: "100px", height: "auto" }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    onClick={() => handleEdit(product.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="ml-2"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default ViewProducts;
