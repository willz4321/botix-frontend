import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import { Google, Facebook } from 'react-bootstrap-icons';
import "./Register.css";

const Register = () => {
  const [idUsuario, setIdUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [linkFoto, setLinkFoto] = useState("");
  const [rol, setRol] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [empresa, setEmpresa] = useState({
    name: "",
    document_type: "",
    document_number: "",
    address: "",
    city: "",
    country: "",
    postal_code: "",
    email: "",
    phone: "",
    logo: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmpresa({
      ...empresa,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!idUsuario || !nombre || !apellido || !email || !rol || !contraseña) {
      setError("Por favor, complete todos los campos requeridos.");
      return;
    }

    const payload = {
      id_usuario: idUsuario,
      nombre,
      apellido,
      telefono,
      email,
      link_de_la_foto: linkFoto,
      rol,
      contraseña,
      empresa
    };

    console.log(payload); // Agregado para depuración

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, payload);
      alert(`Usuario creado: ${response.data.nombre}`);
      navigate('/login'); // Redirige al usuario a la página de inicio de sesión
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
      } else {
        setError("Error de red o respuesta no recibida");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="left-side">
        <img src="/Portada.png" alt="CRM" className="crm-image" />
      </div>
      <div className="right-side">
        <img src="/icono WA.png" alt="Logo" className="logo" />
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="register-form">
          <label>
            ID de usuario:
            <input type="text" value={idUsuario} onChange={(e) => setIdUsuario(e.target.value)} />
          </label>
          <label>
            Nombre:
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </label>
          <label>
            Apellido:
            <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} />
          </label>
          <label>
            Teléfono:
            <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          </label>
          <label>
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Link de la foto:
            <input type="text" value={linkFoto} onChange={(e) => setLinkFoto(e.target.value)} />
          </label>
          <label>
            Rol:
            <input type="text" value={rol} onChange={(e) => setRol(e.target.value)} />
          </label>
          <label>
            Contraseña:
            <input type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} />
          </label>
          <h3>Datos de la Empresa</h3>
          <label>
            Nombre de la Empresa:
            <input type="text" name="name" value={empresa.name} onChange={handleInputChange} />
          </label>
          <label>
            Tipo de Documento:
            <input type="text" name="document_type" value={empresa.document_type} onChange={handleInputChange} />
          </label>
          <label>
            Número de Documento:
            <input type="text" name="document_number" value={empresa.document_number} onChange={handleInputChange} />
          </label>
          <label>
            Dirección:
            <input type="text" name="address" value={empresa.address} onChange={handleInputChange} />
          </label>
          <label>
            Ciudad:
            <input type="text" name="city" value={empresa.city} onChange={handleInputChange} />
          </label>
          <label>
            País:
            <input type="text" name="country" value={empresa.country} onChange={handleInputChange} />
          </label>
          <label>
            Código Postal:
            <input type="text" name="postal_code" value={empresa.postal_code} onChange={handleInputChange} />
          </label>
          <label>
            Email de la Empresa:
            <input type="email" name="company_email" value={empresa.email} onChange={handleInputChange} />
          </label>
          <label>
            Teléfono de la Empresa:
            <input type="text" name="phone" value={empresa.phone} onChange={handleInputChange} />
          </label>
          <label>
            Logo de la Empresa:
            <input type="text" name="logo" value={empresa.logo} onChange={handleInputChange} />
          </label>
          <input type="submit" value="Registrarse" className="btn btn-primary" />
          <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
        </form>
        <div className="social-login-container">
          <button onClick={() => window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`} className="social-login-button google-button">
            <Google className="social-icon" />
          </button>
          <button onClick={() => window.location.href = `${process.env.REACT_APP_API_URL}/auth/facebook`} className="social-login-button facebook-button">
            <Facebook className="social-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
