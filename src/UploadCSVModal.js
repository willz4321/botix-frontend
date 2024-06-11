import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const UploadCSVModal = ({ show, onHide, companyId, onCSVUploaded }) => {
  const [csvFile, setCsvFile] = useState(null);

  const handleCSVFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleCSVUpload = async (e) => {
    e.preventDefault();

    if (csvFile) {
      const formData = new FormData();
      formData.append('csv', csvFile);
      formData.append('company_id', companyId);

      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/contacts/upload-csv`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        onCSVUploaded();
        onHide();
      } catch (error) {
        console.error('Error uploading CSV:', error);
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Cargar CSV de Contactos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleCSVUpload}>
          <Form.Group controlId="formCSVFile">
            <Form.Label>Archivo CSV</Form.Label>
            <Form.Control
              type="file"
              name="csv"
              accept=".csv"
              onChange={handleCSVFileChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Cargar CSV
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UploadCSVModal;
