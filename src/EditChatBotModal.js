import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Table, Form, InputGroup, FormControl, Row, Col, Nav, Spinner } from 'react-bootstrap';
import axios from 'axios';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  addEdge,
  Handle,
  useNodesState,
  useEdgesState,
  updateEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './BotDiagram.css';

const baseHeader = `(async function(
  sendTextMessage, 
  sendImageMessage, 
  sendVideoMessage, 
  sendDocumentMessage, 
  sendAudioMessage, 
  sendTemplateMessage, 
  sendTemplateToSingleContact, 
  sendLocationMessage,
  io, 
  senderId, 
  messageData, 
  conversationId, 
  pool,
  axios,
  getContactInfo,
  updateContactName,
  createContact,
  updateContactCompany,
  updateConversationState,
  assignResponsibleUser,
  processMessage,
  getReverseGeocoding,
  getGeocoding,
  integrationDetails,
  externalData,
  clientTimezone,
  moment
) {`;

const baseFooter = `})(sendTextMessage, sendImageMessage, sendVideoMessage, sendDocumentMessage, sendAudioMessage, sendTemplateMessage, sendTemplateToSingleContact, sendLocationMessage, io, senderId, messageData, conversationId, pool, axios, getContactInfo, updateContactName, createContact, updateContactCompany, updateConversationState, assignResponsibleUser, processMessage, getReverseGeocoding, getGeocoding, integrationDetails, externalData, clientTimezone, moment);`;

const nodeTypes = {
  custom: ({ data }) => (
    <div style={{ backgroundColor: '#FF5733', color: '#fff', padding: '10px', borderRadius: '5px' }}>
      <Handle type="target" position="top" />
      <div>{data.label}</div>
      <Handle type="source" position="bottom" />
    </div>
  ),
  conditional: ({ data }) => (
    <div style={{ backgroundColor: '#3498DB', color: '#fff', padding: '10px', borderRadius: '5px' }}>
      <Handle type="target" position="top" />
      <div>{data.label}</div>
      <Handle type="source" position="bottom" id="a" style={{ left: '25%' }} />
      <Handle type="source" position="bottom" id="b" style={{ left: '75%' }} />
    </div>
  ),
  switch: ({ data }) => (
    <div style={{ backgroundColor: '#8E44AD', color: '#fff', padding: '10px', borderRadius: '5px' }}>
      <Handle type="target" position="top" />
      <div>{data.label}</div>
      <Handle type="source" position="bottom" id="default" style={{ left: '50%' }} />
    </div>
  ),
  caseNode: ({ data }) => (
    <div style={{ backgroundColor: '#E67E22', color: '#fff', padding: '10px', borderRadius: '5px' }}>
      <Handle type="target" position="top" />
      <div>{data.label}</div>
      <Handle type="source" position="bottom" />
    </div>
  ),
  groupNode: ({ data }) => (
    <div className="node group" style={{ backgroundColor: '#2ECC71', color: '#fff', border: '2px solid #007bff', padding: '10px', borderRadius: '5px', position: 'relative' }}>
      <Handle type="target" position="top" />
      <div>{data.label}</div>
      <Handle type="source" position="bottom" />
    </div>
  ),
};


const EditChatBotModal = ({ show, handleClose, bot }) => {
  const [selectedTab, setSelectedTab] = useState('Código');
  const [code, setCode] = useState('');
  const [nodes, setNodes, onNodesChangeState] = useNodesState([]);
  const [edges, setEdges, onEdgesChangeState] = useEdgesState([]);
  const [variables, setVariables] = useState([{ name: 'Seleccione variable', displayName: 'Seleccione variable' }]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('==');
  const [comparisonValue, setComparisonValue] = useState('');
  const [currentParentId, setCurrentParentId] = useState(null);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [currentSwitchNode, setCurrentSwitchNode] = useState(null);
  const [conditions, setConditions] = useState([{ variable: '', operator: '==', value: '', logicalOperator: '' }]);
  const [showResponseTextModal, setShowResponseTextModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [responseTextName, setResponseTextName] = useState('');
  const [showUpdateStateModal, setShowUpdateStateModal] = useState(false);
  const [newState, setNewState] = useState('');
  const [concatVariables, setConcatVariables] = useState([{ variable: '', validateExistence: false }]);
  const [concatResultName, setConcatResultName] = useState('');
  const [showConcatVariablesModal, setShowConcatVariablesModal] = useState(false);
  const [selectedVariables, setSelectedVariables] = useState([]);
  const [showGptAssistantModal, setShowGptAssistantModal] = useState(false);
  const [assistantName, setAssistantName] = useState('');
  const [gptModel, setGptModel] = useState('gpt-3.5');
  const [personality, setPersonality] = useState('');
  const [assistants, setAssistants] = useState([{ name: 'Seleccionar asistente', displayName: 'Seleccionar asistente' }]);
  const [showGptQueryModal, setShowGptQueryModal] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState('');
  const [queryName, setQueryName] = useState('');
  const [queryPrompt, setQueryPrompt] = useState('');
  const [showSplitVariableModal, setShowSplitVariableModal] = useState(false);
  const [splitVariable, setSplitVariable] = useState('');
  const [splitParameter, setSplitParameter] = useState('');
  const [splitResultNames, setSplitResultNames] = useState(['']);
  const [showUpdateContactNameModal, setShowUpdateContactNameModal] = useState(false);
  const [selectedFirstName, setSelectedFirstName] = useState('');
  const [selectedLastName, setSelectedLastName] = useState('');
  const [showUpdateContactModal, setShowUpdateContactModal] = useState(false);
  const [selectedContactField, setSelectedContactField] = useState('');
  const [selectedContactVariable, setSelectedContactVariable] = useState('');
  const [showUpdateContactInitializerModal, setShowUpdateContactInitializerModal] = useState(false);
  const [showChangeResponsibleModal, setShowChangeResponsibleModal] = useState(false);
  const [responsibles, setResponsibles] = useState([]);
  const [selectedResponsible, setSelectedResponsible] = useState('');
  const [showResponseImageModal, setShowResponseImageModal] = useState(false);
  const [responseImage, setResponseImage] = useState('');
  const [responseImageName, setResponseImageName] = useState('');
  const [showResponseVideoModal, setShowResponseVideoModal] = useState(false);
  const [responseVideo, setResponseVideo] = useState('');
  const [responseVideoName, setResponseVideoName] = useState('');
  const [responseVideoDuration, setResponseVideoDuration] = useState('');
  const [responseVideoThumbnail, setResponseVideoThumbnail] = useState('');
  const [showResponseTemplateModal, setShowResponseTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [variableValues, setVariableValues] = useState({});
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const contactFields = [
    { name: 'first_name', displayName: 'Nombre del contacto' },
    { name: 'last_name', displayName: 'Apellido del contacto' },
    { name: 'phone_number', displayName: 'Número del contacto' },
    { name: 'organization', displayName: 'Organización' },
    { name: 'label', displayName: 'Etiqueta' },
    { name: 'profile_url', displayName: 'URL del perfil' },
    { name: 'edad_approx', displayName: 'Edad aproximada' },
    { name: 'fecha_nacimiento', displayName: 'Fecha de nacimiento' },
    { name: 'nacionalidad', displayName: 'Nacionalidad' },
    { name: 'ciudad_residencia', displayName: 'Ciudad de residencia' },
    { name: 'direccion_completa', displayName: 'Dirección completa' },
    { name: 'email', displayName: 'Email' }
  ];


  useEffect(() => {
    if (bot) {
      const initialCode = bot.codigo || `${baseHeader}\n// Insert generated code here\n${baseFooter}`;
      const codeWithoutWrapper = initialCode.replace(baseHeader, '').replace(baseFooter, '');
      setCode(codeWithoutWrapper.trim());
      
      if (bot.react_flow) {
        const { nodes: initialNodesFromCode, edges: initialEdgesFromCode, variables: initialVariables = [] } = JSON.parse(bot.react_flow);
  
        // Filtra duplicados basados en nombre y displayName
        const uniqueVariables = [
          { name: 'Seleccione variable', displayName: 'Seleccione variable' },
          { name: 'messageData.text', displayName: 'Mensaje de Texto' },
          { name: 'responsibleUserId', displayName: 'ID del Responsable' },
          ...initialVariables
        ].filter((v, index, self) =>
          index === self.findIndex((t) => (
            t.name === v.name && t.displayName === v.displayName
          ))
        );
          console.log("estilos", initialEdgesFromCode)

        // Añadir estilos personalizados a los edges
        const styledEdges = initialEdgesFromCode.map(edge => ({
          ...edge,
          style: {
            stroke: '#3498DB', // Color de la línea
            strokeWidth: 2, // Grosor de la línea
            strokeDasharray: '5 5', // Línea punteada
          }
        }));
  
        setNodes(initialNodesFromCode);
        setEdges(styledEdges);
        setVariables(uniqueVariables);
      }
    }
  }, [bot]);  

    const fetchResponsibles = async () => {
      const companyId = localStorage.getItem("company_id");
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users?company_id=${companyId}`);
        setResponsibles(response.data);
      } catch (error) {
        console.error('Error fetching responsibles:', error);
      }
    };    

  const handleSave = async () => {
    try {
      const fullCode = `${baseHeader}\n${code}\n${baseFooter}`;
      const reactFlowData = JSON.stringify({ nodes, edges, variables });
      await axios.put(`${process.env.REACT_APP_API_URL}/api/bots/${bot.id_usuario}`, { codigo: fullCode, react_flow: reactFlowData });
      handleClose();
    } catch (error) {
      console.error('Error updating bot code:', error);
    }
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onElementsRemove = useCallback(
    (elementsToRemove) => {
      const nodeIdsToRemove = elementsToRemove.filter(el => el.id).map(el => el.id);
      setNodes((nds) => applyNodeChanges(nds.filter(node => !nodeIdsToRemove.includes(node.id)), nds));
      setEdges((eds) => applyEdgeChanges(eds.filter(edge => !nodeIdsToRemove.includes(edge.source) && !nodeIdsToRemove.includes(edge.target)), eds));
      setVariables((vars) => vars.filter(varObj => !nodeIdsToRemove.includes(varObj.nodeId)));
    },
    [setNodes, setEdges, setVariables]
  );
  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) => {
      // Añadir estilos al nuevo edge
      const styledEdge = {
        ...newConnection,
        style: {
          stroke: '#3498DB', // Color de la línea
          strokeWidth: 2, // Grosor de la línea
          strokeDasharray: '5 5', // Línea punteada
        },
      };
  
      // Actualizar el edge con los nuevos estilos
      setEdges((els) => updateEdge(oldEdge, styledEdge, els));
    },
    [setEdges]
  );
  const addConsoleLogNode = () => {
    const message = prompt("Enter the message to print:");
    if (!message) return;
    
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'custom',
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: { label: `Imprimir: ${message}`, code: [`console.log('${message}');`] },
      parentId: currentParentId,
    };
    
    const newEdge = {
      id: `e${currentParentId || nodes.length}-${nodes.length + 1}`,
      source: currentParentId || `${nodes.length}`,
      target: `${nodes.length + 1}`,
      animated: true,
      style: {
        stroke: '#3498DB', // Color de la línea
        strokeWidth: 2, // Grosor de la línea
        strokeDasharray: '5 5', // Línea punteada
      },
    };
    
    const updatedNodes = [...nodes, newNode];
    const updatedEdges = [...edges, newEdge];
    
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    
    generateCodeFromNodes(updatedNodes, updatedEdges);
  };
  console.log(edges)

  const addConversationStateNode = () => {
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'custom',
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: { 
        label: 'Obtener el estado de la conversación', 
        code: [
          `// Obtener el estado de la conversación`,
          `const conversationStateQuery = 'SELECT state FROM conversations WHERE conversation_id = $1';`,
          `const conversationStateResult = await pool.query(conversationStateQuery, [conversationId]);`,
          `const conversationState = conversationStateResult.rows[0]?.state;`
        ],
      },
      parentId: currentParentId,
    };
    const newEdge = {
      id: `e${currentParentId || nodes.length}-${nodes.length + 1}`,
      source: currentParentId || `${nodes.length}`,
      target: `${nodes.length + 1}`,
      animated: true,
    };
    const updatedNodes = [...nodes, newNode];
    const updatedEdges = [...edges, newEdge];
  
    // Filtra duplicados
    const newVariable = { name: 'conversationState', displayName: 'Estado de la Conversación', nodeId: newNode.id };
    const uniqueVariables = [...variables, newVariable].filter((v, index, self) =>
      index === self.findIndex((t) => (
        t.name === v.name && t.displayName === v.displayName
      ))
    );
  
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    setVariables(uniqueVariables);
    generateCodeFromNodes(updatedNodes, updatedEdges);
  };

  const addResponsibleNode = () => {
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'custom',
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: {
        label: 'Obtener responsable',
        code: [
          `const responsibleRes = await pool.query('SELECT id_usuario FROM conversations WHERE conversation_id = $1', [conversationId]);`,
          `const responsibleUserId = responsibleRes.rows[0].id_usuario;`
        ],
      },
      parentId: currentParentId,
    };
    const newEdge = {
      id: `e${currentParentId || nodes.length}-${nodes.length + 1}`,
      source: currentParentId || `${nodes.length}`,
      target: `${nodes.length + 1}`,
      animated: true,
    };
    const updatedNodes = [...nodes, newNode];
    const updatedEdges = [...edges, newEdge];
  
    // Filtra duplicados
    const newVariable = { name: 'responsibleUserId', displayName: 'ID del Responsable', nodeId: newNode.id };
    const uniqueVariables = [...variables, newVariable].filter((v, index, self) =>
      index === self.findIndex((t) => (
        t.name === v.name && t.displayName === v.displayName
      ))
    );
  
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    setVariables(uniqueVariables);
    generateCodeFromNodes(updatedNodes, updatedEdges);
  };  

  const addContactInfoNode = () => {
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'custom',
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: { 
        label: 'Obtener información del contacto', 
        code: [`const contactInfo = await getContactInfo(senderId, integrationDetails.company_id);`] 
      },
      parentId: currentParentId,
    };
    const newEdge = {
      id: `e${currentParentId || nodes.length}-${nodes.length + 1}`,
      source: currentParentId || `${nodes.length}`,
      target: `${nodes.length + 1}`,
      animated: true,
    };
    const updatedNodes = [...nodes, newNode];
    const updatedEdges = [...edges, newEdge];
  
    // Filtra duplicados
    const newVariables = [
      { name: 'contactInfo', displayName: 'Información del contacto', nodeId: newNode.id },
      { name: 'contactInfo.first_name', displayName: 'Nombre del contacto', nodeId: newNode.id },
      { name: 'contactInfo.last_name', displayName: 'Apellido del contacto', nodeId: newNode.id },
      { name: 'contactInfo.phone_number', displayName: 'Número del contacto', nodeId: newNode.id },
      { name: 'contactInfo.organization', displayName: 'Organización', nodeId: newNode.id },
      { name: 'contactInfo.label', displayName: 'Etiqueta', nodeId: newNode.id },
      { name: 'contactInfo.profile_url', displayName: 'URL del perfil', nodeId: newNode.id },
      { name: 'contactInfo.edad_approx', displayName: 'Edad aproximada', nodeId: newNode.id },
      { name: 'contactInfo.fecha_nacimiento', displayName: 'Fecha de nacimiento', nodeId: newNode.id },
      { name: 'contactInfo.nacionalidad', displayName: 'Nacionalidad', nodeId: newNode.id },
      { name: 'contactInfo.ciudad_residencia', displayName: 'Ciudad de residencia', nodeId: newNode.id },
      { name: 'contactInfo.direccion_completa', displayName: 'Dirección completa', nodeId: newNode.id },
      { name: 'contactInfo.email', displayName: 'Email', nodeId: newNode.id }
    ];
  
    const uniqueVariables = [...variables, ...newVariables].filter((v, index, self) =>
      index === self.findIndex((t) => (
        t.name === v.name && t.displayName === v.displayName
      ))
    );
  
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    setVariables(uniqueVariables);
    generateCodeFromNodes(updatedNodes, updatedEdges);
  };
  

  const handleConcatVariablesSave = () => {
    const variablesStr = concatVariables
      .map(({ variable, validateExistence }) => validateExistence ? `\${${variable} ? ${variable} : ''}` : `\${${variable}}`)
      .join(' ');

    const concatCode = `const ${concatResultName} = \`${variablesStr}\`;`;
    
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'custom',
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: { label: 'Concatenar Variables', code: [concatCode] },
      parentId: currentParentId,
    };

    const newEdge = {
      id: `e${currentParentId || nodes.length}-${nodes.length + 1}`,
      source: currentParentId || `${nodes.length}`,
      target: `${nodes.length + 1}`,
      animated: true,
    };

    const updatedNodes = [...nodes, newNode];
    const updatedEdges = [...edges, newEdge];
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    setVariables((vars) => [...vars, { name: concatResultName, displayName: concatResultName, nodeId: newNode.id }]);
    generateCodeFromNodes(updatedNodes, updatedEdges);
    setShowConcatVariablesModal(false);
    setConcatVariables([{ variable: '', validateExistence: false }]);
    setConcatResultName('');
  };

  const fetchTemplates = async () => {
    const companyId = localStorage.getItem('company_id');
    const token = localStorage.getItem('token');
    if (!companyId || !token) {
      console.error('No company ID or token found');
      return;
    }
  
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/templates`, {
        params: { company_id: companyId },
        headers: { Authorization: `Bearer ${token}` }
      });
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const openTemplateModal = () => {
    fetchTemplates();
    setShowResponseTemplateModal(true);
  };
  
  const handleResponseImageModalSave = async () => {
    try {
      // Cargar la imagen al backend
      const formData = new FormData();
      formData.append('image', responseImage);
  
      const uploadResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const imageUrl = uploadResponse.data.imageUrl;
      const uniqueResponseImageName = `responseImage_${nodes.length + 1}`;
  
      const newNode = {
        id: `${nodes.length + 1}`,
        type: 'custom',
        position: { x: Math.random() * 250, y: Math.random() * 250 },
        data: {
          label: `Enviar Imagen: ${responseImageName}`,
          code: [
            `responseImage = "${imageUrl}";`,
            `await sendImageMessage(io, { body: { phone: senderId, imageUrl: responseImage, conversationId } }, {});`,
          ],
        },
        parentId: currentParentId,
      };
  
      const newEdge = {
        id: `e${currentParentId || nodes.length}-${nodes.length + 1}`,
        source: currentParentId || `${nodes.length}`,
        target: `${nodes.length + 1}`,
        animated: true,
      };
  
      const updatedNodes = [...nodes, newNode];
      const updatedEdges = [...edges, newEdge];
      setNodes(updatedNodes);
      setEdges(updatedEdges);
      setVariables((vars) => [...vars, { name: uniqueResponseImageName, displayName: responseImageName, nodeId: newNode.id }]);
      generateCodeFromNodes(updatedNodes, updatedEdges);
      setShowResponseImageModal(false);
      setResponseImage('');
      setResponseImageName('');
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };  

  const handleResponseVideoModalSave = async () => {
    try {
      // Cargar el video al backend
      const formData = new FormData();
      formData.append('video', responseVideo);
  
      const uploadResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/upload-video`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const videoUrl = uploadResponse.data.videoUrl;
      const videoDuration = uploadResponse.data.videoDuration;
      const videoThumbnail = uploadResponse.data.videoThumbnail;
      const uniqueResponseVideoName = `responseVideo_${nodes.length + 1}`;
  
      const newNode = {
        id: `${nodes.length + 1}`,
        type: 'custom',
        position: { x: Math.random() * 250, y: Math.random() * 250 },
        data: {
          label: `Enviar Video: ${responseVideoName}`,
          code: [
            `responseVideo = "${videoUrl}";`,
            `videoDuration = "${videoDuration}";`,
            `videoThumbnail = "${videoThumbnail}";`,
            `await sendVideoMessage(io, { body: { phone: senderId, videoUrl: responseVideo, videoDuration, videoThumbnail, conversationId } }, {});`,
          ],
        },
        parentId: currentParentId,
      };
  
      const newEdge = {
        id: `e${currentParentId || nodes.length}-${nodes.length + 1}`,
        source: currentParentId || `${nodes.length}`,
        target: `${nodes.length + 1}`,
        animated: true,
      };
  
      const updatedNodes = [...nodes, newNode];
      const updatedEdges = [...edges, newEdge];
      setNodes(updatedNodes);
      setEdges(updatedEdges);
      setVariables((vars) => [...vars, { name: uniqueResponseVideoName, displayName: responseVideoName, nodeId: newNode.id }]);
      generateCodeFromNodes(updatedNodes, updatedEdges);
      setShowResponseVideoModal(false);
      setResponseVideo('');
      setResponseVideoName('');
      setResponseVideoDuration('');
      setResponseVideoThumbnail('');
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };  

  const addConcatVariable = () => {
    setConcatVariables([...concatVariables, { variable: '', validateExistence: false }]);
  };

  const removeConcatVariable = (index) => {
    setConcatVariables(concatVariables.filter((_, i) => i !== index));
  };

  const updateConcatVariable = (index, field, value) => {
    const newConcatVariables = [...concatVariables];
    newConcatVariables[index][field] = value;
    setConcatVariables(newConcatVariables);
  };

  const addUpdateContactNameNode = () => {
    setShowUpdateContactNameModal(true);
  };

  const addConditionalNode = () => {
    setShowModal(true);
  };

  const addConcatVariablesNode = () => {
    setShowConcatVariablesModal(true);
  };  

  const addSwitchNode = () => {
    setShowSwitchModal(true);
  };

  const addCaseNode = () => {
    setShowCaseModal(true);
  };

  const addCondition = () => {
    setConditions([...conditions, { variable: '', operator: '==', value: '', logicalOperator: '' }]);
  };

  const addGptQueryNode = () => {
    setShowGptQueryModal(true);
  };

  const addSendTextNode = () => {
    setShowResponseTextModal(true);
    setResponseText(''); // Asegúrate de reiniciar el texto de respuesta
    setSelectedVariables([]); // Asegúrate de reiniciar las variables seleccionadas
  };

  const addUpdateContactNode = () => {
    setShowUpdateContactModal(true);
  };
  
  const addUpdateStateNode = () => {
    setShowUpdateStateModal(true);
  };

  const removeCondition = (index) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const updateCondition = (index, field, value) => {
    const newConditions = [...conditions];
    newConditions[index][field] = value;
    setConditions(newConditions);
  };

  const addGptAssistantNode = () => {
    setShowGptAssistantModal(true);
  };

  const addSplitVariableNode = () => {
    setShowSplitVariableModal(true);
  };
  
  const addSplitResultName = () => {
    setSplitResultNames([...splitResultNames, '']);
  };
  
  const removeSplitResultName = (index) => {
    setSplitResultNames(splitResultNames.filter((_, i) => i !== index));
  };
  
  
  const updateSplitResultName = (index, value) => {
    const newSplitResultNames = [...splitResultNames];
    newSplitResultNames[index] = value;
    setSplitResultNames(newSplitResultNames);
  };
  
  const handleGptAssistantModalSave = () => {
    if (assistants.some(assistant => assistant.name === assistantName)) {
      alert('Ya existe un asistente con ese nombre. Por favor, elige otro nombre.');
      return;
    }
  
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'custom',
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: {
        label: `Asistente GPT: ${assistantName}`,
        code: [
          `async function ${assistantName}(prompt) {`,
          `  const apiKey = process.env.OPENAI_API_KEY;`,
          `  const url = "https://api.openai.com/v1/chat/completions";`,
          `  const headers = {`,
          `    'Authorization': \`Bearer \${apiKey}\`,`,
          `    'Content-Type': 'application/json'`,
          `  };`,
          `  const payload = {`,
          `    model: "${gptModel}",`,
          `    messages: [`,
          `      { role: "system", content: "${personality}" },`,
          `      { role: "user", content: prompt }`,
          `    ]`,
          `  };`,
          `  try {`,
          `    const response = await axios.post(url, payload, { headers });`,
          `    return response.data.choices[0].message.content.trim();`,
          `  } catch (error) {`,
          `    console.error("Error al obtener respuesta de GPT:", error);`,
          `    return "Error al obtener la respuesta";`,
          `  }`,
          `}`,
        ],
      },
      parentId: currentParentId,
    };
  
    const newEdge = {
      id: `e${currentParentId || nodes.length}-${nodes.length + 1}`,
      source: currentParentId || `${nodes.length}`,
      target: `${nodes.length + 1}`,
      animated: true,
    };
  
    const updatedNodes = [...nodes, newNode];
    const updatedEdges = [...edges, newEdge];
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    generateCodeFromNodes(updatedNodes, updatedEdges);
  
    // Insertar el nuevo asistente en la lista de asistentes
    setAssistants([...assistants, { name: assistantName, displayName: assistantName }]);
  
    setShowGptAssistantModal(false);
    setAssistantName('');
    setGptModel('');
    setPersonality('');
  };

  const addChangeResponsibleNode = () => {
    fetchResponsibles();
    setShowChangeResponsibleModal(true);
  };

  const handleResponseTemplateModalSave = () => {
    const companyId = localStorage.getItem('company_id');
  
    if (!selectedTemplate) {
      console.error('No template selected');
      return;
    }
  
    const parameters = [];
    selectedTemplate.headerVariables?.forEach(variable => {
      const value = variableValues[`header_${variable.name.replace(/{{|}}/g, '')}`] || '';
      parameters.push(value);
    });
    selectedTemplate.bodyVariables?.forEach(variable => {
      const value = variableValues[`body_${variable.name.replace(/{{|}}/g, '')}`] || '';
      parameters.push(value);
    });
    selectedTemplate.buttonVariables?.forEach(variable => {
      const value = variableValues[`button_${variable.name.replace(/{{|}}/g, '')}`] || '';
      parameters.push(value);
    });
  
    const payload = {
      conversation: 'conversationData',
      template: selectedTemplate,
      parameters,
      company_id: 'integrationDetails.company_id'
    };
  
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'custom',
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: {
        label: `Enviar Plantilla: ${selectedTemplate.nombre}`,
        code: [
          `const payload = ${JSON.stringify(payload)};`,
          `await sendTemplateToSingleContact(io, { body: payload }, {});`
        ]
      },
      parentId: currentParentId,
    };
  
    const newEdge = {
      id: `e${currentParentId || nodes.length}-${nodes.length + 1}`,
      source: currentParentId || `${nodes.length}`,
      target: `${nodes.length + 1}`,
      animated: true,
    };
  
    const updatedNodes = [...nodes, newNode];
    const updatedEdges = [...edges, newEdge];
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    generateCodeFromNodes(updatedNodes, updatedEdges);
    setShowResponseTemplateModal(false);
    setSelectedTemplate(null);
  };
  
  
  
  const handleChangeResponsibleModalSave = () => {
    const selectedResponsibleObject = responsibles.find(r => r.id_usuario === parseInt(selectedResponsible));
    const fullName = `${selectedResponsibleObject.nombre} ${selectedResponsibleObject.apellido}`;
  
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'custom',
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: {
        label: `Cambiar responsable a: ${fullName}`,
        code: [
          `await assignResponsibleUser(io, conversationId, responsibleUserId, ${selectedResponsible});`,
          `await processMessage(io, senderId, messageData, "Si", integrationDetails);`
        ],
      },
      parentId: currentParentId,
    };
  
    const newEdge = {
      id: `e${currentParentId || nodes.length}-${nodes.length + 1}`,
      source: currentParentId || `${nodes.length}`,
      target: `${nodes.length + 1}`,
      animated: true,
    };
  
    const updatedNodes = [...nodes, newNode];
    const updatedEdges = [...edges, newEdge];
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    generateCodeFromNodes(updatedNodes, updatedEdges);
    setShowChangeResponsibleModal(false);
    setSelectedResponsible('');
  };  

  const handleUpdateContactInitializerModalSave = () => {
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'custom',
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: {
        label: 'Actualizador contacto',
        code: [
          `async function updateContact(io, phoneNumber, companyId, contactFieldName, contactFieldValue) {`,
          `  const query = \``,
          `    UPDATE contacts SET `,
          `    \${contactFieldName} = $3 `,
          `    WHERE phone_number = $1 AND company_id = $2`,
          `    RETURNING *;`,
          `  \`;`,
          `  try {`,
          `    const result = await pool.query(query, [phoneNumber, companyId, contactFieldValue]);`,
          `    if (result.rows.length > 0) {`,
          `      const updatedContact = result.rows[0];`,
          `      io.emit('contactUpdated', updatedContact);`,
          `    } else {`,
          `      console.log('No contact found for the given phone number and company ID.');`,
          `    }`,
          `  } catch (err) {`,
          `    console.error('Database error in updateContact:', err);`,
          `    throw err;`,
          `  }`,
          `}`,
        ],
      },
      parentId: currentParentId,
    };
  
    const newEdge = {
      id: `e${currentParentId || nodes.length}-${nodes.length + 1}`,
      source: currentParentId || `${nodes.length}`,
      target: `${nodes.length + 1}`,
      animated: true,
    };
  
    const updatedNodes = [...nodes, newNode];
    const updatedEdges = [...edges, newEdge];
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    generateCodeFromNodes(updatedNodes, updatedEdges);
    setShowUpdateContactInitializerModal(false);
  };  
  
  const handleUpdateContactModalSave = () => {
    const contactField = contactFields.find(f => f.name === selectedContactField);
    const contactFieldName = contactField ? contactField.name : selectedContactField;
    const contactFieldValue = selectedContactVariable;
  
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'custom',
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: {
        label: `Actualizar contacto: ${contactField.displayName}`,
        code: [
          `await updateContact(io, phoneNumber, integrationDetails.company_id, '${contactFieldName}', ${contactFieldValue});`,
        ],
      },
      parentId: currentParentId,
    };
  
    const newEdge = {
      id: `e${currentParentId || nodes.length}-${nodes.length + 1}`,
      source: currentParentId || `${nodes.length}`,
      target: `${nodes.length + 1}`,
      animated: true,
    };
  
    const updatedNodes = [...nodes, newNode];
    const updatedEdges = [...edges, newEdge];
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    generateCodeFromNodes(updatedNodes, updatedEdges);
    setShowUpdateContactModal(false);
    setSelectedContactField('');
    setSelectedContactVariable('');
  };    

  const handleUpdateContactNameModalSave = () => {
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'custom',
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: {
        label: 'Actualizar nombre contacto',
        code: [
          `await updateContactName(io, senderId, integrationDetails.company_id, ${selectedFirstName}, ${selectedLastName} || null);`,
        ],
      },
      parentId: currentParentId,
    };
  
    const newEdge = {
      id: `e${currentParentId || nodes.length}-${nodes.length + 1}`,
      source: currentParentId || `${nodes.length}`,
      target: `${nodes.length + 1}`,
      animated: true,
    };
  
    const updatedNodes = [...nodes, newNode];
    const updatedEdges = [...edges, newEdge];
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    generateCodeFromNodes(updatedNodes, updatedEdges);
  
    setShowUpdateContactNameModal(false);
    setSelectedFirstName('');
    setSelectedLastName('');
  };  

  const handleSwitchModalSave = () => {
    const variable = variables.find(v => v.name === selectedVariable);
    const variableName = variable ? variable.name : selectedVariable;
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'switch',
      position: { x: 250, y: 55 + 75 * nodes.length },
      data: { label: `Switch (${variableName})`, code: [`switch (${variableName}) {`] },
      parentId: currentParentId,
    };
    
    const defaultGroup = {
      id: `${newNode.id}-default`,
      type: 'groupNode',
      position: { x: newNode.position.x + 100, y: newNode.position.y + 100 },
      data: { label: 'default' },
      parentId: newNode.id,
      style: { width: 300, height: 200 },
    };

    const newEdges = [
      {
        id: `e${currentParentId || nodes.length}-${newNode.id}`,
        source: currentParentId || `${nodes.length}`,
        target: newNode.id,
        animated: true,
      },
      {
        id: `e${newNode.id}-${defaultGroup.id}`,
        source: newNode.id,
        sourceHandle: 'default',
        target: defaultGroup.id,
        animated: true,
      },
    ];

    setNodes((nds) => nds.concat(newNode, defaultGroup));
    setEdges((eds) => eds.concat(newEdges));
    setShowSwitchModal(false);
    setSelectedVariable('');
    setCurrentSwitchNode(newNode.id);
    generateCodeFromNodes(nodes.concat(newNode, defaultGroup), edges.concat(newEdges));
  };

  const handleCaseModalSave = () => {
    const variable = variables.find(v => v.name === selectedVariable);
    const variableName = variable ? variable.name : selectedVariable;
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'caseNode',
      position: { x: 250, y: 55 + 75 * nodes.length },
      data: { label: `Caso (${comparisonValue})`, code: [`case '${comparisonValue}':`] },
      parentId: currentSwitchNode,
    };

    const caseGroup = {
      id: `${newNode.id}-group`,
      type: 'groupNode',
      position: { x: newNode.position.x + 100, y: newNode.position.y + 100 },
      data: { label: comparisonValue },
      parentId: newNode.id,
      style: { width: 300, height: 200 },
    };

    const newEdges = [
      {
        id: `e${currentSwitchNode}-${newNode.id}`,
        source: currentSwitchNode,
        sourceHandle: `${comparisonValue}`,
        target: newNode.id,
        animated: true,
      },
      {
        id: `e${newNode.id}-${caseGroup.id}`,
        source: newNode.id,
        target: caseGroup.id,
        animated: true,
      },
    ];

    setNodes((nds) => nds.concat(newNode, caseGroup));
    setEdges((eds) => eds.concat(newEdges));
    setShowCaseModal(false);
    setComparisonValue('');
    generateCodeFromNodes(nodes.concat(newNode, caseGroup), edges.concat(newEdges));
  };

  const handleUpdateStateModalSave = () => {
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'custom',
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: {
        label: `Actualizar estado a: ${newState}`,
        code: [
          `await updateConversationState(conversationId, '${newState}');`,
        ],
      },
      parentId: currentParentId,
    };
  
    const newEdge = {
      id: `e${currentParentId || nodes.length}-${nodes.length + 1}`,
      source: currentParentId || `${nodes.length}`,
      target: `${nodes.length + 1}`,
      animated: true,
    };
  
    const updatedNodes = [...nodes, newNode];
    const updatedEdges = [...edges, newEdge];
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    generateCodeFromNodes(updatedNodes, updatedEdges);
    setShowUpdateStateModal(false);
    setNewState('');
  };

  const handleResponseTextModalSave = () => {
    const finalResponseText = `\`${responseText.replace(/\${([^}]+)}/g, '${$1}')}\``;
  
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'custom',
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: {
        label: `Enviar Texto: ${responseTextName}`,
        code: [
          `responseText = ${finalResponseText};`,
          `await sendTextMessage(io, { body: { phone: senderId, messageText: responseText, conversationId } }, {});`,
        ],
      },
      parentId: currentParentId,
    };
  
    const newEdge = {
      id: `e${currentParentId || nodes.length}-${nodes.length + 1}`,
      source: currentParentId || `${nodes.length}`,
      target: `${nodes.length + 1}`,
      animated: true,
    };
  
    const updatedNodes = [...nodes, newNode];
    const updatedEdges = [...edges, newEdge];
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    setVariables((vars) => [...vars, { name: 'responseText', displayName: responseTextName, nodeId: newNode.id }]);
    generateCodeFromNodes(updatedNodes, updatedEdges);
    setShowResponseTextModal(false);
    setResponseText('');
    setResponseTextName('');
    setSelectedVariables([]);
  }; 
  
  const handleModalSave = () => {
    const conditionStr = conditions
      .map((condition, index) => {
        const { variable, operator, value, logicalOperator } = condition;
        const prefix = index === 0 ? '' : ` ${logicalOperator} `;
        if (operator === '!') {
          return `${prefix}!${variable}`;
        }
        return `${prefix}${variable} ${operator} '${value}'`;
      })
      .join('');

    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'conditional',
      position: { x: 250, y: 55 + 75 * nodes.length },
      data: { label: `Si ${conditionStr}`, code: [`if (${conditionStr})`, `{`, `} else {`] },
      parentId: currentParentId,
    };
  
    const ifGroup = {
      id: `${newNode.id}-if`,
      type: 'groupNode',
      position: { x: newNode.position.x - 100, y: newNode.position.y + 100 },
      data: { label: 'if' },
      parentId: newNode.id,
      style: { width: 300, height: 200 },
    };
  
    const elseGroup = {
      id: `${newNode.id}-else`,
      type: 'groupNode',
      position: { x: newNode.position.x + 100, y: newNode.position.y + 100 },
      data: { label: 'else' },
      parentId: newNode.id,
      style: { width: 300, height: 200 },
    };
  
    const newEdges = [
      {
        id: `e${currentParentId || nodes.length}-${newNode.id}`,
        source: currentParentId || `${nodes.length}`,
        target: newNode.id,
        animated: true,
      },
      {
        id: `e${newNode.id}-${ifGroup.id}`,
        source: newNode.id,
        sourceHandle: 'a',
        target: ifGroup.id,
        animated: true,
      },
      {
        id: `e${newNode.id}-${elseGroup.id}`,
        source: newNode.id,
        sourceHandle: 'b',
        target: elseGroup.id,
        animated: true,
      },
    ];
  
    setNodes((nds) => nds.concat(newNode, ifGroup, elseGroup));
    setEdges((eds) => eds.concat(newEdges));
    setShowModal(false);
    setSelectedVariable('');
    setSelectedOperator('==');
    setComparisonValue('');
    setConditions([{ variable: '', operator: '==', value: '', logicalOperator: '' }]);
    generateCodeFromNodes(nodes.concat(newNode, ifGroup, elseGroup), edges.concat(newEdges));
  };

  const handleGptQueryModalSave = () => {
    const finalPrompt = `\`${queryPrompt.replace(/\${([^}]+)}/g, '${$1}')}\``;
  
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'custom',
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: {
        label: `Consultar GPT: ${queryName}`,
        code: [
          `const ${queryName} = await ${selectedAssistant}(${finalPrompt});`,
        ],
      },
      parentId: currentParentId,
    };
  
    const newEdge = {
      id: `e${currentParentId || nodes.length}-${nodes.length + 1}`,
      source: currentParentId || `${nodes.length}`,
      target: `${nodes.length + 1}`,
      animated: true,
    };
  
    const updatedNodes = [...nodes, newNode];
    const updatedEdges = [...edges, newEdge];
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    setVariables((vars) => [...vars, { name: queryName, displayName: queryName, nodeId: newNode.id }]);
    generateCodeFromNodes(updatedNodes, updatedEdges);
    setShowGptQueryModal(false);
    setSelectedAssistant('');
    setQueryName('');
    setQueryPrompt('');
    setSelectedVariables([]);
  };

  const handleSplitVariableModalSave = () => {
    const resultNamesStr = splitResultNames.join(', ');
    const splitCode = `const [${resultNamesStr}] = ${splitVariable}.split('${splitParameter}');`;
  
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'custom',
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: {
        label: `Dividir variable: ${splitVariable}`,
        code: [splitCode],
      },
      parentId: currentParentId,
    };
  
    const newEdge = {
      id: `e${currentParentId || nodes.length}-${nodes.length + 1}`,
      source: currentParentId || `${nodes.length}`,
      target: `${nodes.length + 1}`,
      animated: true,
    };
  
    const updatedNodes = [...nodes, newNode];
    const updatedEdges = [...edges, newEdge];
  
    const newVariables = splitResultNames.map((name) => ({ name, displayName: name, nodeId: newNode.id }));
    setVariables((vars) => [...vars, ...newVariables]);
    
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    generateCodeFromNodes(updatedNodes, updatedEdges);
  
    setShowSplitVariableModal(false);
    setSplitVariable('');
    setSplitParameter('');
    setSplitResultNames(['']);
  };   

  const generateCodeFromNodes = (nodes, edges) => {
    let initialDeclarations = 'let responseText;\nlet responseImage;\nlet responseVideo;\nlet videoDuration;\nlet videoThumbnail;\n';

    initialDeclarations += `const queryConversation = \`
    SELECT
      c.conversation_id,
      c.contact_id,
      c.state,
      c.last_update,
      c.unread_messages,
      c.id_usuario,
      ct.id,
      ct.phone_number,
      ct.first_name,
      ct.last_name,
      ct.organization,
      ct.profile_url,
      ct.label,
      ct.edad_approx,
      ct.fecha_nacimiento,
      ct.nacionalidad,
      ct.ciudad_residencia,
      ct.direccion_completa,
      ct.email,
      ct.genero,
      ct.orientacion_sexual,
      ct.pagina_web,
      ct.link_instagram,
      ct.link_facebook,
      ct.link_linkedin,
      ct.link_twitter,
      ct.link_tiktok,
      ct.link_youtube,
      ct.nivel_ingresos,
      ct.ocupacion,
      ct.nivel_educativo,
      ct.estado_civil,
      ct.cantidad_hijos,
      ct.estilo_de_vida,
      ct.personalidad,
      ct.cultura,
      ct.preferencias_contacto,
      ct.historial_compras,
      ct.historial_interacciones,
      ct.observaciones_agente,
      ct.fecha_creacion_cliente,
      u.nombre as responsable_nombre,
      u.apellido as responsable_apellido,
      dp.id as phase_id,
      dp.name as phase_name,
      dp.color as phase_color,
      last_message_info.last_message,
      last_message_info.last_message_time,
      last_message_info.message_type
    FROM 
      conversations c
    LEFT JOIN users u ON c.id_usuario = u.id_usuario
    LEFT JOIN contacts ct ON c.contact_id = ct.id
    LEFT JOIN department_phases dp ON ct.label = dp.id
    LEFT JOIN LATERAL (
      SELECT
        sub.last_message,
        sub.last_message_time,
        sub.message_type
      FROM (
        SELECT
          message_text AS last_message,
          received_at AS last_message_time,
          message_type
        FROM messages
        WHERE conversation_fk = c.conversation_id
        UNION
        SELECT
          reply_text AS last_message,
          created_at AS last_message_time,
          reply_type AS message_type
        FROM replies
        WHERE conversation_fk = c.conversation_id
      ) sub
      ORDER BY sub.last_message_time DESC
      LIMIT 1
    ) last_message_info ON true
    WHERE c.conversation_id = $1;
  \`;

  const conversation = await pool.query(queryConversation, [conversationId]);
  if (conversation.rows.length === 0) {
    throw new Error('Conversation not found');
  }
  const conversationData = conversation.rows[0];\n\n`;
  
    const generateNodeCode = (node, indent = '') => {
      let nodeCode = '';
      if (node.type === 'custom') {
        nodeCode += `${indent}${node.data.code.join('\n')}\n`;
      } else if (node.type === 'conditional') {
        const condition = node.data.code[0];
        nodeCode += `${indent}${condition} {\n`;
        const ifChildren = nodes.filter((n) => n.parentId === `${node.id}-if` || (n.parentId && n.parentId.startsWith(`${node.id}-if`)));
        ifChildren.forEach((child) => {
          nodeCode += generateNodeCode(child, indent + '  ');
        });
        nodeCode += `${indent}} else {\n`;
        const elseChildren = nodes.filter((n) => n.parentId === `${node.id}-else` || (n.parentId && n.parentId.startsWith(`${node.id}-else`)));
        elseChildren.forEach((child) => {
          nodeCode += generateNodeCode(child, indent + '  ');
        });
        nodeCode += `${indent}}\n`;
      } else if (node.type === 'switch') {
        const switchStatement = node.data.code[0];
        nodeCode += `${indent}${switchStatement}\n`;
        const caseChildren = nodes.filter((n) => n.parentId === node.id);
        const caseStatements = caseChildren.filter((child) => child.type === 'caseNode');
        const defaultStatement = caseChildren.find((child) => child.type === 'groupNode');
        caseStatements.forEach((child) => {
          nodeCode += generateNodeCode(child, indent + '  ');
        });
        if (defaultStatement) {
          nodeCode += generateNodeCode(defaultStatement, indent + '  ');
        }
        nodeCode += `${indent}}\n`;
      } else if (node.type === 'caseNode') {
        const caseStatement = node.data.code[0];
        nodeCode += `${indent}${caseStatement}\n`;
        const caseChildren = nodes.filter((n) => n.parentId === node.id);
        caseChildren.forEach((child) => {
          nodeCode += generateNodeCode(child, indent + '  ');
        });
        nodeCode += `${indent}  break;\n`;
      } else if (node.type === 'groupNode') {
        const groupLabel = node.data.label;
        if (groupLabel === 'default') {
          nodeCode += `${indent}default:\n`;
        } else {
          nodeCode += `${indent}case '${groupLabel}':\n`;
        }
        const groupChildren = nodes.filter((n) => n.parentId === node.id);
        groupChildren.forEach((child) => {
          nodeCode += generateNodeCode(child, indent + '  ');
        });
        if (groupLabel === 'default') {
          nodeCode += `${indent}  break;\n`;
        }
      }
      return nodeCode;
    };
  
    const rootNodes = nodes.filter((node) => !node.parentId);
    let fullCode = initialDeclarations;
    rootNodes.forEach((rootNode) => {
      fullCode += generateNodeCode(rootNode);
    });
  
    setCode(fullCode);
  };  

  useEffect(() => {
    generateCodeFromNodes(nodes, edges);
  }, [nodes, edges]);

  return (
    <Modal show={show} onHide={handleClose} centered dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title">
      <Modal.Header closeButton>
        <Modal.Title>Editar Bot de Chat</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={2}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link active={selectedTab === 'Código'} onClick={() => setSelectedTab('Código')}>Código</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link active={selectedTab === 'Diagrama'} onClick={() => setSelectedTab('Diagrama')}>Diagrama</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col md={10}>
            {selectedTab === 'Código' && (
              <Form.Group controlId="formBotCode">
                <Form.Label>Código del Bot</Form.Label>
                <CodeMirror
                  value={code}
                  height="500px"
                  extensions={[javascript({ jsx: true })]}
                  onChange={(value) => setCode(value)}
                />
              </Form.Group>
            )}
            {selectedTab === 'Diagrama' && (
              <ReactFlowProvider>
                <div className="diagram-container" style={{ display: 'flex', height: '500px' }}>
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={(nds) => {
                      onNodesChangeState(nds);
                      generateCodeFromNodes(nds, edges);
                    }}
                    onEdgesChange={(eds) => {
                      onEdgesChangeState(eds);
                      generateCodeFromNodes(nodes, eds);
                    }}
                    onConnect={onConnect}
                    onElementsRemove={onElementsRemove}
                    onEdgeUpdate={onEdgeUpdate}
                    nodeTypes={nodeTypes}
                    onNodeClick={(_, node) => {
                      setCurrentParentId(node.id);
                      if (node.type === 'switch' || node.type === 'groupNode' || node.type === 'caseNode' || node.type === 'conditional') {
                        setCurrentSwitchNode(node.id);
                      } else {
                        setCurrentSwitchNode(null);
                      }
                    }}
                    style={{ flexGrow: 1 }}
                  >
                    <MiniMap />
                    <Controls />
                    <Background />
                  </ReactFlow>
                  <div className="toolbar" style={{ width: '250px', height: '300px', overflowY: 'auto', marginLeft: '70%', padding: '10px', borderLeft: '1px solid #ccc' }}>
                    <button onClick={addConsoleLogNode}>Imprimir en consola</button>
                    <button onClick={addConversationStateNode}>Estado de la conversación</button>
                    <button onClick={addResponsibleNode}>Responsable conversación</button>
                    <button onClick={addContactInfoNode}>Información del contacto</button>
                    <button onClick={addConditionalNode}>Condicional</button>
                    <button onClick={addSwitchNode}>Switch</button>
                    <button onClick={addCaseNode} disabled={!currentSwitchNode}>Caso</button>
                    <button onClick={addSendTextNode}>Enviar Texto</button>
                    <button onClick={() => setShowResponseImageModal(true)}>Enviar Imagen</button>
                    <button onClick={() => setShowResponseVideoModal(true)}>Enviar Video</button>
                    <button onClick={openTemplateModal}>Enviar Plantilla</button>
                    <button onClick={addUpdateStateNode}>Actualizar Estado</button>
                    <button onClick={addConcatVariablesNode}>Concatenar Variables</button>
                    <button onClick={addGptAssistantNode}>Asistente GPT</button>
                    <button onClick={addGptQueryNode}>Consultar GPT</button>
                    <button onClick={addSplitVariableNode}>Dividir Variable</button>
                    <button onClick={addUpdateContactNameNode}>Actualizar nombre contacto</button>
                    <button onClick={() => setShowUpdateContactInitializerModal(true)}>Actualizador contacto</button>
                    <button onClick={() => {
                      if (nodes.some(node => node.data.label === 'Actualizador contacto')) {
                        setShowUpdateContactModal(true);
                      } else {
                        alert('Debe agregar primero un "Actualizador contacto".');
                      }
                    }}>Actualizar contacto</button>
                    <button onClick={addChangeResponsibleNode}>Cambiar responsable</button>
                  </div>
                </div>
              </ReactFlowProvider>
            )}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Guardar
        </Button>
      </Modal.Footer>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Condicional</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {conditions.map((condition, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                {index > 0 && (
                  <Form.Group controlId={`formLogicalOperator${index}`}>
                    <Form.Label>Operador Lógico</Form.Label>
                    <Form.Control as="select" value={condition.logicalOperator} onChange={(e) => updateCondition(index, 'logicalOperator', e.target.value)}>
                      <option value="&&">Y</option>
                      <option value="||">O</option>
                    </Form.Control>
                  </Form.Group>
                )}
                <Form.Group controlId={`formVariable${index}`}>
                  <Form.Label>Variable</Form.Label>
                  <Form.Control as="select" value={condition.variable} onChange={(e) => updateCondition(index, 'variable', e.target.value)}>
                    {variables.map((variable) => (
                      <option key={variable.name} value={variable.name}>{variable.displayName}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId={`formOperator${index}`}>
                  <Form.Label>Operador</Form.Label>
                  <Form.Control as="select" value={condition.operator} onChange={(e) => updateCondition(index, 'operator', e.target.value)}>
                    <option value="==">Igual</option>
                    <option value="!=">Distinto</option>
                    <option value=">">Mayor</option>
                    <option value="<">Menor</option>
                    <option value=">=">Mayor igual</option>
                    <option value="<=">Menor igual</option>
                    <option value="!">No Existe</option>
                  </Form.Control>
                </Form.Group>
                {condition.operator !== '!' && (
                  <Form.Group controlId={`formComparisonValue${index}`}>
                    <Form.Label>Valor de Comparación</Form.Label>
                    <Form.Control type="text" value={condition.value} onChange={(e) => updateCondition(index, 'value', e.target.value)} />
                  </Form.Group>
                )}
                <Button variant="danger" onClick={() => removeCondition(index)}>Eliminar</Button>
              </div>
            ))}
            <Button variant="primary" onClick={addCondition}>Agregar Condición</Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSwitchModal} onHide={() => setShowSwitchModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Switch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formSwitchVariable">
              <Form.Label>Variable</Form.Label>
              <Form.Control as="select" value={selectedVariable} onChange={(e) => setSelectedVariable(e.target.value)}>
                {variables.map((variable) => (
                  <option key={variable.name} value={variable.name}>{variable.displayName}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSwitchModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSwitchModalSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      

      <Modal show={showResponseTextModal} onHide={() => setShowResponseTextModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Enviar Texto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formResponseTextName">
              <Form.Label>Nombre de la Respuesta</Form.Label>
              <Form.Control type="text" value={responseTextName} onChange={(e) => setResponseTextName(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formResponseText">
              <Form.Label>Texto de la Respuesta</Form.Label>
              <Form.Control as="textarea" rows={3} value={responseText} onChange={(e) => setResponseText(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formVariables">
              <Form.Label>Agregar Variables</Form.Label>
              <Form.Control 
                as="select" 
                multiple 
                value={selectedVariables} 
                onChange={(e) => {
                  const selectedOptions = [...e.target.selectedOptions].map(o => o.value);
                  setSelectedVariables(selectedOptions);
                  const variablesStr = selectedOptions.map(variable => `\${${variable}}`).join(' ');
                  setResponseText(responseText + variablesStr);
                }}
              >
                {variables.map((variable) => (
                  <option key={variable.name} value={variable.name}>{variable.displayName}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResponseTextModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleResponseTextModalSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateContactNameModal} onHide={() => setShowUpdateContactNameModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar nombre contacto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFirstName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control as="select" value={selectedFirstName} onChange={(e) => setSelectedFirstName(e.target.value)}>
                {variables.map((variable) => (
                  <option key={variable.name} value={variable.name}>{variable.displayName}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Apellido</Form.Label>
              <Form.Control as="select" value={selectedLastName} onChange={(e) => setSelectedLastName(e.target.value)}>
                {variables.map((variable) => (
                  <option key={variable.name} value={variable.name}>{variable.displayName}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateContactNameModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdateContactNameModalSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateStateModal} onHide={() => setShowUpdateStateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Actualizar Estado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewState">
              <Form.Label>Nuevo Estado de la Conversación</Form.Label>
              <Form.Control type="text" value={newState} onChange={(e) => setNewState(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateStateModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdateStateModalSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showGptAssistantModal} onHide={() => setShowGptAssistantModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Configurar Asistente GPT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAssistantName">
              <Form.Label>Nombre del Asistente</Form.Label>
              <Form.Control 
                type="text" 
                value={assistantName} 
                onChange={(e) => {
                  const { value } = e.target;
                  setAssistantName(value);
                }}
                isInvalid={assistants.some(assistant => assistant.name === assistantName)}
              />
              <Form.Control.Feedback type="invalid">
                Ya existe un asistente con ese nombre. Por favor, elige otro nombre.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formGptModel">
              <Form.Label>Modelo GPT</Form.Label>
              <Form.Control 
                as="select" 
                value={gptModel} 
                onChange={(e) => setGptModel(e.target.value)}
              >
                <option value="gpt-3.5">gpt-3.5</option>
                <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                <option value="gpt-4">gpt-4</option>
                <option value="gpt-4-turbo">gpt-4-turbo</option>
                <option value="gpt-4o">gpt-4o</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formPersonality">
              <Form.Label>Personalidad</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={personality} 
                onChange={(e) => setPersonality(e.target.value)} 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowGptAssistantModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGptAssistantModalSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showGptQueryModal} onHide={() => setShowGptQueryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Consulta GPT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAssistantSelect">
              <Form.Label>Seleccionar Asistente</Form.Label>
              <Form.Control as="select" value={selectedAssistant} onChange={(e) => setSelectedAssistant(e.target.value)}>
                {assistants.map((assistant) => (
                  <option key={assistant.name} value={assistant.name}>{assistant.displayName}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formQueryName">
              <Form.Label>Nombre de la Consulta</Form.Label>
              <Form.Control type="text" value={queryName} onChange={(e) => setQueryName(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formQueryPrompt">
              <Form.Label>Prompt</Form.Label>
              <Form.Control as="textarea" rows={3} value={queryPrompt} onChange={(e) => setQueryPrompt(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formVariables">
              <Form.Label>Agregar Variables</Form.Label>
              <Form.Control 
                as="select" 
                multiple 
                value={selectedVariables} 
                onChange={(e) => {
                  const selectedOptions = [...e.target.selectedOptions].map(o => o.value);
                  const newVariables = selectedOptions.filter(option => !selectedVariables.includes(option));
                  setSelectedVariables([...selectedVariables, ...newVariables]);
                  const variablesStr = newVariables.map(variable => `\${${variable}}`).join(' ');
                  setQueryPrompt(queryPrompt + variablesStr);
                }}
              >
                {variables.map((variable) => (
                  <option key={variable.name} value={variable.name}>{variable.displayName}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowGptQueryModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGptQueryModalSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConcatVariablesModal} onHide={() => setShowConcatVariablesModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Concatenar Variables</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formConcatResultName">
              <Form.Label>Nombre de la Variable Resultado</Form.Label>
              <Form.Control type="text" value={concatResultName} onChange={(e) => setConcatResultName(e.target.value)} />
            </Form.Group>
            {concatVariables.map((variable, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <Form.Group controlId={`formConcatVariable${index}`}>
                  <Form.Label>Variable</Form.Label>
                  <Form.Control as="select" value={variable.variable} onChange={(e) => updateConcatVariable(index, 'variable', e.target.value)}>
                    {variables.map((variable) => (
                      <option key={variable.name} value={variable.name}>{variable.displayName}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId={`formValidateExistence${index}`}>
                  <Form.Check
                    type="checkbox"
                    label="Validar existencia"
                    checked={variable.validateExistence}
                    onChange={(e) => updateConcatVariable(index, 'validateExistence', e.target.checked)}
                  />
                </Form.Group>
                <Button variant="danger" onClick={() => removeConcatVariable(index)}>Eliminar</Button>
              </div>
            ))}
            <Button variant="primary" onClick={addConcatVariable}>Agregar Variable</Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConcatVariablesModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConcatVariablesSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSplitVariableModal} onHide={() => setShowSplitVariableModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Dividir Variable</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formSplitVariable">
              <Form.Label>Variable a Dividir</Form.Label>
              <Form.Control as="select" value={splitVariable} onChange={(e) => setSplitVariable(e.target.value)}>
                {variables.map((variable) => (
                  <option key={variable.name} value={variable.name}>{variable.displayName}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formSplitParameter">
              <Form.Label>Parámetro para Dividir</Form.Label>
              <Form.Control type="text" value={splitParameter} onChange={(e) => setSplitParameter(e.target.value)} />
            </Form.Group>
            {splitResultNames.map((resultName, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <Form.Group controlId={`formSplitResultName${index}`}>
                  <Form.Label>Nombre del Resultado {index + 1}</Form.Label>
                  <Form.Control type="text" value={resultName} onChange={(e) => updateSplitResultName(index, e.target.value)} />
                </Form.Group>
                {index > 1 && (
                  <Button variant="danger" onClick={() => removeSplitResultName(index)}>Eliminar</Button>
                )}
              </div>
            ))}
            <Button variant="primary" onClick={addSplitResultName}>Agregar Resultado</Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSplitVariableModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSplitVariableModalSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateContactInitializerModal} onHide={() => setShowUpdateContactInitializerModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Configurar Actualizador contacto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Este componente agrega la función de actualización de contacto al diagrama.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateContactInitializerModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdateContactInitializerModalSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Modal show={showUpdateContactModal} onHide={() => setShowUpdateContactModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar contacto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formContactField">
              <Form.Label>Campo a Modificar</Form.Label>
              <Form.Control as="select" value={selectedContactField} onChange={(e) => setSelectedContactField(e.target.value)}>
                {contactFields.map((field) => (
                  <option key={field.name} value={field.name}>{field.displayName}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formContactVariable">
              <Form.Label>Variable para Modificar</Form.Label>
              <Form.Control as="select" value={selectedContactVariable} onChange={(e) => setSelectedContactVariable(e.target.value)}>
                {variables.map((variable) => (
                  <option key={variable.name} value={variable.name}>{variable.displayName}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateContactModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdateContactModalSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showChangeResponsibleModal} onHide={() => setShowChangeResponsibleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cambiar Responsable</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formSelectResponsible">
              <Form.Label>Seleccionar Responsable</Form.Label>
              <Form.Control as="select" value={selectedResponsible} onChange={(e) => setSelectedResponsible(e.target.value)}>
                {responsibles.map((responsible) => (
                  <option key={responsible.id_usuario} value={responsible.id_usuario}>
                    {responsible.nombre} {responsible.apellido}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowChangeResponsibleModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleChangeResponsibleModalSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showResponseImageModal} onHide={() => setShowResponseImageModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Enviar Imagen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formResponseImageName">
              <Form.Label>Nombre de la Imagen</Form.Label>
              <Form.Control type="text" value={responseImageName} onChange={(e) => setResponseImageName(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formResponseImage">
              <Form.Label>Seleccionar Imagen</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={(e) => setResponseImage(e.target.files[0])} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResponseImageModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleResponseImageModalSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showResponseVideoModal} onHide={() => setShowResponseVideoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Enviar Video</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formResponseVideoName">
              <Form.Label>Nombre del Video</Form.Label>
              <Form.Control type="text" value={responseVideoName} onChange={(e) => setResponseVideoName(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formResponseVideo">
              <Form.Label>Seleccionar Video</Form.Label>
              <Form.Control type="file" accept="video/*" onChange={(e) => setResponseVideo(e.target.files[0])} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResponseVideoModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleResponseVideoModalSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showResponseTemplateModal} onHide={() => setShowResponseTemplateModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar Plantilla</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Buscar por nombre"
              onChange={(e) => {
                const searchTerm = e.target.value.toLowerCase();
                setTemplates(templates.filter(template => template.nombre.toLowerCase().includes(searchTerm)));
              }}
            />
            <Form.Select onChange={(e) => {
              const filterType = e.target.value;
              setTemplates(templates.filter(template => template.type === filterType));
            }}>
              <option value="">Filtrar por tipo</option>
              <option value="MARKETING">Marketing</option>
              <option value="UTILITY">Utilidad</option>
            </Form.Select>
          </InputGroup>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <Row>
              <Col md={6} className="templates-list-column">
                <div className="templates-list">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Tipo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {templates.length > 0 ? (
                        templates.map(template => (
                          <tr key={template.id} onClick={() => setSelectedTemplate(template)}>
                            <td>{template.nombre}</td>
                            <td>{template.type}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="text-center">No se encontraron plantillas.</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Col>
              <Col md={6} className="preview-column">
                {selectedTemplate && !loading && (
                  <div>
                    <div className='text-center'>
                      <h3>Vista Previa de la Plantilla</h3>
                    </div>
                    <div className="preview-container">
                      <div className="whatsapp-preview">
                        <div className="message">
                          <div className="header">
                            {selectedTemplate.header_type === 'TEXT' && <div><strong>{selectedTemplate.header_text}</strong></div>}
                            {selectedTemplate.header_type === 'IMAGE' && selectedTemplate.medio && <img src={`${process.env.REACT_APP_API_URL}${selectedTemplate.medio}`} alt="Header" style={{ width: '100%' }} />}
                            {selectedTemplate.header_type === 'VIDEO' && selectedTemplate.medio && <video src={`${process.env.REACT_APP_API_URL}${selectedTemplate.medio}`} controls style={{ width: '100%' }} />}
                            {selectedTemplate.header_type === 'DOCUMENT' && selectedTemplate.medio && (
                              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                <iframe 
                                  src={`${process.env.REACT_APP_API_URL}${selectedTemplate.medio}`} 
                                  style={{ width: '100%', aspectRatio: '4/3', zoom: 2, border: '0', overflow: 'hidden' }} 
                                  frameBorder="0"
                                ></iframe>
                              </div>
                            )}
                          </div>
                          <div className="body">
                            {selectedTemplate.body_text}
                          </div>
                          {selectedTemplate.footer && <div className="footer small">{selectedTemplate.footer}</div>}
                          {selectedTemplate.type_button !== 'none' && (
                            <div className="buttons">
                              {selectedTemplate.type_button === 'QUICK_REPLY' && <button className="btn btn-success w-100 mt-2">{selectedTemplate.button_text}</button>}
                              {selectedTemplate.type_button === 'PHONE_NUMBER' && <button className="btn btn-success w-100 mt-2">{selectedTemplate.button_text}</button>}
                              {selectedTemplate.type_button === 'URL' && <button className="btn btn-success w-100 mt-2">{selectedTemplate.button_text}</button>}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {selectedTemplate.headerVariables && selectedTemplate.headerVariables.length > 0 && (
                      <Form className="mt-4">
                        <h4>Variables de Encabezado</h4>
                        {selectedTemplate.headerVariables.map(variable => (
                          <Form.Group key={variable.name} className="mb-3">
                            <Form.Label>{variable.name}</Form.Label>
                            <Form.Control
                              type="text"
                              value={variableValues[`header_${variable.name.replace(/{{|}}/g, '')}`] || ''}
                              onChange={(e) => setVariableValues(prev => ({ ...prev, [`header_${variable.name.replace(/{{|}}/g, '')}`]: e.target.value }))}
                            />
                          </Form.Group>
                        ))}
                      </Form>
                    )}
                    {selectedTemplate.bodyVariables && selectedTemplate.bodyVariables.length > 0 && (
                      <Form className="mt-4">
                        <h4>Variables del Cuerpo</h4>
                        {selectedTemplate.bodyVariables.map(variable => (
                          <Form.Group key={variable.name} className="mb-3">
                            <Form.Label>{variable.name}</Form.Label>
                            <Form.Control
                              type="text"
                              value={variableValues[`body_${variable.name.replace(/{{|}}/g, '')}`] || ''}
                              onChange={(e) => setVariableValues(prev => ({ ...prev, [`body_${variable.name.replace(/{{|}}/g, '')}`]: e.target.value }))}
                            />
                          </Form.Group>
                        ))}
                      </Form>
                    )}
                    {selectedTemplate.buttonVariables && selectedTemplate.buttonVariables.length > 0 && (
                      <Form className="mt-4">
                        <h4>Variables de Botón</h4>
                        {selectedTemplate.buttonVariables.map(variable => (
                          <Form.Group key={variable.name} className="mb-3">
                            <Form.Label>{variable.name}</Form.Label>
                            <Form.Control
                              type="text"
                              value={variableValues[`button_${variable.name.replace(/{{|}}/g, '')}`] || ''}
                              onChange={(e) => setVariableValues(prev => ({ ...prev, [`button_${variable.name.replace(/{{|}}/g, '')}`]: e.target.value }))}
                            />
                          </Form.Group>
                        ))}
                      </Form>
                    )}
                  </div>
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResponseTemplateModal(false)}>
            Cerrar
          </Button>
          {selectedTemplate && (
            <Button 
              variant="primary" 
              onClick={handleResponseTemplateModalSave}
            >
              Guardar
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Modal show={showCaseModal} onHide={() => setShowCaseModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Caso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCaseValue">
              <Form.Label>Valor del Caso</Form.Label>
              <Form.Control type="text" value={comparisonValue} onChange={(e) => setComparisonValue(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCaseModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCaseModalSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </Modal>  
  );
};

export default EditChatBotModal;
