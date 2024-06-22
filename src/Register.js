import { Link, useNavigate } from "react-router-dom";
import React, { useState, useRef } from "react";
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
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState("");
  const navigate = useNavigate();
  const formRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmpresa({
      ...empresa,
      [name]: value
    });
    setError(""); // Elimina el mensaje de error cuando el usuario comienza a llenar los campos
  };

  const handleNextStep = () => {
    if (formRef.current.checkValidity()) {
      setError("");
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      setError("Por favor, complete todos los campos requeridos correctamente.");
      formRef.current.reportValidity();
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!idUsuario || !nombre || !apellido || !email || !rol || !contraseña || !plan) {
      setError("Por favor, complete todos los campos requeridos.");
      return;
    }

    // Definir las características de cada plan
    const plans = {
      basic: {
        type: "Basic",
        users: 3,
        contacts: 1500,
        integrations: 1,
        automations: 1,
        ai_messages: 0,
        ai_analysis: 0,
        bot_messages: 0,
      },
      standard: {
        type: "Standard",
        users: 5,
        contacts: 5000,
        integrations: 3,
        automations: 3,
        ai_messages: 0,
        ai_analysis: 0,
        bot_messages: 0,
      },
      pro: {
        type: "Pro",
        users: 8,
        contacts: 10000,
        integrations: 6,
        automations: 6,
        ai_messages: 0,
        ai_analysis: 0,
        bot_messages: 0,
      }
    };

    const selectedPlan = plans[plan.toLowerCase()];

    const payload = {
      id_usuario: idUsuario,
      nombre,
      apellido,
      telefono,
      email,
      link_de_la_foto: linkFoto,
      rol,
      contraseña,
      empresa,
      plan: selectedPlan
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
        <form ref={formRef} onSubmit={handleSubmit} className="register-form">
          {step === 1 && (
            <>
              <h3>Datos de la Empresa</h3>
              <label>
                Nombre de la Empresa: <span className="required">*</span>
                <input type="text" name="name" value={empresa.name} onChange={handleInputChange} required />
              </label>
              <label>
                Tipo de Documento: <span className="required">*</span>
                <input type="text" name="document_type" value={empresa.document_type} onChange={handleInputChange} required />
              </label>
              <label>
                Número de Documento: <span className="required">*</span>
                <input type="text" name="document_number" value={empresa.document_number} onChange={handleInputChange} required />
              </label>
              <label>
                Dirección: <span className="required">*</span>
                <input type="text" name="address" value={empresa.address} onChange={handleInputChange} required />
              </label>
              <label>
                Ciudad: <span className="required">*</span>
                <input type="text" name="city" value={empresa.city} onChange={handleInputChange} required />
              </label>
              <label>
                País: <span className="required">*</span>
                <input type="text" name="country" value={empresa.country} onChange={handleInputChange} required />
              </label>
              <label>
                Código Postal: <span className="required">*</span>
                <input type="text" name="postal_code" value={empresa.postal_code} onChange={handleInputChange} required />
              </label>
              <label>
                Email de la Empresa: <span className="required">*</span>
                <input type="email" name="email" value={empresa.email} onChange={handleInputChange} required />
              </label>
              <label>
                Teléfono de la Empresa: <span className="required">*</span>
                <input type="text" name="phone" value={empresa.phone} onChange={handleInputChange} required />
              </label>
              <label>
                Logo de la Empresa:
                <input type="text" name="logo" value={empresa.logo} onChange={handleInputChange} />
              </label>
              <button type="button" onClick={handleNextStep} className="btn btn-secondary">Siguiente</button>
            </>
          )}

          {step === 2 && (
            <>
              <label>
                ID de usuario: <span className="required">*</span>
                <input type="text" value={idUsuario} onChange={(e) => {setIdUsuario(e.target.value); setError("");}} required />
              </label>
              <label>
                Nombre: <span className="required">*</span>
                <input type="text" value={nombre} onChange={(e) => {setNombre(e.target.value); setError("");}} required />
              </label>
              <label>
                Apellido: <span className="required">*</span>
                <input type="text" value={apellido} onChange={(e) => {setApellido(e.target.value); setError("");}} required />
              </label>
              <label>
                Teléfono: <span className="required">*</span>
                <input type="text" value={telefono} onChange={(e) => {setTelefono(e.target.value); setError("");}} required />
              </label>
              <label>
                Email: <span className="required">*</span>
                <input type="email" value={email} onChange={(e) => {setEmail(e.target.value); setError("");}} required />
              </label>
              <label>
                Link de la foto:
                <input type="text" value={linkFoto} onChange={(e) => setLinkFoto(e.target.value)} />
              </label>
              <label>
                Rol: <span className="required">*</span>
                <input type="text" value={rol} onChange={(e) => {setRol(e.target.value); setError("");}} required />
              </label>
              <label>
                Contraseña: <span className="required">*</span>
                <input type="password" value={contraseña} onChange={(e) => {setContraseña(e.target.value); setError("");}} required />
              </label>
              <button type="button" onClick={handlePreviousStep} className="btn btn-secondary">Atrás</button>
              <button type="button" onClick={handleNextStep} className="btn btn-secondary">Siguiente</button>
            </>
          )}

          {step === 3 && (
            <>
              <h3>Selecciona tu Plan</h3>
              <label>
                <input type="radio" name="plan" value="basic" checked={plan === "basic"} onChange={(e) => setPlan(e.target.value)} required /> Básico
              </label>
              <label>
                <input type="radio" name="plan" value="standard" checked={plan === "standard"} onChange={(e) => setPlan(e.target.value)} required /> Estándar
              </label>
              <label>
                <input type="radio" name="plan" value="pro" checked={plan === "pro"} onChange={(e) => setPlan(e.target.value)} required /> Pro
              </label>
              <button type="button" onClick={handlePreviousStep} className="btn btn-secondary">Atrás</button>
              <button type="submit" className="btn btn-primary">Registrarse</button>
            </>
          )}
        </form>
        <Link to="/login" className="register-link">¿Ya tienes cuenta? Inicia sesión</Link>
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
