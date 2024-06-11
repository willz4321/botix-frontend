import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, FormControl, InputGroup } from 'react-bootstrap';
import { Telephone, Envelope, Chat, PencilSquare, Trash, PlusCircle } from 'react-bootstrap-icons';
import CreateUserModal from './createUserModal'; // Asegúrate de que la ruta sea correcta
import './UsersTable.css'; // Import the CSS file

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [conversationStats, setConversationStats] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [userData, setUserData] = useState({});
  const [profileFile, setProfileFile] = useState(null);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const companyId = localStorage.getItem('company_id');
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const usersResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/users?company_id=${companyId}`);
        setUsers(usersResponse.data);

        const rolesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/roles/${companyId}`);
        setRoles(rolesResponse.data);

        const departmentsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/departments/${companyId}`);
        setDepartments(departmentsResponse.data);

        const conversationStatsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/conversation-stats/${companyId}`);
        setConversationStats(conversationStatsResponse.data);

        const privilegesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/privileges/${userId}`);
        setPrivileges(privilegesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUsersData();
  }, [companyId, userId]);

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'N/A';
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find(d => d.id === departmentId);
    return department ? department.name : 'N/A';
  };

  const getConversationStats = (userId) => {
    const stats = conversationStats.find(stat => stat.id_usuario === userId);
    return stats ? stats : { total_conversations: 0, pending_conversations: 0, attended_conversations: 0 };
  };

  const hasPrivilege = (privilege) => {
    return privileges.includes(privilege);
  };

  const handleEditUserClick = (user) => {
    setUserData(user);
    setShowUserModal(true);
  };

  const handleDeleteUserClick = (id) => {
    setUserIdToDelete(id);
    setShowDeleteConfirmationModal(true);
  };

  const handleDeleteUserConfirm = () => {
    axios.delete(`${process.env.REACT_APP_API_URL}/api/users/${userIdToDelete}`)
      .then(() => {
        setUsers(users.filter(user => user.id_usuario !== userIdToDelete));
        setShowDeleteConfirmationModal(false);
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
  };

  const handleCreateUserClick = () => {
    setShowCreateUserModal(true);
  };

  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleProfileFileChange = (e) => {
    setProfileFile(e.target.files[0]);
  };

  const handleUserFormSubmit = async (e) => {
    e.preventDefault();

    const updateUser = { ...userData };

    if (profileFile) {
      const formData = new FormData();
      formData.append('profile', profileFile);

      try {
        const uploadResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/upload-profile`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        updateUser.link_foto = uploadResponse.data.profileUrl;
      } catch (error) {
        console.error('Error uploading profile image:', error);
        return;
      }
    }

    axios.put(`${process.env.REACT_APP_API_URL}/api/auth/users/${updateUser.id_usuario}`, updateUser)
      .then(response => {
        setUsers(users.map(user => user.id_usuario === updateUser.id_usuario ? response.data : user));
        setShowUserModal(false);
      })
      .catch(error => {
        console.error('Error updating user data:', error);
      });
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  const filteredUsers = users.filter(user => {
    const stats = getConversationStats(user.id_usuario);
    const searchTermLower = searchTerm.toLowerCase();

    return (
      (!selectedDepartment || user.department_id === parseInt(selectedDepartment)) &&
      (user.nombre.toLowerCase().includes(searchTermLower) ||
      user.apellido.toLowerCase().includes(searchTermLower) ||
      user.telefono.includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower) ||
      user.id_usuario.toString().includes(searchTermLower))
    );
  });

  const regularUsers = filteredUsers.filter(user => roles.find(r => r.id === user.rol && r.type === 'Humano'));

  return (
    <div className="users-container">
      <h3>Usuarios de la Empresa</h3>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div>
          {(hasPrivilege('Create users') || hasPrivilege('Admin')) && (
            <Button variant="primary" onClick={handleCreateUserClick}>
              <PlusCircle /> Crear Usuario
            </Button>
          )}
        </div>
        <div className="d-flex">
          <FormControl
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={handleSearchTermChange}
            className="mr-2"
          />
          <FormControl
            as="select"
            value={selectedDepartment}
            onChange={handleDepartmentChange}
          >
            <option value="">Todos los departamentos</option>
            {departments.map(department => (
              <option key={department.id} value={department.id}>{department.name}</option>
            ))}
          </FormControl>
        </div>
      </div>
      <div className="table-responsive">
        <Table className="custom-table" bordered hover>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Departamento</th>
              <th>Conversaciones Asignadas</th>
              <th>Conversaciones Pendientes</th>
              <th>Conversaciones Atendidas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {regularUsers.map(user => {
              const stats = getConversationStats(user.id_usuario);
              return (
                <tr key={user.id_usuario}>
                  <td>
                    <img 
                      src={`${process.env.REACT_APP_API_URL}${user.link_foto}`} 
                      alt="Profile" 
                      className="profile-user-img"
                    />
                  </td>
                  <td>{user.nombre}</td>
                  <td>{user.apellido}</td>
                  <td>
                    <a href={`tel:${user.telefono}`}>
                      <Telephone /> {user.telefono}
                    </a>
                  </td>
                  <td>
                    <a href={`mailto:${user.email}`}>
                      <Envelope /> {user.email}
                    </a>
                  </td>
                  <td>{getRoleName(user.rol)}</td>
                  <td>{getDepartmentName(user.department_id)}</td>
                  <td>{stats.total_conversations}</td>
                  <td>{stats.pending_conversations}</td>
                  <td>{stats.attended_conversations}</td>
                  <td>
                    <Button variant="link" size="sm" disabled={!hasPrivilege('Send message')}>
                      <Chat />
                    </Button>
                    <Button variant="link" size="sm" onClick={() => handleEditUserClick(user)} disabled={!hasPrivilege('Edit users')}>
                      <PencilSquare />
                    </Button>
                    {(hasPrivilege('Delete users') || hasPrivilege('Admin')) && (
                      <Button variant="link" size="sm" onClick={() => handleDeleteUserClick(user.id_usuario)}>
                        <Trash style={{ color: 'red' }} />
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      <Modal show={showUserModal} onHide={() => setShowUserModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUserFormSubmit}>
            <Form.Group controlId="formUserProfileImage">
              <Form.Label>Foto de Perfil</Form.Label>
              <Form.Control
                type="file"
                name="profile"
                onChange={handleProfileFileChange}
              />
            </Form.Group>
            <br />
            <Form.Group controlId="formUserId">
              <Form.Label>Número de Identificación</Form.Label>
              <Form.Control
                type="number"
                name="id_usuario"
                value={userData.id_usuario || ''}
                onChange={handleUserFormChange}
              />
            </Form.Group>
            <Form.Group controlId="formUserName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={userData.nombre || ''}
                onChange={handleUserFormChange}
              />
            </Form.Group>
            <Form.Group controlId="formUserSurname">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                value={userData.apellido || ''}
                onChange={handleUserFormChange}
              />
            </Form.Group>
            <Form.Group controlId="formUserPhone">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                value={userData.telefono || ''}
                onChange={handleUserFormChange}
              />
            </Form.Group>
            <Form.Group controlId="formUserEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={userData.email || ''}
                onChange={handleUserFormChange}
              />
            </Form.Group>
            <Form.Group controlId="formUserPassword">
              <Form.Label>Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="contraseña"
                onChange={handleUserFormChange}
              />
            </Form.Group>
            <Form.Group controlId="formUserRole">
              <Form.Label>Rol</Form.Label>
              <Form.Control
                as="select"
                name="rol"
                value={userData.rol || ''}
                onChange={handleUserFormChange}
              >
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <br />
            <Form.Group controlId="formUserDepartment">
              <Form.Label>Departamento</Form.Label>
              <Form.Control
                as="select"
                name="department_id"
                value={userData.department_id || ''}
                onChange={handleUserFormChange}
              >
                {departments.map(department => (
                  <option key={department.id} value={department.id}>{department.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <br />
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteConfirmationModal} onHide={() => setShowDeleteConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar este usuario?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirmationModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteUserConfirm}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      <CreateUserModal
        show={showCreateUserModal}
        onHide={() => setShowCreateUserModal(false)}
        companyId={companyId}
        roles={roles}
        departments={departments}
        onUserCreated={(newUser) => setUsers([...users, newUser])}
      />
    </div>
  );
};

export default UsersTable;

