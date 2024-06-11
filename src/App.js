import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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

function App() {
  const [socket, setSocket] = useState(null);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [selectedSection, setSelectedSection] = useState('chats');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const id_usuario = localStorage.getItem('user_id');

    if (!token || !id_usuario) {
      navigate('/login');
      return;
    }

    const socket = io(`${process.env.REACT_APP_API_URL}`, {
      query: {
        token,
        id_usuario
      },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      setIsConnected(true);
      setSocket(socket);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.close();
    };
  }, [navigate]);

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

  useEffect(() => {
    if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/') {
      return;
    }
    navigate('/chats');
  }, [location.pathname, navigate]);

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
                <Route path="/chats" element={
                  <>
                    <Col className="px-0 conversations_bar" style={{ flexBasis: '25%' }}>
                      <Sidebar />
                    </Col>
                    <Col className="px-0 wallpaper_messages" style={{ flexBasis: '75%' }}>
                      <ChatWindow socket={socket} />
                    </Col>
                  </>
                } />
                <Route path="/contacts" element={<ContactsTable />} />
                <Route path="/users" element={<UsersTable />} />
                <Route path="/funnel" element={<FunnelComponent />} />
                <Route path="/statistics" element={<div>statistics</div>} />
                <Route path="/inspection" element={<div>Inspection</div>} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/consumption" element={<div>Consumption</div>} />
                <Route path="/settings" element={<div>Settings</div>} />
                <Route path="/company" element={<CompanyInfo />} />
                <Route path="/create-template" element={<CreateTemplate />} />
                <Route path="/create-campaign" element={<CreateCampaign />} />
                <Route path="*" element={<CompanyInfo />} />
              </Routes>
            </Row>
          </Col>
        </Row>
      </Container>
    </ConversationsProvider>
  );
}

export default App;
