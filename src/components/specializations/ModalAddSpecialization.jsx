import React, { useState, useRef, useEffect } from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Textarea from 'react-validation/build/textarea';
import CheckButton from 'react-validation/build/button';
import SpecializationsDataService from '../../services/SpecializationService';
import { initialSpecialState } from '../const/Initial.js';
import { required } from '../validation/Validation';

const ModalAddPSpecialization = (props) => {
  const form = useRef();
  const checkBtn = useRef();
  const [data, setData] = useState(initialSpecialState);
  const [message, setMessage] = useState('');
  const [successful, setSuccessful] = useState(false);

  useEffect(() => {
    if (props.currentSpec.id) {
      setData(props.currentSpec);
    }
  }, [props.currentSpec]);

  const handleClose = () => {
    props.handleClose();
    setMessage('');
    setSuccessful(false);
    setData(initialSpecialState);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setSuccessful(false);
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
      if (!props.currentSpec.id) {
        SpecializationsDataService.create(data)
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
        SpecializationsDataService.update(data.id, data)
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
          <h4 className="modal-title"> Добавить специализацию</h4>
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
                <div className="col mb-3">
                  <label className="form-label" htmlFor="name">
                    Название специализации
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
                <div className="col mb-3">
                  <label className="form-label" htmlFor="description">
                    Описание
                  </label>
                  <Textarea
                    type="text"
                    className="form-control"
                    name="description"
                    value={data.description}
                    onChange={onChange}
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

export default ModalAddPSpecialization;
