import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import CheckButton from 'react-validation/build/button';
import Select from 'react-validation/build/select';
import Accordion from 'react-bootstrap/Accordion';
import moment from 'moment';
import InputMask from 'react-input-mask';

import PatientDataService from '../../services/PatientService';
import DataService from '../../services/Service';
import ParentDataService from '../../services/ParentService';
import { initialPatientState } from '../const/Initial';
import { blooddata, kinshipdata } from '../const/constData';
import { required, vphone, vusername } from '../validation/Validation';
import Search from '../Search';

const Patient = (props) => {
  const initialParentState = {
    lastname: '',
    firstname: '',
    patronymic: '',
    parentnow: true,
    birthday: '',
    gender: null,
    kinship: '',
    kinshipdocument: '',
    phone: '',
    email: '',
    policy: '',
    medicalinsurancecompany: '',
    snils: '',
    inn: '',
    typedocId: 1,
    series: '',
    number: '',
    dateissued: '',
    whoissued: '',
    regionId: 70,
    city: '',
    district: '',
    locality: '',
    street: '',
    house: '',
    apartment: '',
    index: '',
    family: '',
    training: '',
    busyness: '',
    job: '',
    blood: '',
    published: true,
  };

  const { id } = useParams();
  let navigate = useNavigate();
  const form = useRef();
  const checkBtn = useRef();
  const [data, setData] = useState(initialPatientState);
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState('');
  const [regions, setRegions] = useState([]);
  const [typedocs, setTypeDocuments] = useState([]);
  const [parents, setParents] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    getRegions();
    getAllTypeDocuments();
  }, []);

  const getRegions = async () => {
    await DataService.getAllRegions()
      .then((response) => {
        setRegions(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getAllTypeDocuments = async () => {
    await DataService.getAllTypeDocuments()
      .then((response) => {
        setTypeDocuments(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    if (id) {
      getPatient(id);
    }
  }, [id]);

  const getPatient = async (id) => {
    await PatientDataService.get(id)
      .then((response) => {
        setData(response.data);
        setParents(response.data.parents);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
      if (!data.id) {
        PatientDataService.create(data, parents)
          .then((response) => {
            setMessage(response.data.message);
            setSuccessful(true);
            setTimeout(() => {
              navigate('/user/patients');
            }, 2000);
          })
          .catch((e) => {
            const resMessage =
              (e.response && e.response.data && e.response.data.message) ||
              e.message ||
              e.toString();
            console.log(e.response.data);
            setSearchResults(e.response.data);
            // setSuccessful(true);
            setMessage(resMessage);
          });
      } else {
        PatientDataService.update(data.id, data, parents)
          .then((response) => {
            setMessage(response.data.message);
            setSuccessful(true);
            navigate('/user/patients');
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

  const addParent = () => {
    if (parents.length) {
      parents.forEach((item) => {
        if (item.parentnow === true) {
          initialParentState.parentnow = false;
        }
      });
    }
    setParents([...parents, initialParentState]);
  };
  const onChangeParent = (index, e) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    if (name === 'parentnow' && value === true) {
      parents.forEach((item) => {
        item.parentnow = false;
      });
    }
    const list = [...parents];

    list[index][name] = value;

    setParents(list);
  };
  const refreshList = (id) => {
    getPatient(id);
  };
  const removeParent = async (index, parent) => {
    if (parent.id) {
      const data = {
        published: false,
      };
      await ParentDataService.update(parent.id, data)
        .then((response) => {
          refreshList(parent.id);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    let list = [...parents];
    list.splice(index, 1);
    setParents(list);
  };
  return (
    <div id="patientadd" className="container">
      <div className="edit-form">
        <div className=" row mb-3">
          <h5>
            Медицинская карта № {data.id} от дата {moment(data.createdAt).format('DD.MM.YYYY')}
          </h5>
        </div>
        <Form onSubmit={handleSubmit} ref={form}>
          {message && (
            <div className="form-group">
              <div
                className={successful ? 'alert alert-success' : 'alert alert-danger'}
                role="alert"
              >
                {message}
              </div>
              <Search searchResults={searchResults} handleShowEdit={getPatient} />
            </div>
          )}
          {!successful && (
            <div>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end ">
                <button id="btn-modal-add" className="btn btn-success">
                  Сохранить
                </button>
              </div>
              <Accordion defaultActiveKey={['0', '6']} alwaysOpen>
                <Accordion.Item eventKey="0" className="mt-3">
                  <Accordion.Header>Основные данные</Accordion.Header>
                  <Accordion.Body>
                    <div className="row mb-2 ">
                      <div className="col-md-4 mb-3">
                        <Input
                          type="text"
                          className="form-control"
                          id="lastname"
                          name="lastname"
                          placeholder="Фамилия"
                          value={data.lastname}
                          onChange={onChange}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <Input
                          type="text"
                          className="form-control"
                          id="firstname"
                          name="firstname"
                          placeholder="Имя"
                          value={data.firstname}
                          onChange={onChange}
                        />
                      </div>
                      <div className="col-md-3">
                        <Input
                          className="form-control ms-2"
                          type="text"
                          id="patronymic"
                          placeholder="Отчество"
                          value={data.patronymic}
                          onChange={onChange}
                          name="patronymic"
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label" htmlFor="birthday">
                        Дата рождения
                      </label>
                      <div className="col-sm-3">
                        <InputMask
                          mask="99.99.9999"
                          maskChar="_"
                          id="birthday"
                          value={data.birthday}
                          onChange={onChange}
                          name="birthday"
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label" htmlFor="gender">
                        Пол
                      </label>
                      <div className="col-sm-2 d-flex align-items-center">
                        <Input
                          className="me-2"
                          type="radio"
                          value="unspecified"
                          checked={data.gender === 'unspecified'}
                          onChange={onChange}
                          name="gender"
                        />{' '}
                        Не указан
                      </div>
                      <div className="col-sm-2 d-flex align-items-center">
                        <Input
                          className="me-2"
                          type="radio"
                          value="male"
                          checked={data.gender === 'male'}
                          onChange={onChange}
                          name="gender"
                        />{' '}
                        Мужской
                      </div>
                      <div className="col-sm-2 d-flex align-items-center">
                        <Input
                          className="me-2"
                          type="radio"
                          value="female"
                          checked={data.gender === 'female'}
                          onChange={onChange}
                          name="gender"
                        />{' '}
                        Женский
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label" htmlFor="description">
                        Примечание
                      </label>
                      <textarea
                        type="textarea"
                        className="col-md-8 col-form-control"
                        id="description"
                        value={data.description}
                        onChange={onChange}
                        name="description"
                      />
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                {parents.map((parent, index) => {
                  return (
                    <div key={index}>
                      <Accordion.Item eventKey="6" className="mt-3 bg-body rounded">
                        <Accordion.Header>Законный представитель</Accordion.Header>
                        <Accordion.Body>
                          <div className="position-relative">
                            <span
                              style={{ color: 'red', cursor: 'pointer' }}
                              className="material-icons position-absolute top-0 end-0"
                              onClick={() => removeParent(index, parent)}
                            >
                              close
                            </span>
                          </div>
                          <div className="col-md-4 mb-3 d-flex align-items-center">
                            <Input
                              className="form-check-input me-2"
                              type="checkbox"
                              checked={parent.parentnow}
                              onChange={(e) => onChangeParent(index, e)}
                              name="parentnow"
                            />{' '}
                            Текущий представитель
                          </div>
                          <div className="row mb-2 ">
                            <div className="col-md-4 mb-3">
                              <Input
                                type="text"
                                className="form-control"
                                id="lastname"
                                name="lastname"
                                placeholder="Фамилия"
                                value={parent.lastname}
                                onChange={(e) => onChangeParent(index, e)}
                              />
                            </div>
                            <div className="col-md-4 mb-3">
                              <Input
                                type="text"
                                className="form-control"
                                id="firstname"
                                name="firstname"
                                placeholder="Имя"
                                value={parent.firstname}
                                onChange={(e) => onChangeParent(index, e)}
                                validations={[required, vusername]}
                              />
                            </div>
                            <div className="col-md-3">
                              <Input
                                className="form-control ms-2"
                                type="text"
                                id="patronymic"
                                placeholder="Отчество"
                                value={parent.patronymic}
                                onChange={(e) => onChangeParent(index, e)}
                                name="patronymic"
                              />
                            </div>
                          </div>
                          <div className="row mb-3">
                            <label className="col-sm-2 col-form-label" htmlFor="phone">
                              Телефон
                            </label>
                            <div className="col-md-4">
                              <InputMask
                                id="phone"
                                mask="+7\(999)999-99-99"
                                maskChar="_"
                                name="phone"
                                value={parent.phone}
                                onChange={(e) => onChangeParent(index, e)}
                              />
                            </div>
                          </div>
                          <div className="row mb-3">
                            <label className="col-sm-2 col-form-label" htmlFor="birthday">
                              Дата рождения
                            </label>
                            <div className="col-sm-4">
                              <InputMask
                                mask="99.99.9999"
                                maskChar="_"
                                id="birthday"
                                value={parent.birthday}
                                onChange={(e) => onChangeParent(index, e)}
                                name="birthday"
                                placeholder="дд.мм.гггг"
                              />
                            </div>
                          </div>
                          <div className="row mb-3">
                            <label className="col-sm-2 col-form-label" htmlFor="gender">
                              Пол
                            </label>
                            <div className="col-sm-2 d-flex align-items-center">
                              <Input
                                className="me-2"
                                type="radio"
                                value="unspecified"
                                checked={parent.gender === 'unspecified'}
                                onChange={(e) => onChangeParent(index, e)}
                                name="gender"
                              />{' '}
                              Не указан
                            </div>
                            <div className="col-sm-2 d-flex align-items-center">
                              <Input
                                className="me-2"
                                type="radio"
                                value="male"
                                checked={parent.gender === 'male'}
                                onChange={(e) => onChangeParent(index, e)}
                                name="gender"
                              />{' '}
                              Мужской
                            </div>
                            <div className="col-sm-2 d-flex align-items-center">
                              <Input
                                className="me-2"
                                type="radio"
                                value="female"
                                checked={parent.gender === 'female'}
                                onChange={(e) => onChangeParent(index, e)}
                                name="gender"
                              />{' '}
                              Женский
                            </div>
                          </div>
                          <div className="row mb-3">
                            <label className="col-sm-2 col-form-label" htmlFor="kinship">
                              Отношение к пациенту
                            </label>
                            <div className="col-md-6">
                              <Select
                                className="form-select"
                                id="kinship"
                                value={parent.kinship}
                                onChange={(e) => onChangeParent(index, e)}
                                name="kinship"
                              >
                                <option>-все-</option>
                                {kinshipdata &&
                                  kinshipdata.map((item, index) => (
                                    <option key={index}>{item.name}</option>
                                  ))}
                              </Select>
                            </div>
                          </div>
                          <div className="row mb-3">
                            <label className="col-sm-2 col-form-label" htmlFor="kinshipdocument">
                              Документ на право предcтавлять пациента
                            </label>
                            <textarea
                              type="textarea"
                              className="col-md-8 col-form-control"
                              id="kinshipdocument"
                              value={parent.kinshipdocument}
                              onChange={(e) => onChangeParent(index, e)}
                              name="kinshipdocument"
                            />
                          </div>
                          <p>Удостоверение личности</p>
                          <div className="row mb-3">
                            <label className="col-sm-2 col-form-label" htmlFor="typedoc">
                              Тип документа{' '}
                            </label>
                            <div className="col-md-6">
                              <Select
                                className="form-select"
                                aria-label="Пример выбора по умолчанию"
                                id="typedoc"
                                value={parent.typedocId}
                                onChange={(e) => onChangeParent(index, e)}
                                name="typedocId"
                              >
                                {typedocs &&
                                  typedocs.map((item, index) => (
                                    <option value={item.id} key={index}>
                                      {item.name}
                                    </option>
                                  ))}
                              </Select>
                            </div>
                          </div>
                          <div className="row mb-3">
                            <label className="col-sm-2 col-form-label" htmlFor="series">
                              Серия
                            </label>
                            <div className="col-md-2">
                              <Input
                                type="text"
                                className="col-sm-5 form-control"
                                id="series"
                                name="series"
                                value={parent.series}
                                onChange={(e) => onChangeParent(index, e)}
                              />
                            </div>
                          </div>
                          <div className="row mb-3">
                            <label className="col-sm-2 col-form-label" htmlFor="number">
                              Номер
                            </label>
                            <div className="col-md-2">
                              <Input
                                type="text"
                                className="col-sm-5 form-control"
                                id="number"
                                name="number"
                                value={parent.number}
                                onChange={(e) => onChangeParent(index, e)}
                              />
                            </div>
                          </div>
                          <div className="row mb-3">
                            <label className="col-sm-2 col-form-label" htmlFor="dateissued">
                              Когда выдан
                            </label>
                            <div className="col-md-2">
                              <InputMask
                                mask="99.99.9999"
                                maskChar="_"
                                type="text"
                                className="col-sm-5 form-control"
                                id="dateissued"
                                name="dateissued"
                                value={parent.dateissued}
                                onChange={(e) => onChangeParent(index, e)}
                              />
                            </div>
                          </div>
                          <div className="row mb-3">
                            <label className="col-sm-2 col-form-label" htmlFor="whoissued">
                              Кем выдан
                            </label>
                            <div className="col-md-6">
                              <textarea
                                type="textarea"
                                className="col-sm-5 form-control"
                                id="whoissued"
                                name="whoissued"
                                value={parent.whoissued}
                                onChange={(e) => onChangeParent(index, e)}
                              />
                            </div>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </div>
                  );
                })}
                <div className="d-grid gap-2">
                  <button id="btn-card" type="button" className="d-flex p-3 " onClick={addParent}>
                    <span className="material-icons">add</span>
                    Добавить представителя
                  </button>
                </div>
                <Accordion.Item eventKey="1" className="mt-3">
                  <Accordion.Header>Контакты</Accordion.Header>
                  <Accordion.Body>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label" htmlFor="phone">
                        Телефон
                      </label>
                      <div className="col-md-4">
                        <InputMask
                          id="phone"
                          mask="+7\(999)999-99-99"
                          maskChar="_"
                          name="phone"
                          value={data.phone}
                          onChange={onChange}
                          validations={[required, vphone]}
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label" htmlFor="email">
                        Email
                      </label>
                      <div className="col-md-4">
                        <Input
                          type="email"
                          className="col-sm-5 form-control"
                          id="email"
                          name="email"
                          value={data.email}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2" className="mt-3">
                  <Accordion.Header>Документы</Accordion.Header>
                  <Accordion.Body>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label" htmlFor="policy">
                        Полис ОМС
                      </label>
                      <div className="col-md-4">
                        <Input
                          type="text"
                          className="form-control"
                          id="policy"
                          name="policy"
                          value={data.policy}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label" htmlFor="medicalinsurancecompany">
                        Мед. страховая организация
                      </label>
                      <div className="col-md-4">
                        <Input
                          type="text"
                          className="col-sm-5 form-control"
                          id="medicalinsurancecompany"
                          name="medicalinsurancecompany"
                          value={data.medicalinsurancecompany}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label" htmlFor="snils">
                        СНИЛС
                      </label>
                      <div className="col-md-4">
                        <InputMask
                          type="text"
                          className="col-sm-5 form-control"
                          mask="999-999-999 99"
                          maskChar="_"
                          id="snils"
                          name="snils"
                          value={data.snils}
                          onChange={onChange}
                          validations={[required, vphone]}
                        />
                      </div>
                    </div>
                    <p>Удостоверение личности</p>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label" htmlFor="typedoc">
                        Тип документа{' '}
                      </label>
                      <div className="col-md-6">
                        <Select
                          className="form-select"
                          id="typedoc"
                          value={data.typedocId}
                          onChange={onChange}
                          name="typedocId"
                        >
                          {typedocs &&
                            typedocs.map((item, index) => (
                              <option value={item.id} key={index}>
                                {item.name}
                              </option>
                            ))}
                        </Select>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label" htmlFor="series">
                        Серия
                      </label>
                      <div className="col-md-2">
                        <Input
                          type="text"
                          className="col-sm-5 form-control"
                          id="series"
                          name="series"
                          value={data.series}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label" htmlFor="number">
                        Номер
                      </label>
                      <div className="col-md-2">
                        <Input
                          type="text"
                          className="col-sm-5 form-control"
                          id="number"
                          name="number"
                          value={data.number}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label" htmlFor="dateissued">
                        Когда выдан
                      </label>
                      <div className="col-md-2">
                        <InputMask
                          mask="99.99.9999"
                          maskChar="_"
                          type="text"
                          className="col-sm-5 form-control"
                          id="dateissued"
                          name="dateissued"
                          value={data.dateissued}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label" htmlFor="whoissued">
                        Кем выдан
                      </label>
                      <div className="col-md-6">
                        <textarea
                          type="textarea"
                          className="col-sm-5 form-control"
                          id="whoissued"
                          name="whoissued"
                          value={data.whoissued}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3" className="mt-3">
                  <Accordion.Header>Адрес</Accordion.Header>
                  <Accordion.Body>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label" htmlFor="region">
                        Субьект РФ
                      </label>
                      <div className="col-md-4">
                        <Select
                          className="form-select"
                          id="region"
                          value={data.regionId}
                          onChange={onChange}
                          name="regionId"
                        >
                          {regions &&
                            regions.map((item, index) => (
                              <option value={item.id} key={index}>
                                {item.name}
                              </option>
                            ))}
                        </Select>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label" htmlFor="city">
                        Город
                      </label>
                      <div className="col-md-4">
                        <Input
                          type="text"
                          className="col-sm-5 form-control"
                          id="city"
                          name="city"
                          value={data.city}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label" htmlFor="district">
                        Район
                      </label>
                      <div className="col-md-4">
                        <Input
                          type="text"
                          className="col-sm-3 form-control"
                          id="district"
                          name="district"
                          value={data.district}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label" htmlFor="locality">
                        Населенный пункт
                      </label>
                      <div className="col-md-4">
                        <Input
                          type="text"
                          className="col-sm-3 form-control"
                          id="locality"
                          name="locality"
                          value={data.locality}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label" htmlFor="street">
                        Улица
                      </label>
                      <div className="col-md-4">
                        <Input
                          type="text"
                          className="col-sm-3 form-control"
                          id="street"
                          name="street"
                          value={data.street}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label" htmlFor="house">
                        Дом
                      </label>
                      <div className="col-md-2">
                        <Input
                          type="text"
                          className="col-sm-3 form-control"
                          id="house"
                          name="house"
                          value={data.house}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label" htmlFor="apartment">
                        Квартира
                      </label>
                      <div className="col-md-2">
                        <Input
                          type="text"
                          className="col-sm-3 form-control"
                          id="apartment"
                          name="apartment"
                          value={data.apartment}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label" htmlFor="index">
                        Индекс
                      </label>
                      <div className="col-md-2">
                        <Input
                          type="text"
                          className="col-sm-3 form-control"
                          id="index"
                          name="index"
                          value={data.index}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="4" className="mt-3">
                  <Accordion.Header>Личные данные</Accordion.Header>
                  <Accordion.Body>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label" htmlFor="school">
                        Школа, д\сад
                      </label>
                      <div className="col-md-2">
                        <Input
                          type="text"
                          className="col-sm-4 form-control"
                          id="school"
                          name="school"
                          value={data.school}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="5" className="mt-3">
                  <Accordion.Header>Анамнез</Accordion.Header>
                  <Accordion.Body>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label" htmlFor="disability">
                        Инвалидность
                      </label>
                      <div className="col-md-2">
                        <Input
                          type="text"
                          className="col-sm-3 form-control"
                          id="disability"
                          name="disability"
                          value={data.disability}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label" htmlFor="blood">
                        Группа крови
                      </label>
                      <div className="col-md-2">
                        <Select
                          className="form-select"
                          id="blood"
                          value={data.blood}
                          onChange={onChange}
                          name="blood"
                        >
                          <option>-все-</option>
                          {blooddata &&
                            blooddata.map((item, index) => (
                              <option key={index}>{item.name}</option>
                            ))}
                        </Select>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label" htmlFor="allergy">
                        Аллергические реакции
                      </label>
                      <textarea
                        type="textarea"
                        className="col-md-4 col-form-control"
                        id="allergy"
                        value={data.allergy}
                        onChange={onChange}
                        name="allergy"
                      />
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end me-3">
                <button id="btn-modal-add" className="btn btn-success">
                  Сохранить
                </button>
              </div>
            </div>
          )}

          <CheckButton style={{ display: 'none' }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  );
};
export default Patient;
