import { useEffect, useState } from "react";
import { Button, Form, Container, Row, Col, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./CustomCss.css"; // Import the custom CSS file
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";

const UpdateCSR = () => {
  const [CSRData, setCSRData] = useState({
    username: "",
    email: "",
    newPassword: "", // Field for new password
    mobileNumber: "",
    address: "",
    role: "CSR",
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false); // State for Modal visibility
  const [modalMessage, setModalMessage] = useState(""); // State for Modal message

  const { id } = useParams(); // Get the CSR ID from the route parameters
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch CSR data when the component mounts
    const fetchCSRData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://192.168.109.81/iCorner/api/user/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach token if required
            },
          }
        );
        setCSRData(response.data);
      } catch (error) {
        console.error("Error fetching CSR data:", error);
      }
    };

    fetchCSRData();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    if (!CSRData.username) newErrors.username = "Username is required.";
    if (!CSRData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(CSRData.email)) {
      newErrors.email = "Email address is invalid.";
    }
    if (!CSRData.mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(CSRData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be 10 digits.";
    }
    if (!CSRData.address) newErrors.address = "Address is required.";
    if (CSRData.newPassword && CSRData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 ? true : newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCSRData({ ...CSRData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (validationErrors === true) {
      try {
        const token = localStorage.getItem("token");
        // Only send the password if it's provided (user wants to change it)
        const updateData = {
          ...CSRData,
          ...(CSRData.newPassword && { password: CSRData.newPassword }), // Only include password if set
        };
        console.log(updateData);
        await axios.put(
          `http://192.168.109.81/iCorner/api/user/update/${id}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach token if required
            },
          }
        );
        toast.success("CSR updated successfully!");
        navigate("/users/view-CSRs"); // Navigate back to CSRs list after successful update
      } catch (error) {
        alert("Error updating CSR:", error);
        console.error("Error updating CSR:", error);
      }
    } else {
      // If more than one field is missing, show "Please fill all fields."
      if (Object.keys(validationErrors).length > 1) {
        setModalMessage("Please fill all fields.");
      } else {
        // If only one field is missing, show the specific error message.
        const singleError = Object.values(validationErrors)[0];
        setModalMessage(singleError);
      }
      setShowModal(true); // Show the modal
    }
  };
  const handleBack = () => {
    navigate("/users/view-CSRs"); // Navigate back to view CSRs
  };

  return (
    <Container className="add-CSR-container mt-4">
      <div className="mb-4">
        <Button
          variant="link"
          className="p-0 text-decoration-none"
          onClick={handleBack}
        >
          <FaArrowLeft size={24} /> {/* Left arrow icon */}
        </Button>
      </div>
      <h2 className="text-center mb-4 main-heading">Update CSR</h2>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={CSRData.username}
                onChange={handleChange}
                isInvalid={!!errors.username}
                className="input-field"
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                readOnly
                value={CSRData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
                className="input-field"
              />
            </Form.Group>

            <Form.Group controlId="formNewPassword">
              <Form.Label>
                New Password (Leave blank to keep current)
              </Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={CSRData.newPassword}
                onChange={handleChange}
                isInvalid={!!errors.newPassword}
                className="input-field"
              />
              <Form.Control.Feedback type="invalid">
                {errors.newPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formMobileNumber">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="text"
                name="mobileNumber"
                value={CSRData.mobileNumber}
                onChange={handleChange}
                isInvalid={!!errors.mobileNumber}
                className="input-field"
              />
            </Form.Group>

            <Form.Group controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={CSRData.address}
                onChange={handleChange}
                isInvalid={!!errors.address}
                className="input-field"
              />
            </Form.Group>

            <div className="text-center">
              <Button className="submit-btn" type="submit">
                Update CSR
              </Button>
            </div>
          </Form>
        </Col>
      </Row>

      {/* Modal for Errors */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Form Validation</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UpdateCSR;
