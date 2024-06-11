import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const CreateContactModal = ({ show, onHide, companyId, onContactCreated }) => {
  const [newContactData, setNewContactData] = useState({
    phone_number: '',
    first_name: '',
    last_name: '',
    organization: '',
    label: '',
    email: '',
    edad_approx: '',
    genero: '',
    orientacion_sexual: '',
    fecha_nacimiento: '',
    direccion_completa: '',
    ciudad_residencia: '',
    nacionalidad: '',
    preferencias_contacto: '',
    pagina_web: '',
    link_instagram: '',
    link_facebook: '',
    link_linkedin: '',
    link_twitter: '',
    link_tiktok: '',
    link_youtube: '',
    nivel_ingresos: '',
    ocupacion: '',
    nivel_educativo: '',
    estado_civil: '',
    cantidad_hijos: '',
    estilo_de_vida: '',
    personalidad: '',
    cultura: '',
    historial_compras: '',
    historial_interacciones: '',
    observaciones_agente: ''
  });

  const [profileFile, setProfileFile] = useState(null);

  const handleNewContactFormChange = (e) => {
    const { name, value } = e.target;
    setNewContactData({
      ...newContactData,
      [name]: value
    });
  };

  const handleProfileFileChange = (e) => {
    setProfileFile(e.target.files[0]);
  };

  const handleNewContactFormSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    Object.keys(newContactData).forEach(key => {
      const value = newContactData[key];
      if (value === '' || value === null) {
        // No enviar estos valores al backend
      } else {
        // Agregar al formData solo si no es vacío
        formData.append(key, value);
      }
    });
  
    if (profileFile) {
      formData.append('profile', profileFile);
    }
  
    formData.append('company_id', companyId);
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/create-contact`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      onContactCreated(response.data);
      onHide();
    } catch (error) {
      console.error('Error creating new contact:', error);
    }
  };
  

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Crear Contacto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleNewContactFormSubmit}>
          <Form.Group controlId="formProfileImage">
            <Form.Label>Foto de Perfil</Form.Label>
            <Form.Control type="file" onChange={handleProfileFileChange} accept="image/*" />
          </Form.Group>
          <Form.Group controlId="formContactFirstName">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="first_name"
              value={newContactData.first_name}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactLastName">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="last_name"
              value={newContactData.last_name}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactOrganization">
            <Form.Label>Organización</Form.Label>
            <Form.Control
              type="text"
              name="organization"
              value={newContactData.organization}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactLabel">
            <Form.Label>Etiqueta</Form.Label>
            <Form.Control
              type="text"
              name="label"
              value={newContactData.label}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactPhoneNumber">
            <Form.Label>Número de Teléfono</Form.Label>
            <Form.Control
              type="tel"
              name="phone_number"
              value={newContactData.phone_number}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={newContactData.email}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactEdadApprox">
            <Form.Label>Edad</Form.Label>
            <Form.Control
              type="number"
              name="edad_approx"
              value={newContactData.edad_approx}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactGenero">
            <Form.Label>Género</Form.Label>
            <Form.Control
              as="select"
              name="genero"
              value={newContactData.genero}
              onChange={handleNewContactFormChange}
            >
              <option value="">Género</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="no_binario">No binario</option>
              <option value="otro">Otro</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formContactOrientacionSexual">
            <Form.Label>Orientación Sexual</Form.Label>
            <Form.Control
              as="select"
              name="orientacion_sexual"
              value={newContactData.orientacion_sexual}
              onChange={handleNewContactFormChange}
            >
              <option value="">Orientación Sexual</option>
              <option value="heterosexual">Heterosexual</option>
              <option value="gay">Gay</option>
              <option value="lesbiana">Lesbiana</option>
              <option value="bisexual">Bisexual</option>
              <option value="asexual">Asexual</option>
              <option value="otro">Otro</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formContactFechaNacimiento">
            <Form.Label>Fecha de Nacimiento</Form.Label>
            <Form.Control
              type="date"
              name="fecha_nacimiento"
              value={newContactData.fecha_nacimiento}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactDireccionCompleta">
            <Form.Label>Dirección Completa</Form.Label>
            <Form.Control
              type="text"
              name="direccion_completa"
              value={newContactData.direccion_completa}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactCiudadResidencia">
            <Form.Label>Ciudad de Residencia</Form.Label>
            <Form.Control
              type="text"
              name="ciudad_residencia"
              value={newContactData.ciudad_residencia}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactNacionalidad">
            <Form.Label>País de Residencia</Form.Label>
            <Form.Control
              type="text"
              name="nacionalidad"
              value={newContactData.nacionalidad}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactPreferenciasContacto">
            <Form.Label>Preferencias de Contacto</Form.Label>
            <Form.Control
              type="text"
              name="preferencias_contacto"
              value={newContactData.preferencias_contacto}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactPaginaWeb">
            <Form.Label>Página Web</Form.Label>
            <Form.Control
              type="url"
              name="pagina_web"
              value={newContactData.pagina_web}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactLinkInstagram">
            <Form.Label>Instagram</Form.Label>
            <Form.Control
              type="url"
              name="link_instagram"
              value={newContactData.link_instagram}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactLinkFacebook">
            <Form.Label>Facebook</Form.Label>
            <Form.Control
              type="url"
              name="link_facebook"
              value={newContactData.link_facebook}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactLinkLinkedin">
            <Form.Label>LinkedIn</Form.Label>
            <Form.Control
              type="url"
              name="link_linkedin"
              value={newContactData.link_linkedin}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactLinkTwitter">
            <Form.Label>Twitter</Form.Label>
            <Form.Control
              type="url"
              name="link_twitter"
              value={newContactData.link_twitter}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactLinkTiktok">
            <Form.Label>TikTok</Form.Label>
            <Form.Control
              type="url"
              name="link_tiktok"
              value={newContactData.link_tiktok}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactLinkYoutube">
            <Form.Label>YouTube</Form.Label>
            <Form.Control
              type="url"
              name="link_youtube"
              value={newContactData.link_youtube}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactNivelIngresos">
            <Form.Label>Nivel de Ingresos</Form.Label>
            <Form.Control
              as="select"
              name="nivel_ingresos"
              value={newContactData.nivel_ingresos}
              onChange={handleNewContactFormChange}
            >
              <option value="">Seleccionar nivel de ingresos</option>
              <option value="Bajos">Bajos</option>
              <option value="Medios">Medios</option>
              <option value="Altos">Altos</option>
              <option value="Muy altos">Muy altos</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formContactOcupacion">
            <Form.Label>Ocupación</Form.Label>
            <Form.Control
              type="text"
              name="ocupacion"
              value={newContactData.ocupacion}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactNivelEducativo">
            <Form.Label>Nivel Educativo</Form.Label>
            <Form.Control
              type="text"
              name="nivel_educativo"
              value={newContactData.nivel_educativo}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactEstadoCivil">
            <Form.Label>Estado Civil</Form.Label>
            <Form.Control
              type="text"
              name="estado_civil"
              value={newContactData.estado_civil}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactCantidadHijos">
            <Form.Label>Cantidad de Hijos</Form.Label>
            <Form.Control
              type="number"
              name="cantidad_hijos"
              value={newContactData.cantidad_hijos}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactEstiloDeVida">
            <Form.Label>Estilo de Vida</Form.Label>
            <Form.Control
              type="text"
              name="estilo_de_vida"
              value={newContactData.estilo_de_vida}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactPersonalidad">
            <Form.Label>Personalidad</Form.Label>
            <Form.Control
              type="text"
              name="personalidad"
              value={newContactData.personalidad}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactCultura">
            <Form.Label>Cultura</Form.Label>
            <Form.Control
              type="text"
              name="cultura"
              value={newContactData.cultura}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactHistorialCompras">
            <Form.Label>Historial de Compras</Form.Label>
            <Form.Control
              type="text"
              name="historial_compras"
              value={newContactData.historial_compras}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactHistorialInteracciones">
            <Form.Label>Historial de Interacciones</Form.Label>
            <Form.Control
              type="text"
              name="historial_interacciones"
              value={newContactData.historial_interacciones}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formContactObservacionesAgente">
            <Form.Label>Observaciones del Agente</Form.Label>
            <Form.Control
              type="text"
              name="observaciones_agente"
              value={newContactData.observaciones_agente}
              onChange={handleNewContactFormChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Crear
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateContactModal;
