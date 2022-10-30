import React, { useState, useEffect } from 'react';

import Form from 'react-validation/build/form';
import InputMask from 'react-input-mask';

import RoleDataService from '../../services/RoleService';
import SpecializationsDataService from '../../services/SpecializationService';
import UserDataService from '../../services/UserService';
import { initialPofileState, initialUserState } from '../const/Initial';

const ModalAddUser = (props) => {
  const [data, setData] = useState(initialUserState);
  const [profile, setProfile] = useState(initialPofileState);
  const [message, setMessage] = useState('');
  const [successful, setSuccessful] = useState(false);
  const [specializations, setSpecializations] = useState([]);
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState([]);
  //получить список прав доступа
  const getRolesList = () => {
    RoleDataService.getAll()
      .then((response) => {
        setRoles(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  //получить список должностей
  const getSpecializationsList = () => {
    SpecializationsDataService.findSpec()
      .then((response) => {
        setSpecializations(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getSpecializationsList();
    getRolesList();

    if (props.currentUser.id) {
      setData(props.currentUser);
      setProfile(!props.currentUser.profile ? initialPofileState : props.currentUser.profile);
    }
  }, [props.currentUser]);

  const handleClose = () => {
    props.handleClose();
    setMessage('');
    setSuccessful(false);
    setData(initialUserState);
    setProfile(initialPofileState);
    setPassword('');
  };

  const onChange = (e) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    setData({ ...data, [name]: value });
    if (data.accessToSystem === false) {
      generatePassword();
    }
  };

  const onChangeProfile = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };
  const generatePassword = () => {
    const randomPassword = Math.random()
      .toString(36)
      .slice(2, 2 + Math.max(1, Math.min(8, 10)));
    setPassword(randomPassword);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage('');
    setSuccessful(false);
    // form.current.validateAll();
    // if (checkBtn.current.context._errors.length === 0) {
    if (!props.currentUser.id) {
      UserDataService.create(data, profile)
        .then((response) => {
          setMessage(response.data.message);
          setSuccessful(true);
        })
        .catch((e) => {
          const resMessage =
            (e.response && e.response.data && e.response.data.message) || e.message || e.toString();
          setSuccessful(false);
          setMessage(resMessage);
        });
    } else {
      UserDataService.update(data.id, data, profile)
        .then((response) => {
          setMessage(response.data.message);
          setSuccessful(true);
        })
        .catch((e) => {
          const resMessage =
            (e.response && e.response.data && e.response.data.message) || e.message || e.toString();
          setSuccessful(false);
          setMessage(resMessage);
        });
    }
  };
  return !props.show ? null : (
    <div className="mymodal">
      <div className="mymodal-content">
        <div className="modal-header">
          <h4 className="modal-title mb-2"> Новый сотрудник</h4>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Закрыть"
            onClick={handleClose}
          ></button>
        </div>
        <div className="modal-body">
          <Form id="modal-form">
            {!successful && (
              <div>
                <div className="row mb-2 ">
                  <div className="col-md-4 mb-2">
                    <input
                      className="form-control"
                      name="lastname"
                      type="text"
                      id="lastname"
                      placeholder="Фамилия"
                      value={data.lastname}
                      onChange={onChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      className="form-control"
                      type="text"
                      id="firstname"
                      placeholder="Имя"
                      value={data.firstname}
                      onChange={onChange}
                      name="firstname"
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      className="form-control"
                      type="text"
                      id="patronymic"
                      placeholder="Отчество"
                      value={data.patronymic}
                      onChange={onChange}
                      name="patronymic"
                    />
                  </div>
                </div>
                <div className="d-flex p-2 mb-2">
                  <label className="form-check-label " htmlFor="showinschedule">
                    Показывать сотрудника в раписании
                  </label>
                  <input
                    type="checkbox"
                    id="showinschedule"
                    checked={data.showinschedule}
                    className="mycheckbox"
                    name="showinschedule"
                    onChange={onChange}
                  />
                </div>
                <div className="d-flex p-2 mb-2">
                  <label className="form-check-label " htmlFor="accessToSystem">
                    Разрешить доступ к ситеме
                  </label>
                  <input
                    type="checkbox"
                    id="accessToSystem"
                    checked={data.accessToSystem}
                    onChange={onChange}
                    className="mycheckbox"
                    name="accessToSystem"
                  />
                </div>
                {data.accessToSystem ? (
                  <div>
                    <div className="row mb-3">
                      <label className="col-sm-3 col-form-label" htmlFor="email">
                        Email
                      </label>
                      <div className="col-sm-5">
                        <input
                          type="text"
                          className="form-control"
                          name="email"
                          value={profile.email}
                          onChange={onChangeProfile}
                        />
                      </div>
                    </div>
                    {!props.currentUser.profile ? (
                      <div className="row mb-3">
                        <label className="col-sm-3 col-form-label" htmlFor="password">
                          Пароль
                        </label>
                        <div className="col-sm-5">
                          <input
                            className="form-control"
                            name="password"
                            value={(profile.password = password)}
                            onChange={onChangeProfile}
                            readOnly
                          />
                        </div>
                      </div>
                    ) : null}
                    <div className="row mb-3">
                      <label htmlFor="role" className="col-sm-3 col-form-label">
                        Права пользователя
                      </label>
                      <div className="col-sm-5">
                        <select
                          className="form-select "
                          id="role"
                          value={profile.roleId}
                          onChange={onChangeProfile}
                          name="roleId"
                          required
                        >
                          <option>Выбирите...</option>
                          {roles &&
                            roles.map((item) => (
                              <option value={item.id} key={item.id}>
                                {item.runame}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ) : null}
                <hr className="style" />
                <div className="row mb-3">
                  <label htmlFor="specialization" className="col-sm-4 col-form-label">
                    Специализация врача
                  </label>
                  <div className="col-sm-5">
                    <select
                      className="form-select "
                      id="specialization"
                      value={data.specializationId}
                      onChange={onChange}
                      name="specializationId"
                      required
                    >
                      <option>
                        {!props.currentUser.id
                          ? 'Выбирите...'
                          : props.currentUser.specializationId.name}
                      </option>
                      {specializations &&
                        specializations.map((item) => (
                          <option value={item.id} key={item.id}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-4 col-form-label" htmlFor="birthday">
                    Дата рождение
                  </label>
                  <div className="col-sm-4">
                    <InputMask
                      mask="99.99.9999"
                      maskChar="_"
                      id="birthday"
                      value={data.birthday}
                      onChange={onChange}
                      name="birthday"
                      placeholder="дд.мм.гггг"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-4 col-form-label" htmlFor="phone">
                    Телефон
                  </label>
                  <div className="col-sm-5">
                    <InputMask
                      className="form-control"
                      type="phone"
                      mask="+7\(999)999-99-99"
                      maskChar="_"
                      id="phone"
                      value={data.phone}
                      onChange={onChange}
                      name="phone"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-4 col-form-label" htmlFor="snils">
                    СНИЛС
                  </label>
                  <div className="col-sm-5 ">
                    <input
                      className="form-control"
                      name="snils"
                      type="text"
                      id="snils"
                      value={data.snils}
                      onChange={onChange}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-4 col-form-label" htmlFor="inn">
                    ИНН
                  </label>

                  <div className="col-sm-5">
                    <input
                      className="form-control"
                      type="text"
                      id="inn"
                      value={data.inn}
                      onChange={onChange}
                      name="inn"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-4 col-form-label" htmlFor="description">
                    Описание
                  </label>
                  <div className="col-sm-5">
                    <textarea
                      className="form-control"
                      type="textarea"
                      id="description"
                      value={data.description}
                      onChange={onChange}
                      name="description"
                    />
                  </div>
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end me-3">
                  <button
                    id="btn-modal-add"
                    className="btn btn-primary btn-block "
                    onClick={handleRegister}
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            )}
            {message && (
              <div className="form-group mt-2">
                <div
                  className={successful ? 'alert alert-success' : 'alert alert-danger'}
                  role="alert"
                >
                  {message}
                </div>
              </div>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ModalAddUser;
