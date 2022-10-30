import React, { useState, useRef, useEffect } from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import CheckButton from 'react-validation/build/button';
import PriceDataService from '../../services/PriceService';
import { initialPricetState } from '../const/Initial';
import { required } from '../validation/Validation';

const ModalAddPrice = (props) => {
  const form = useRef();
  const checkBtn = useRef();
  const [data, setData] = useState(initialPricetState);
  const [message, setMessage] = useState('');
  const [successful, setSuccessful] = useState(false);

  useEffect(() => {
    if (props.currentPrice.id) {
      setData(props.currentPrice);
    }
  }, [props.currentPrice]);

  const handleClose = () => {
    props.handleClose();
    setMessage('');
    setSuccessful(false);
    setData(initialPricetState);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  //Submit data form in DB
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setSuccessful(false);
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
      if (!props.currentPrice.id) {
        PriceDataService.create(data)
          .then((response) => {
            setMessage(response.data.message);
            setSuccessful(true);
          })
          .catch((e) => {
            const resMessage =
              (e.response && e.response.data && e.response.data.message) ||
              e.message ||
              e.toString();
            setSuccessful(false);
            setMessage(resMessage);
          });
      } else {
        PriceDataService.update(data.id, data)
          .then((response) => {
            setMessage(response.data.message);
            setSuccessful(true);
          })
          .catch((e) => {
            const resMessage =
              (e.response && e.response.data && e.response.data.message) ||
              e.message ||
              e.toString();
            setSuccessful(false);
            setMessage(resMessage);
          });
      }
    }
  };
  return !props.show ? null : (
    <div className="mymodal">
      <div className="mymodal-content">
        <div className="modal-header">
          <h4 className="modal-title"> Добавить услугу</h4>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Закрыть"
            onClick={handleClose}
          ></button>
        </div>
        <div className="modal-body">
          <Form onSubmit={handleSubmit} ref={form}>
            {!successful && (
              <div>
                <div className="col mb-3 position-relative">
                  <label className="form-label" htmlFor="name">
                    Название услуги
                  </label>
                  <Input
                    type="text"
                    className="form-control"
                    name="name"
                    value={data.name}
                    onChange={onChange}
                    validations={[required]}
                  />
                </div>
                <div className="col-md-5 mb-3">
                  <label className="form-label" htmlFor="price">
                    Стоимость
                  </label>
                  <Input
                    type="text"
                    className="form-control"
                    name="price"
                    value={data.price}
                    onChange={onChange}
                    validations={[required]}
                  />
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end me-3">
                  <button id="btn-modal-add" className="btn btn-primary btn-block ">
                    Сохранить
                  </button>
                </div>
              </div>
            )}
            {message && (
              <div className="form-group">
                <div
                  className={successful ? 'alert alert-success' : 'alert alert-danger'}
                  role="alert"
                >
                  {message}
                </div>
              </div>
            )}
            <CheckButton style={{ display: 'none' }} ref={checkBtn} />
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ModalAddPrice;
