import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { Whatsapp, Instagram, Facebook, Globe, Telegram } from 'react-bootstrap-icons';

const CreateIntegrationModal = ({ show, onHide, licenseId, onIntegrationCreated }) => {
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    WHATSAPP_API_TOKEN: '',
    WHATSAPP_PHONE_NUMBER_ID: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/integrations`, {
        ...formData,
        license_id: licenseId
      });
      onIntegrationCreated(response.data);
      onHide();
    } catch (error) {
      console.error('Error creating integration:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Crear Integración</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formIntegrationType">
            <Form.Label>Tipo</Form.Label>
            <Form.Control
              as="select"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar tipo</option>
              <option value="whatsapp"><Whatsapp /> WhatsApp</option>
              <option value="instagram"><Instagram /> Instagram</option>
              <option value="facebook"><Facebook /> Facebook</option>
              <option value="web"><Globe /> Web</option>
              <option value="telegram"><Telegram /> Telegram</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formIntegrationName">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          {formData.type === 'whatsapp' && (
            <>
              <Form.Group controlId="formWhatsappApiToken">
                <Form.Label>WhatsApp API Token</Form.Label>
                <Form.Control
                  type="text"
                  name="WHATSAPP_API_TOKEN"
                  value={formData.WHATSAPP_API_TOKEN}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formWhatsappPhoneNumberId">
                <Form.Label>WhatsApp Phone Number ID</Form.Label>
                <Form.Control
                  type="text"
                  name="WHATSAPP_PHONE_NUMBER_ID"
                  value={formData.WHATSAPP_PHONE_NUMBER_ID}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </>
          )}
          <Button variant="primary" type="submit">
            Crear
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateIntegrationModal;
