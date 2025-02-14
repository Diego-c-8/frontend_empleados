import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Table, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const [formData, setFormData] = useState({
    nombre: '',
    posicion: '',
    salario: 0,
    sexo: '',
    fecha_de_ingreso: new Date().toISOString().split('T')[0]
  });

  const [editFormData, setEditFormData] = useState({
    _id: '',
    nombre: '',
    posicion: '',
    salario: 0,
    sexo: '',
    fecha_de_ingreso: new Date().toISOString().split('T')[0]
  });

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('https://backend-empleados-mi82.onrender.com/employees');
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (error) {
      if (error.response) {
        console.error('Error de respuesta:', error.response.status);
      } else if (error.request) {
        console.error('Error de CORS o red:', error.message);
      }
    }
  };

  const checkData = () => {
    const errors = [];
    if (!formData.nombre.trim()) errors.push("Nombre es requerido");
    if (!formData.posicion.trim()) errors.push("Posición es requerida");
    if (Number(formData.salario) <= 0) errors.push("Salario debe ser mayor que 0");
    if (!['M', 'F'].includes(formData.sexo)) errors.push("Sexo debe ser 'M' o 'F'");
    if (!formData.fecha_de_ingreso) errors.push("Fecha de ingreso es requerida");

    if (errors.length > 0) {
      window.alert(errors.join('\n'));
      return false;
    }
    return true;
  };

  const checkDataEdit = () => {
    const errors = [];
    if (!editFormData.nombre.trim()) errors.push("Nombre es requerido");
    if (!editFormData.posicion.trim()) errors.push("Posición es requerida");
    if (Number(editFormData.salario) <= 0) errors.push("Salario debe ser mayor que 0");
    if (!['M', 'F'].includes(editFormData.sexo)) errors.push("Sexo debe ser 'M' o 'F'");
    if (!editFormData.fecha_de_ingreso) errors.push("Fecha de ingreso es requerida");

    if (errors.length > 0) {
      window.alert(errors.join('\n'));
      return false;
    }
    return true;
  };

  const addEmployee = async (e) => {
    e.preventDefault();
    if (!checkData()) return;
    try {
      await axios.post('https://backend-empleados-mi82.onrender.com/employees', formData);
      fetchEmployees();
      setFormData({
        nombre: '',
        posicion: '',
        salario: 0,
        sexo: '',
        fecha_de_ingreso: new Date().toISOString().split('T')[0]
      });
      setShowModal(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const editEmployee = async (e) => {
    e.preventDefault();
    if (!checkDataEdit()) return;
    try {
      await axios.put(`https://backend-empleados-mi82.onrender.com/employees/${editFormData._id}`, editFormData);
      fetchEmployees();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteEmployee = async (id) => {
    const confirmed = window.confirm("¿Estás seguro de eliminar este empleado?");
    if (!confirmed) return;
    try {
      await axios.post(`https://backend-empleados-mi82.onrender.com/employees/${id}/delete`);
      fetchEmployees();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFilter = () => {
    const filtered = employees.filter(employee => {
      const ingresoDate = new Date(employee.fecha_de_ingreso);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start && end) {
        return ingresoDate >= start && ingresoDate <= end;
      } else if (start) {
        return ingresoDate >= start;
      } else if (end) {
        return ingresoDate <= end;
      }
      return true;
    });
    setFilteredEmployees(filtered);
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h1>Empleados</h1>
        </Col>
      </Row>
      <Row className="mb-3 align-items-end">
        <Col md={3}>
          <Form.Group controlId="startDate">
            <Form.Label>Fecha de inicio</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId="endDate">
            <Form.Label>Fecha de fin</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Button variant="primary" onClick={handleFilter}>
            Filtrar
          </Button>
        </Col>
        <Col md={3} className="text-end">
          <Button variant="success" onClick={() => setShowModal(true)}>
            Agregar Empleado
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Posición</th>
                <th>Salario</th>
                <th>Sexo</th>
                <th>Fecha de Ingreso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee, index) => (
                <tr key={index}>
                  <td>{employee.nombre}</td>
                  <td>{employee.posicion}</td>
                  <td>${employee.salario}</td>
                  <td>{employee.sexo}</td>
                  <td>{new Date(employee.fecha_de_ingreso).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        setEditFormData(employee);
                        setShowEditModal(true);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteEmployee(employee._id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Add Employee Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={addEmployee}>
          <Modal.Header closeButton>
            <Modal.Title>Agregar Empleado</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPosicion">
              <Form.Label>Posición</Form.Label>
              <Form.Control
                type="text"
                placeholder="Posición"
                value={formData.posicion}
                onChange={(e) => setFormData({ ...formData, posicion: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formSalario">
              <Form.Label>Salario</Form.Label>
              <Form.Control
                type="number"
                placeholder="Salario"
                value={formData.salario}
                onChange={(e) => setFormData({ ...formData, salario: parseInt(e.target.value) || 0 })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formSexo">
              <Form.Label>Sexo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Sexo (M/F)"
                value={formData.sexo}
                onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formFecha">
              <Form.Label>Fecha de Ingreso</Form.Label>
              <Form.Control
                type="date"
                value={formData.fecha_de_ingreso}
                onChange={(e) => setFormData({ ...formData, fecha_de_ingreso: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Agregar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Form onSubmit={editEmployee}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Empleado</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="editFormNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                value={editFormData.nombre}
                onChange={(e) => setEditFormData({ ...editFormData, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editFormPosicion">
              <Form.Label>Posición</Form.Label>
              <Form.Control
                type="text"
                placeholder="Posición"
                value={editFormData.posicion}
                onChange={(e) => setEditFormData({ ...editFormData, posicion: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editFormSalario">
              <Form.Label>Salario</Form.Label>
              <Form.Control
                type="number"
                placeholder="Salario"
                value={editFormData.salario}
                onChange={(e) => setEditFormData({ ...editFormData, salario: parseInt(e.target.value) || 0 })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editFormSexo">
              <Form.Label>Sexo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Sexo (M/F)"
                value={editFormData.sexo}
                onChange={(e) => setEditFormData({ ...editFormData, sexo: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editFormFecha">
              <Form.Label>Fecha de Ingreso</Form.Label>
              <Form.Control
                type="date"
                value={editFormData.fecha_de_ingreso}
                onChange={(e) => setEditFormData({ ...editFormData, fecha_de_ingreso: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default App;
