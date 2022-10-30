import React, { useState, useEffect } from 'react';

import PriceDataService from '../../services/PriceService';
import ModalAddPrice from './ModalAddPrice';
import AuthService from '../../services/authService';
import Pagination from '@mui/material/Pagination';

function PricesList() {
  const [prices, setPrices] = useState([]);
  const [currentPrice, setCurrentPrice] = useState([]);
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(false);
  // pagination
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const pageSizes = [10, 20, 50];

  useEffect(() => {
    getPrices();
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
    console.log(params);
    return params;
  };
  //получить список
  const getPrices = async () => {
    const params = getRequestParams(search, page, pageSize);
    const currentUser = AuthService.getCurrentUser();

    if (currentUser.role.name === 'admin' || 'director') {
      await PriceDataService.getAll(params)
        .then((response) => {
          const { price, totalPages } = response.data;
          setPrices(price);
          setCount(totalPages);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      await PriceDataService.findPrice(params)
        .then((response) => {
          const { price, totalPages } = response.data;
          setPrices(price);
          setCount(totalPages);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const refreshList = () => {
    getPrices();
  };
  //поиск по id
  const getCurrentPrice = async (id) => {
    await PriceDataService.get(id)
      .then((response) => {
        setCurrentPrice(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  // модальное окно (открыть . закрыт)
  const handleClose = () => {
    getPrices();
    setShow(false);
    setCurrentPrice([]);
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleShowEdit = (id) => {
    getCurrentPrice(id);
    setShow(true);
  };

  const onChangeSearchValue = (e) => {
    const search = e.target.value;
    setSearch(search);
  };
  // удаление (обнавление published)
  const deletePrice = async (price) => {
    const data = {
      published: price.published === true ? false : true,
    };
    await PriceDataService.update(price.id, data)
      .then((response) => {
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  // поиск по value
  const findByValue = async () => {
    setPage(1);
    getPrices();
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
    <div id="price" className="container">
      <div className="list row">
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
          <div className="col-md-6">
            <div className="btn-modal-wrap">
              <button
                id="btn-modal"
                type="button"
                className="btn btn-outline-primary"
                onClick={handleShow}
              >
                <span className="material-icons">add</span>
                Добавить услугу
              </button>
            </div>
          </div>
        </div>
        <ModalAddPrice currentPrice={currentPrice} show={show} handleClose={handleClose} />
        <div className="colums">
          <h4>Список услуг</h4>
          <table className="table table-hover">
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }} scope="col">
                  №
                </th>
                <th scope="col">Наименование</th>
                <th scope="col">Цена</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((item, index) => (
                <tr key={item.id}>
                  <td
                    style={{ textAlign: 'center' }}
                    className={
                      item.published === false ? ' text-decoration-line-through fw-light' : null
                    }
                  >
                    {item.id}
                  </td>
                  <td>
                    <div
                      className={
                        item.published === false ? 'text-decoration-line-through fw-light' : null
                      }
                      onClick={() => handleShowEdit(item.id)}
                    >
                      {item.name}
                    </div>
                  </td>
                  <td>
                    <p
                      className={
                        item.published === false ? 'text-decoration-line-through fw-light' : null
                      }
                    >
                      {item.price}
                    </p>
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
                        className=" material-icons-two-tone wrap-delete"
                        style={{ cursor: 'pointer', fontSize: '20px' }}
                        onClick={() => deletePrice(item)}
                      >
                        replay
                      </span>
                    ) : (
                      <span
                        className=" font-icons material-icons wrap-delete"
                        style={{ color: 'red', cursor: 'pointer', fontSize: '20px' }}
                        onClick={() => deletePrice(item)}
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
export default PricesList;
