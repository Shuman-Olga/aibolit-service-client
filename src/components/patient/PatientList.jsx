import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

import PatientDataService from '../../services/PatientService';
import AuthService from '../../services/authService';
import Pagination from '@mui/material/Pagination';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');

  // pagination
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const pageSizes = [10, 20, 50];

  useEffect(() => {
    getPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const getRequestParams = (search, page, pageSize) => {
    let params = {};

    if (search) {
      params['value'] = search;
    }

    if (page) {
      params['page'] = page - 1;
    }

    if (pageSize) {
      params['size'] = pageSize;
    }

    return params;
  };

  const onChangeSearchTitle = (e) => {
    const search = e.target.value;
    setSearch(search);
  };
  //получить список
  const getPatients = async () => {
    const params = getRequestParams(search, page, pageSize);
    const currentUser = AuthService.getCurrentUser();

    if (currentUser.role.name === 'admin' || 'director') {
      await PatientDataService.getAll(params)
        .then((response) => {
          const { patients, totalPages } = response.data;
          console.log(response.data);
          setPatients(patients);
          setCount(totalPages);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      await PatientDataService.findPatient()
        .then((response) => {
          const { patients, totalPages } = response.data;
          console.log(response.data);
          setPatients(patients);
          setCount(totalPages);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  const refreshList = () => {
    getPatients();
  };

  const deletePatient = async (patient) => {
    const data = {
      published: patient.published === true ? false : true,
    };
    await PatientDataService.update(patient.id, data)
      .then((response) => {
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  //  поиск по value
  const findByValue = () => {
    setPage(1);
    getPatients();
  };
  //страницы
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setPage(1);
  };
  return (
    <div id="patient" className="container">
      <div className="col-md-6">
        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control "
            placeholder="Введите имя, фамилию или телефон"
            value={search}
            onChange={onChangeSearchTitle}
            onKeyUp={findByValue}
          />
          <div className="input-group-append ">
            <button className="btn btn-outline-secondary" type="button" onClick={findByValue}>
              Найти
            </button>
          </div>
        </div>
      </div>
      <div className="colums">
        <div className="mb-5">
          <h4>Вызовы</h4>
        </div>
        <div className="row">
          <div className="col-md-6 md-2">
            <div className="btn-modal-wrap">
              <Link
                id="btn-modal"
                type="button"
                className="btn btn-outline-primary"
                to={'/user/addpatient'}
              >
                <span className="material-icons">add</span>
                Новый пациент
              </Link>
            </div>
          </div>
        </div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }} scope="col">
                №
              </th>
              <th scope="col">ФИО</th>
              <th scope="col">№ карты</th>
              <th scope="col">Адрес</th>
              <th scope="col">Телефон</th>
              <th scope="col">Баланс</th>
              <th scope="col">Покупки</th>
              <th scope="col">Добавление в ситему</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((item, index) => (
              <tr key={index}>
                <td
                  style={{ textAlign: 'center' }}
                  className={
                    item.published === false ? 'text-decoration-line-through fw-light' : null
                  }
                >
                  {' '}
                  {item.id}
                </td>
                <td
                  className={
                    item.published === false ? 'text-decoration-line-through fw-light' : null
                  }
                >
                  {item.lastname} {item.firstname} {item.patronymic}
                  {item.parents.length === 0 ? null : (
                    <div className="d-flex align-items-center" style={{ height: '50px' }}>
                      <div className="position-absolute d-flex">
                        <span className="material-icons ">subdirectory_arrow_right</span>
                        {item.parents.map((p) => (
                          <div
                            key={p.id}
                            className={
                              item.published === false
                                ? 'text-decoration-line-through fw-light'
                                : null
                            }
                          >
                            {p.lastname} {p.firstname} {p.patronymic} {p.phone}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </td>
                <td
                  className={
                    item.published === false ? 'text-decoration-line-through fw-light' : null
                  }
                  style={{ textAlign: 'center' }}
                >
                  {' '}
                  {item.id}{' '}
                </td>
                <td
                  className={
                    item.published === false ? 'text-decoration-line-through fw-light' : null
                  }
                >
                  {item.street} {item.namestreet}, д.{item.house} , кв.
                  {item.apartment}
                </td>
                <td
                  className={
                    item.published === false ? 'text-decoration-line-through fw-light' : null
                  }
                >
                  {' '}
                  {item.phone}
                </td>
                <td
                  className={
                    item.published === false ? 'text-decoration-line-through fw-light' : null
                  }
                >
                  Баланс
                </td>
                <td
                  className={
                    item.published === false ? 'text-decoration-line-through fw-light' : null
                  }
                >
                  {' '}
                  Покупки руб.
                </td>
                <td
                  className={
                    item.published === false ? 'text-decoration-line-through fw-light' : null
                  }
                >
                  {' '}
                  {moment(item.createdAt).format('L')}{' '}
                </td>
                <td>
                  <Link to={'/user/patients/' + item.id}>
                    <span className="material-icons" style={{ color: 'green', fontSize: '28px' }}>
                      edit_note
                    </span>
                  </Link>
                </td>
                <td style={{ textAlign: 'end', width: 0 }}>
                  {item.published === false ? (
                    <span
                      className="material-icons-two-tone wrap-delete"
                      style={{ cursor: 'pointer', fontSize: '20px' }}
                      onClick={() => deletePatient(item)}
                    >
                      replay
                    </span>
                  ) : (
                    <span
                      className="font-icons material-icons wrap-delete"
                      style={{ color: 'red', cursor: 'pointer', fontSize: '20px' }}
                      onClick={() => deletePatient(item)}
                    >
                      delete
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="row">
        <div className="col">
          <Pagination
            className="my-3"
            count={count}
            page={page}
            siblingCount={1}
            boundaryCount={1}
            variant="outlined"
            shape="rounded"
            onChange={handlePageChange}
          />
        </div>
        <div className="col d-flex align-items-center m">
          <div className="">Показывать по:</div>
          {pageSizes.map((size) => (
            <div className="py-1 span-size" key={size} onClick={() => handlePageSizeChange(size)}>
              <span className="px-2">{size}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default PatientList;
