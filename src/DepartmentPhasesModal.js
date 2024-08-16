import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import './DepartmentPhasesModal.css';

const ItemType = 'PHASE';

const DraggablePhase = ({ phase, index, movePhase, handlePhaseChange }) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      movePhase(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} className="phase-bar">
      <div className="phase-content" style={{ borderColor: phase.color }}>
        <Form.Control
          type="text"
          name="name"
          value={phase.name}
          onChange={(e) => handlePhaseChange(e, index)}
          className="phase-name"
          required
        />
        <Form.Control
          type="color"
          name="color"
          value={phase.color}
          onChange={(e) => handlePhaseChange(e, index)}
          className="phase-color"
        />
      </div>
    </div>
  );
};

const DepartmentPhasesModal = ({ show, onHide, department, onPhasesUpdated }) => {
  const [phases, setPhases] = useState([]);
  const [newPhase, setNewPhase] = useState({ name: '', color: '#000000' });

  useEffect(() => {
    if (department) {
      const fetchPhases = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/departments/${department.id}/phases`);
          setPhases(response.data);
        } catch (error) {
          console.error('Error fetching phases:', error);
        }
      };

      fetchPhases();
    }
  }, [department]);

  const handlePhaseChange = (e, index) => {
    const { name, value } = e.target;
    const updatedPhases = phases.map((phase, i) => (i === index ? { ...phase, [name]: value } : phase));
    setPhases(updatedPhases);
  };

  const handleNewPhaseChange = (e) => {
    const { name, value } = e.target;
    setNewPhase({
      ...newPhase,
      [name]: value
    });
  };

  const handleAddPhase = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/departments/${department.id}/phases`, {
        ...newPhase,
        department_id: department.id
      });
      setPhases([...phases, response.data]);
      setNewPhase({ name: '', color: '#000000' });
    } catch (error) {
      console.error('Error adding phase:', error);
    }
  };

  const handleSavePhases = async () => {
    try {
      await Promise.all(phases.map((phase, index) =>
        axios.put(`${process.env.REACT_APP_API_URL}/api/departments/phases/${phase.id}`, {
          ...phase,
          order: index + 1 // Update the order based on the current index
        })
      ));
      onPhasesUpdated(phases);
      onHide();
    } catch (error) {
      console.error('Error saving phases:', error);
    }
  };

  const movePhase = (dragIndex, hoverIndex) => {
    const draggedPhase = phases[dragIndex];
    setPhases(
      update(phases, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, draggedPhase],
        ],
      })
    );
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Fases de {department && department.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DndProvider backend={HTML5Backend}>
          {phases.map((phase, index) => (
            <DraggablePhase
              key={phase.id}
              index={index}
              phase={phase}
              movePhase={movePhase}
              handlePhaseChange={handlePhaseChange}
            />
          ))}
        </DndProvider>
        <hr />
        <h5 className='text-center'>Agregar Nueva Fase</h5>
        <br></br>
        <Form>
          <Form.Group controlId="formNewPhaseName">
            <Form.Label>Nombre de la Fase</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newPhase.name}
              onChange={handleNewPhaseChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formNewPhaseColor">
            <Form.Label>Color</Form.Label>
            <Form.Control
              type="color"
              name="color"
              value={newPhase.color}
              onChange={handleNewPhaseChange}
            />
          </Form.Group>
          <br></br>
          <Button variant="primary" onClick={handleAddPhase}>
            Agregar Fase
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSavePhases}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DepartmentPhasesModal;
