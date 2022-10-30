import React, { useState, useEffect } from 'react';

import SpecializationsDataService from '../../services/SpecializationService';
import ModalAddPSpecialization from './ModalAddSpecialization';
import AuthService from '../../services/authService';
import Pagination from '@mui/material/Pagination';

function SpecializationsList() {
  const [specializations, setSpecializations] = useState([]);
  const [currentSpec, setCurrentSpec] = useState([]);
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(false);
  // pagination
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const pageSizes = [10, 20, 50];

  useEffect(() => {
    getSpecializations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const onChangeSearchValue = (e) => {
    const search = e.target.value;
    setSearch(search);
  };

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

  const refreshList = () => {
    getSpecializations();
  };
  // модальное окно (открыть . закрыт)
  const handleClose = () => {
    getSpecializations();
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };
  // выбранный элемент
  const getCurrentSpec = async (id) => {
    await SpecializationsDataService.get(id)
      .then((response) => {
        setCurrentSpec(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  //поиск по id
  const handleShowEdit = (id) => {
    getCurrentSpec(id);
    setShow(true);
  };
  //получить список
  const getSpecializations = async () => {
    const params = getRequestParams(search, page, pageSize);
    const currentUser = AuthService.getCurrentUser();

    if (currentUser.role.name === 'admin' || 'director') {
      await SpecializationsDataService.getAll(params)
        .then((response) => {
          const { specializations, totalPages } = response.data;
          setSpecializations(specializations);
          setCount(totalPages);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      await SpecializationsDataService.findSpec(params)
        .then((response) => {
          const { specializations, totalPages } = response.data;
          setSpecializations(specializations);
          setCount(totalPages);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  // удаление (обнавление published)
  const deleteSpecialization = async (spec) => {
    const data = {
      published: spec.published === true ? false : true,
    };
    await SpecializationsDataService.update(spec.id, data)
      .then((response) => {
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  // поиск по value
  const findByValue = () => {
    setPage(1);
    getSpecializations();
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
    <div id="special" className="container">
      <div className="list row">
        <div className="col-md-6 ">
          <div className="input-group mb-5">
            <input
              type="text"
              className="form-control"
              value={search}
              onChange={onChangeSearchValue}
              onKeyUp={findByValue}
            />
            <div className="input-group-append ">
              <button className="btn btn-outline-secondary" type="button" onClick={findByValue}>
                Найти
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-7">
            <div className="btn-modal-wrap">
              <button
                id="btn-modal"
                type="button"
                className="btn btn-outline-primary"
                onClick={handleShow}
              >
                <span className="material-icons">add</span>
                Новая специализация
              </button>
            </div>
          </div>
        </div>
        <ModalAddPSpecialization currentSpec={currentSpec} show={show} handleClose={handleClose} />
        <div className="colums">
          <h4>Специализации</h4>
          <table className="table table-hover">
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }} scope="col">
                  №
                </th>
                <th scope="col">Название</th>
                <th scope="col">Описание</th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {specializations.map((item, index) => (
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
                  <td>
                    <div
                      className={
                        item.published === false
                          ? 'link-click text-decoration-line-through fw-light'
                          : null
                      }
                      onClick={() => handleShowEdit(item.id)}
                    >
                      {item.name}
                    </div>
                  </td>
                  <td>
                    {' '}
                    <p
                      className={
                        item.published === false ? 'text-decoration-line-through fw-light' : null
                      }
                    >
                      {item.description}
                    </p>{' '}
                  </td>

                  <td style={{ textAlign: 'end' }}>
                    <span
                      className="material-icons "
                      style={{ color: 'green', fontSize: '20px', cursor: 'pointer' }}
                      onClick={() => handleShowEdit(item.id)}
                    >
                      edit_note
                    </span>
                  </td>
                  <td style={{ textAlign: 'end', width: 0 }}>
                    {item.published === false ? (
                      <span
                        className="material-icons-two-tone wrap-delete"
                        style={{ cursor: 'pointer', fontSize: '20px' }}
                        onClick={() => deleteSpecialization(item)}
                      >
                        replay
                      </span>
                    ) : (
                      <span
                        className="font-icons material-icons wrap-delete"
                        style={{ color: 'red', cursor: 'pointer', fontSize: '20px' }}
                        onClick={() => deleteSpecialization(item)}
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
    </div>
  );
}
export default SpecializationsList;
