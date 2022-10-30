import React, { useState, useEffect } from 'react';
import moment from 'moment';
import ModalAddCalling from './ModallAddCalling';
import CallingDataService from '../../services/CallingService';

const CallingsList = () => {
  const [searchDate, setSearchDate] = useState(moment().format('YYYY-MM-DD'));
  const [submitted, setSubmitted] = useState(false);
  const [show, setShow] = useState(false);
  const [callings, setCallings] = useState([]);

  const handleClose = () => {
    getCallings(searchDate);
    setShow(false);
  };

  const handleShow = () => setShow(true);

  useEffect(() => {
    getCallings(searchDate);
  }, [searchDate]);

  const getCallings = (value) => {
    CallingDataService.findByValue(value)
      .then((response) => {
        setCallings(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onChangeSearchDate = (e) => {
    const searchDate = e.target.value;
    setSearchDate(searchDate);
    setSubmitted(true);
    getCallings(searchDate);
  };

  const returnToday = () => {
    setSearchDate(moment().format('YYYY-MM-DD'));
    setSubmitted(false);
    getCallings(searchDate);
  };

  return (
    <div id="calling" className="container">
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
              Новый вызов
            </button>
          </div>
        </div>
      </div>
      <ModalAddCalling show={show} handleClose={handleClose} />
      <div className="d-flex align-items-start">
        <div className="card" style={{ width: '18rem', border: 0 }}>
          <div className="card-body">
            <h5 className="card-title">Дата</h5>
            <p className="card-text">
              <input
                className="form-control"
                type="date"
                id="date"
                value={searchDate}
                required
                onChange={onChangeSearchDate}
                name="date"
              />
            </p>
            {submitted ? (
              <button type="button" className="btn btn-outline-info" onClick={returnToday}>
                Сегодня
              </button>
            ) : null}
          </div>
        </div>
        <div className="tab-wrap">
          <table className="table table-hover table-responsive w-100 d-block d-md-table">
            <thead>
              <tr>
                <th scope="col">Ф.И.О</th>
                <th scope="col">Адрес</th>
                <th scope="col">Телефон</th>
                <th scope="col">Доктор</th>
                <th scope="col">Дата выезда</th>
                <th scope="col">Время выезда</th>
                <th scope="col">Стоимость</th>
              </tr>
            </thead>
            <tbody>
              {callings &&
                callings.map((calling) => (
                  <tr key={calling.id}>
                    <td>
                      {calling.patient.lastname} {calling.patient.firstname}{' '}
                      {calling.patient.patronomic}
                      {calling.patient.parents.length === 0 ? null : (
                        <div className="d-flex align-items-center" style={{ height: '50px' }}>
                          <div className="position-absolute d-flex">
                            <span className="material-icons ">subdirectory_arrow_right</span>
                            {calling.patient.parents.map((p) => (
                              <div key={p.id}>
                                {p.lastname} {p.firstname} {p.patronymic} {p.phone}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </td>
                    <td>
                      {calling.patient.street} {calling.patient.namestreet}, д.
                      {calling.patient.house}, кв.
                      {calling.patient.apartment}
                    </td>
                    <td> {calling.patient.phone}</td>
                    <td> {calling.user.lastname}</td>
                    <td> {moment(calling.datecall).format('L')}</td>
                    <td>
                      {calling.timestart} -{calling.timeend}
                    </td>
                    <td> {calling.price.price} руб.</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default CallingsList;
