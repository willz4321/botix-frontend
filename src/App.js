import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import { Routes, Route, useNavigate } from 'react-router-dom';
import CollapsibleSidebar from './CollapsibleSidebar';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import CompanyInfo from './CompanyInfo';
import ContactsTable from './ContactsTable';
import UsersTable from './UsersTable';
import FunnelComponent from './Funnel';
import Campaigns from './Campaigns';
import CreateFlow from './CreateFlow';
import CreateTemplate from './CreateTemplete';
import CreateCampaign from './CreateCampaign';
import { ConversationsProvider } from './ConversationsContext';
import io from 'socket.io-client';
import './App.css';
import { PrivateRoute, PublicRoute } from './PrivateRoute';

function App() {
  const [socket, setSocket] = useState(null);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [selectedSection, setSelectedSection] = useState('chats');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const id_usuario = localStorage.getItem('user_id');

    console.log('Token and user ID from localStorage:', token, id_usuario);

    if (!token || !id_usuario) return;

    const socket = io(`${process.env.REACT_APP_API_URL}`, {
      query: {
        token,
        id_usuario
      },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setIsConnected(true);
      setSocket(socket);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.close();
    };
  }, []);

  useEffect(() => {
    const handleFirstUserInteraction = () => {
      setUserHasInteracted(true);
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('touchstart', handleFirstUserInteraction);
    };

    window.addEventListener('click', handleFirstUserInteraction);
    window.addEventListener('touchstart', handleFirstUserInteraction);

    return () => {
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('touchstart', handleFirstUserInteraction);
    };
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleSelectSection = (section) => {
    setSelectedSection(section);
    navigate(`/${section}`);
  };

  return (
    <ConversationsProvider socket={socket} isConnected={isConnected} userHasInteracted={userHasInteracted}>
      <Container fluid>
        <Row>
          <div className={`px-0 ${isSidebarCollapsed ? 'collapsed' : 'expanded'}`}>
            <CollapsibleSidebar 
              onSelect={handleSelectSection} 
              isCollapsed={isSidebarCollapsed} 
              onToggle={handleSidebarToggle} 
            />
          </div>
          <Col className={`px-0 ${isSidebarCollapsed ? 'content-collapsed' : 'content-expanded'}`}>
            <Row className="renderContent">
              <Routes>
                <Route path="/login" element={
                  <PublicRoute>
                    <div>Login Component</div> {/* Replace with your Login component */}
                  </PublicRoute>
                } />
                <Route path="/chats" element={
                  <PrivateRoute>
                    <>
                      <Col className="px-0 conversations_bar" style={{ flexBasis: '25%' }}>
                        <Sidebar />
                      </Col>
                      <Col className="px-0 wallpaper_messages" style={{ flexBasis: '75%' }}>
                        <ChatWindow socket={socket} />
                      </Col>
                    </>
                  </PrivateRoute>
                } />
                <Route path="/contacts" element={<PrivateRoute><ContactsTable /></PrivateRoute>} />
                <Route path="/users" element={<PrivateRoute><UsersTable /></PrivateRoute>} />
                <Route path="/funnel" element={<PrivateRoute><FunnelComponent /></PrivateRoute>} />
                <Route path="/statistics" element={<PrivateRoute><div>statistics</div></PrivateRoute>} />
                <Route path="/inspection" element={<PrivateRoute><div>Inspection</div></PrivateRoute>} />
                <Route path="/campaigns" element={<PrivateRoute><Campaigns /></PrivateRoute>} />
                <Route path="/consumption" element={<PrivateRoute><div>Consumption</div></PrivateRoute>} />
                <Route path="/settings" element={<PrivateRoute><div>Settings</div></PrivateRoute>} />
                <Route path="/company" element={<PrivateRoute><CompanyInfo /></PrivateRoute>} />
                <Route path="/create-template" element={<PrivateRoute><CreateTemplate /></PrivateRoute>} />
                <Route path="/create-campaign" element={<PrivateRoute><CreateCampaign /></PrivateRoute>} />
                <Route path="*" element={<PrivateRoute><CompanyInfo /></PrivateRoute>} />
              </Routes>
            </Row>
          </Col>
        </Row>
      </Container>
    </ConversationsProvider>
  );
}

export default App;
