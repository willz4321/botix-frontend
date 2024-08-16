import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const CreateRoleModal = ({ show, onHide, companyId, onRoleCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    privileges: []
  });

  const privilegesOptions = [
    { value: 'Admin', label: 'Acceso administrativo' },
    { value: 'Create Users', label: 'Crear usuarios' },
    { value: 'Delete Users', label: 'Eliminar usuarios' },
    { value: 'Edit Users', label: 'Editar usuarios' },
    { value: 'Download Users', label: 'Descargar usuarios' },
    { value: 'Create Contacts', label: 'Crear contactos' },
    { value: 'Edit Contacts', label: 'Editar contactos' },
    { value: 'Delete Contacts', label: 'Eliminar contactos' },
    { value: 'Download Contacts', label: 'Descargar contactos' },
    { value: 'View Users/Contacts', label: 'Ver usuarios/contactos' },
    { value: 'Manage Roles', label: 'Gestionar roles' },
    { value: 'Access Reports', label: 'Acceder a informes' },
    { value: 'Manage Settings', label: 'Gestionar configuraciones' },
    { value: 'Bulk Operations', label: 'Operaciones masivas' },
    { value: 'Audit Log Access', label: 'Acceder a registro de auditoría' },
    { value: 'Access Communication Tools', label: 'Usar herramientas de comunicación' },
    { value: 'Restore Data', label: 'Restaurar datos' },
    { value: 'API Access', label: 'Acceso a API' },
    { value: 'Manage Projects/Tasks', label: 'Gestionar proyectos/tareas' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prevState => ({
        ...prevState,
        privileges: checked
          ? [...prevState.privileges, value]
          : prevState.privileges.filter(privilege => privilege !== value)
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.privileges.length === 0) {
      alert('Debe seleccionar al menos un privilegio.');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/roles`, {
        ...formData,
        company_id: companyId
      });
      onRoleCreated(response.data);
      onHide();
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Crear Rol</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formRoleName">
            <Form.Label>Nombre del Rol</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formRoleType">
            <Form.Label>Tipo</Form.Label>
            <Form.Control
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formRolePrivileges">
            <Form.Label>Privilegios</Form.Label>
            {privilegesOptions.map((privilege, index) => (
              <Form.Check
                key={index}
                type="checkbox"
                label={privilege.label}
                value={privilege.value}
                onChange={handleChange}
              />
            ))}
          </Form.Group>
          <Button variant="primary" type="submit">
            Crear
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateRoleModal;
