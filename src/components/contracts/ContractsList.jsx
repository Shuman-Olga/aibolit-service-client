import React, { useState, useEffect } from 'react';
import ContractDataService from '../../services/ContractService';
import AuthService from '../../services/authService';

import moment from 'moment';
import ModalAddContract from './ModallAddContract';
import Pagination from '@mui/material/Pagination';

const ContractsList = () => {
  const [contracts, setContracts] = useState([]);
  const [show, setShow] = useState(false);
  const [currentContract, setCurrentContract] = useState([]);
  const [search, setSearch] = useState('');
  // pagination
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const pageSizes = [10, 20, 50];

  useEffect(() => {
    getContracts();
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
    console.log(params);
    return params;
  };

  const onChangeSearchTitle = (e) => {
    const search = e.target.value;
    console.log(search);
    setSearch(search);
  };
  //получить список
  const getContracts = async () => {
    const params = getRequestParams(search, page, pageSize);
    const currentUser = AuthService.getCurrentUser();

    console.log(currentUser.role);
    if (currentUser.role.name === 'admin' || 'director') {
      await ContractDataService.getAll(params)
        .then((response) => {
          const { contracts, totalPages } = response.data;
          setContracts(contracts);
          setCount(totalPages);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  // поиск по value
  const findByValue = async () => {
    setPage(1);
    getContracts();
  };

  const getCurrentContract = async (id) => {
    await ContractDataService.get(id)
      .then((response) => {
        setCurrentContract(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleShowEdit = (id) => {
    getCurrentContract(id);
    setShow(true);
  };
  const handleShow = () => setShow(true);
  const handleClose = () => {
    getContracts();
    setShow(false);
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
    <div id="contract" className="container">
      {/* <div className="col-md-6">
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
      </div> */}
      <div className="colums">
        <div className="mb-5">
          <h4>Договоры на ведения программ</h4>
        </div>
        <div className="row">
          <div className="col-md-6 md-2">
            <div className="btn-modal-wrap">
              <button
                id="btn-modal"
                type="button"
                className="btn btn-outline-primary"
                onClick={handleShow}
              >
                <span className="material-icons">add</span>
                Новый договор
              </button>
            </div>
          </div>
        </div>
        <ModalAddContract currentContract={currentContract} show={show} handleClose={handleClose} />
        <table className="table table-hover">
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }} scope="col">
                №
              </th>
              <th scope="col">ФИО</th>
              <th scope="col">Адрес</th>
              <th scope="col">Телефон</th>
              <th scope="col">Покупки</th>
              <th scope="col">Врач</th>
              <th scope="col">Дата заключения</th>
              <th scope="col">Дата окончания</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((item, index) => (
              <tr key={index}>
                <td style={{ textAlign: 'center' }}> {index + 1}</td>
                <td>
                  {item.patient.lastname} {item.patient.firstname} {item.patient.patronymic}
                  {item.patient.parents.length === 0 ? null : (
                    <div className="d-flex align-items-center" style={{ height: '50px' }}>
                      <div className="position-absolute d-flex">
                        <span className="material-icons ">subdirectory_arrow_right</span>
                        {item.patient.parents.map((p) => (
                          <div key={p.id}>
                            {p.lastname} {p.firstname} {p.patronymic} {p.phone}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </td>
                <td>
                  {item.patient.street} {item.patient.namestreet}, д.{item.patient.house} , кв.
                  {item.patient.apartment}
                </td>
                <td> {item.patient.phone}</td>
                <td> Покупки руб.</td>
                <td> {item.user.lastname}</td>
                <td> {moment(item.datestart).format('L')} </td>
                <td> {moment(item.dateend).format('L')} </td>
                <td>
                  <span
                    className="material-icons"
                    style={{ color: 'green', fontSize: '28px' }}
                    onClick={() => handleShowEdit(item.id)}
                  >
                    edit_note
                  </span>
                </td>
                <td style={{ textAlign: 'end', width: 0 }}>
                  {/* {item.published === false ? (
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
                    </span> */}
                  {/* )} */}
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
export default ContractsList;
