// CustomModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './CustomModal.css'; // Estilos personalizados para el modal

const CustomModal = ({ show, handleClose, userName }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body className='text-center'>
        <img src="/FaviconAR.png" alt="Icon" style={{ width: '150px', marginRight: '50px', marginLeft: '50px', marginTop: '50px', marginButton: '20px' }} />
        <h2>¡Hola {userName}!</h2>
        <br></br>
        <p>Bienvenido a Botix 360º</p>
        <br></br>
      </Modal.Body>
    </Modal>
  );
};

export default CustomModal;
