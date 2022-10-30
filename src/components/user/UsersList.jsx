import React, { useState, useEffect } from 'react';

import UserDataService from '../../services/UserService';
import ModalAddUser from './ModalAddUser';
import AuthService from '../../services/authService';
import Pagination from '@mui/material/Pagination';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(false);
  // pagination
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const pageSizes = [10, 20, 50];

  // модальное окно (открыть . закрыт)
  const handleClose = () => {
    getUsers();
    setShow(false);
    setCurrentUser([]);
  };

  const handleShow = () => {
    setShow(true);
  };

  useEffect(() => {
    getUsers();
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
  //получить список
  const getUsers = async () => {
    const params = getRequestParams(search, page, pageSize);
    const currentUser = AuthService.getCurrentUser();

    if (currentUser.role.name === 'admin' || 'director') {
      await UserDataService.getAll(params)
        .then((response) => {
          const { users, totalPages } = response.data;
          setUsers(users);
          setCount(totalPages);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      await UserDataService.findUser(params)
        .then((response) => {
          const { users, totalPages } = response.data;
          setUsers(users);
          setCount(totalPages);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  const refreshList = () => {
    getUsers();
  };
  const onChangeSearchValue = (e) => {
    const search = e.target.value;
    setSearch(search);
  };

  const deleteUser = async (user) => {
    const data = {
      published: user.published === true ? false : true,
    };
    await UserDataService.updatePablished(user.id, data)
      .then((response) => {
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getCurrentUser = async (id) => {
    await UserDataService.get(id)
      .then((response) => {
        setCurrentUser(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleShowEdit = (id) => {
    getCurrentUser(id);
    setShow(true);
  };
  //  поиск по value
  const findByValue = async () => {
    setPage(1);
    getUsers();
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
    <div id="users" className="container">
      <div className="row ">
        <div className="col-md-6">
          <div className="input-group mb-5">
            <input
              type="text"
              className="form-control"
              placeholder="Найти"
              value={search}
              onChange={onChangeSearchValue}
              onKeyUp={findByValue}
            />
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" type="button" onClick={findByValue}>
                Найти
              </button>
            </div>
          </div>
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
                Новый сотрудник
              </button>
            </div>
          </div>
        </div>
        <ModalAddUser currentUser={currentUser} show={show} handleClose={handleClose} />
        <div className="colums">
          <h4>Список</h4>
          <table className="table table-hover">
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }} scope="col">
                  №
                </th>
                <th scope="col">ФИО</th>
                <th scope="col">Специализация</th>
                <th scope="col">День рождения</th>
                <th scope="col">Телефон</th>
              </tr>
            </thead>
            <tbody>
              {users &&
                users.map((user, index) => (
                  <tr key={user.id}>
                    <td
                      style={{ textAlign: 'center' }}
                      className={
                        user.published === false ? 'text-decoration-line-through fw-light' : null
                      }
                    >
                      {user.id}
                    </td>
                    <td>
                      <div
                        className={
                          user.published === false
                            ? 'link-click text-decoration-line-through fw-light'
                            : 'link-click'
                        }
                        onClick={() => handleShowEdit(user.id)}
                      >
                        {user.lastname} {user.firstname} {user.patronymic}
                      </div>
                    </td>
                    <td>
                      <p
                        className={
                          user.published === false ? 'text-decoration-line-through fw-light' : null
                        }
                      >
                        {user.specialization.name}
                      </p>
                    </td>
                    <td>
                      <p
                        className={
                          user.published === false ? 'text-decoration-line-through fw-light' : null
                        }
                      >
                        {user.birthday}
                      </p>
                    </td>
                    <td>
                      {' '}
                      <p
                        className={
                          user.published === false ? 'text-decoration-line-through fw-light' : null
                        }
                      >
                        {user.phone}
                      </p>
                    </td>
                    <td style={{ textAlign: 'end' }}>
                      <span
                        className="material-icons "
                        style={{ color: 'green', fontSize: '20px', cursor: 'pointer' }}
                        onClick={() => handleShowEdit(user.id)}
                      >
                        edit_note
                      </span>
                    </td>
                    <td>
                      {user.published === false ? (
                        <span
                          className=" material-icons-two-tone wrap-delete"
                          style={{ cursor: 'pointer', fontSize: '20px' }}
                          onClick={() => deleteUser(user)}
                        >
                          replay
                        </span>
                      ) : (
                        <>
                          {user.specialization.name === 'Директор' ? null : (
                            <span
                              className=" font-icons material-icons wrap-delete"
                              style={{ color: 'red', cursor: 'pointer', fontSize: '20px' }}
                              onClick={() => deleteUser(user)}
                            >
                              delete
                            </span>
                          )}
                        </>
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
};
export default UsersList;
