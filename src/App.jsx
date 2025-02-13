import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    posicion: '',
    salario: 0,
    sexo: '',
    fecha_de_ingreso: new Date().toISOString().split('T')[0]
  });

  const [editFormData, setEditFormData] = useState({
    nombre: '',
    posicion: '',
    salario: 0,
    sexo: '',
    fecha_de_ingreso: new Date().toISOString().split('T')[0]
  });

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const initialFormState = {
    nombre: '',
    posicion: '',
    salario: 0,
    sexo: '',
    fecha_de_ingreso: ''
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:3000/employees');
      setEmployees(response.data);
      setFilteredEmployees(response.data); // Initialize filteredEmployees with all employees
      console.log(response.data);
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
      setFormData(initialFormState);
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
      setEditFormData(initialFormState);
      return false;
    }

    return true;
  };

  const addEmployee = async () => {
    try {
      if (!checkData()) return;

      const response = await axios.post('http://localhost:3000/employees', formData);
      console.log(response.data);
      fetchEmployees();
      setFormData(initialFormState);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const editEmployee = async (id) => {
    try {
      if (!checkDataEdit) return;
      const response = await axios.put(`http://localhost:3000/employees/${id}`, editFormData);
      console.log(response.data);
      fetchEmployees();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const deleteEmployee = async (id) => {
    const confirmed = window.confirm("¿Estás seguro de eliminar este empleado?");
    if (!confirmed) return;

    try {
      const response = await axios.post(`http://localhost:3000/employees/${id}/delete`);
      console.log(response.data);
      fetchEmployees();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmployees([...employees, formData]);
    setFormData({
      nombre: '',
      posicion: '',
      salario: '',
      sexo: '',
      fecha_de_ingreso: ''
    });

    setShowModal(false);
  }

  const handleEditSubmit = (e) => {
    e.preventDefault();
    editEmployee(editFormData._id);
    setEditFormData({
      nombre: '',
      posicion: '',
      salario: '',
      sexo: '',
      fecha_de_ingreso: ''
    });

    setShowEditModal(false);
  }

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
  }

  return (
    <div>
      <h1>Empleados</h1>
      <div>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Fecha de inicio"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="Fecha de fin"
        />
        <button onClick={handleFilter}>Filtrar</button>
        <button onClick={() => setShowModal(true)}>Agregar Empleado</button>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h2>Agregar Empleado</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Posición"
                value={formData.posicion}
                onChange={(e) =>
                  setFormData({ ...formData, posicion: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Salario"
                value={formData.salario}
                onChange={(e) =>
                  setFormData({ ...formData, salario: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Sexo"
                value={formData.sexo}
                onChange={(e) =>
                  setFormData({ ...formData, sexo: e.target.value })
                }
              />
              <input
                type="date"
                value={formData.fecha_de_ingreso}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fecha_de_ingreso: e.target.value,
                  })
                }
              />
              <button type="submit" onClick={addEmployee}>
                Agregar
              </button>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowEditModal(false)}>
              &times;
            </span>
            <h2>Editar Empleado</h2>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                placeholder="Nombre"
                value={editFormData.nombre}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, nombre: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Posición"
                value={editFormData.posicion}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, posicion: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Salario"
                value={editFormData.salario}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, salario: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Sexo"
                value={editFormData.sexo}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, sexo: e.target.value })
                }
              />
              <input
                type="date"
                value={editFormData.fecha_de_ingreso}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    fecha_de_ingreso: e.target.value,
                  })
                }
              />
              <button type="submit" onClick={() => editEmployee(editFormData._id)}>Guardar</button>
            </form>
          </div>
        </div>
      )}

      <table>
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
              <td>
                {new Date(employee.fecha_de_ingreso).toLocaleDateString()}
              </td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditFormData(employee);
                    setShowEditModal(true);
                  }}
                >
                  Editar
                </button>
                <button onClick={() => deleteEmployee(employee._id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
