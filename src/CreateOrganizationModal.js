import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const CreateOrganizationModal = ({ show, onHide, companyId, onOrganizationCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    document_type: '',
    document_number: '',
    address: '',
    city: '',
    country: '',
    postal_code: '',
    email: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/organizations`, {
        ...formData,
        company_id: companyId,
      });
      onOrganizationCreated(response.data);
      onHide();
    } catch (error) {
      console.error('Error creating organization:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Create Organization</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formOrganizationName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formOrganizationDocumentType">
            <Form.Label>Document Type</Form.Label>
            <Form.Control
              type="text"
              name="document_type"
              value={formData.document_type}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formOrganizationDocumentNumber">
            <Form.Label>Document Number</Form.Label>
            <Form.Control
              type="text"
              name="document_number"
              value={formData.document_number}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formOrganizationAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formOrganizationCity">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formOrganizationCountry">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formOrganizationPostalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formOrganizationEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formOrganizationPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateOrganizationModal;
