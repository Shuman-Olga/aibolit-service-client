import React, { useRef, useState, useEffect } from 'react';

import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import CheckButton from 'react-validation/build/button';
import Select from 'react-validation/build/select';

import PatientDataService from '../../services/PatientService';
import UserDataService from '../../services/UserService';
import PriceDataService from '../../services/PriceService';
import ContractDataService from '../../services/ContractService';
import DataService from '../../services/Service';
import InputMask from 'react-input-mask';

import Search from '../Search';
import { initialPatientState, initialParentState, initialContractState } from '../const/Initial';

const ModalAddContract = (props) => {
  const form = useRef();
  const checkBtn = useRef();

  const [message, setMessage] = useState('');
  const [successful, setSuccessful] = useState(false);

  const [doctors, setDoctors] = useState([]);
  const [prices, setPrices] = useState([]);
  const [regions, setRegions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [contract, setContract] = useState(initialContractState);
  const [patient, setPatient] = useState(initialPatientState);
  const [parent, setParent] = useState(initialParentState);

  const [showBtn, setShowBtn] = useState(false);
  const [showBlock, setShowBlock] = useState(false);

  useEffect(() => {
    if (props.currentContract.id) {
      setContract(props.currentContract);
      setPatient(props.currentContract.patient);
      if (props.currentContract.patient.parents.length) {
        setParent(props.currentContract.patient.parents[0]);
        setShowBtn(false);
      } else {
        setShowBtn(true);
      }
    }
    getDoctors();
    getPrices();
    getRegions();
  }, [props.currentContract]);

  //Get users-doctors, prices and regions from DB
  const getDoctors = () => {
    UserDataService.getAllDoctors()
      .then((response) => {
        setDoctors(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getPrices = () => {
    PriceDataService.findPrice()
      .then((response) => {
        setPrices(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getRegions = async () => {
    await DataService.getAllRegions()
      .then((response) => {
        setRegions(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  // Close modal window
  const handleClose = () => {
    props.handleClose();
    setMessage('');
    setSuccessful(false);
    setPatient(initialPatientState);
    setContract(initialContractState);
    setParent(initialParentState);
    setSearchResults([]);
    setShowBtn(false);
    setShowBlock(false);
  };
  //Change input form
  const onChangePatient = (e) => {
    const { name, value } = e.target;
    if (((name === 'lastname' && value) || (name === 'firstname' && value)) && !parent.id) {
      setShowBtn(true);
    }
    if (name === 'lastname' && value) {
      searchPatients(value);
    } else {
      setSearchResults([]);
    }
    setPatient({ ...patient, [name]: value });
  };
  const onChangeParent = (e) => {
    setShowBtn(false);
    const { name, value } = e.target;
    setParent({ ...parent, [name]: value });
  };
  const onChangeContract = (e) => {
    const { name, value } = e.target;
    setContract({ ...contract, [name]: value });
  };

  const clickHandler = () => {
    setShowBlock(true);
    setShowBtn(false);
  };
  //Search in DB Patient by value
  const searchPatients = (search) => {
    console.log(search.length);
    if (search.length >= 2) {
      PatientDataService.findByValue(search)
        .then((response) => {
          setSearchResults(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    if (search.length - 2 < 2) {
      setSearchResults([]);
    }
  };
  //Submit data form in DB
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setSuccessful(false);
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
      if (!props.currentContract.id) {
        ContractDataService.create(contract, patient, parent)
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
        ContractDataService.update(contract.id, contract, patient, parent)
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

  const handleShowEdit = (id) => {
    getCurrentItem(id);
    setSearchResults([]);
  };

  const getCurrentItem = (id) => {
    PatientDataService.get(id)
      .then((response) => {
        setPatient(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return !props.show ? null : (
    <div className="mymodal">
      <div className="mymodal-content">
        <div className="modal-header">
          <h4 className="modal-title"> ?????????? ??????????????</h4>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="??????????????"
            onClick={handleClose}
          ></button>
        </div>
        <div className="modal-body">
          <Form onSubmit={handleSubmit} ref={form}>
            {!successful && (
              <div>
                <div className="row mb-3">
                  <div className="col-sm-2">
                    <label className="form-label" htmlFor="date">
                      ???????? ????????????????????
                    </label>
                    <Input
                      className="form-control"
                      type="date"
                      id="datestart"
                      value={contract.datestart}
                      onChange={onChangeContract}
                      name="datestart"
                    />
                  </div>
                  <div className="col-sm-2">
                    <label className="form-label" htmlFor="date">
                      ???????? ??????????????????
                    </label>
                    <Input
                      className="form-control"
                      type="date"
                      id="dateend"
                      value={contract.dateend}
                      onChange={onChangeContract}
                      name="dateend"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-4">
                    <Input
                      autoComplete="off"
                      className="form-control"
                      name="lastname"
                      type="text"
                      placeholder="??????????????"
                      id="lastname"
                      value={patient.lastname}
                      onChange={onChangePatient}
                    />
                    <Search
                      handleShowEdit={handleShowEdit}
                      value={patient.lastname}
                      searchResults={searchResults}
                    />
                  </div>
                  <div className="col-sm-4">
                    <Input
                      autoComplete="off"
                      className="form-control"
                      type="text"
                      placeholder="??????"
                      id="firstname"
                      value={patient.firstname}
                      onChange={onChangePatient}
                      name="firstname"
                    />
                  </div>
                  <div className="col-sm-4">
                    <Input
                      className="form-control"
                      type="text"
                      placeholder="????????????????"
                      id="patronymic"
                      value={patient.patronymic}
                      onChange={onChangePatient}
                      name="patronymic"
                    />
                  </div>
                </div>
                {showBtn ? (
                  <div className="row mb-2">
                    <div className="col">
                      <button
                        id="btn-modal"
                        type="button"
                        className="btn btn-outline-info"
                        onClick={clickHandler}
                      >
                        <span className="material-icons">add</span>
                        ???????????????? ??????????????????????????
                      </button>
                    </div>
                  </div>
                ) : null}
                {showBlock || parent.id ? (
                  <div>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <Input
                          autoComplete="off"
                          className="form-control"
                          name="lastname"
                          type="text"
                          placeholder="??????????????"
                          id="lastname"
                          value={parent.lastname}
                          onChange={onChangeParent}
                        />
                      </div>
                      <div className="col-md-4">
                        <Input
                          autoComplete="off"
                          className="form-control"
                          type="text"
                          placeholder="??????"
                          id="firstname"
                          value={parent.firstname}
                          onChange={onChangeParent}
                          name="firstname"
                        />
                      </div>
                      <div className="col-md-4">
                        <Input
                          className="form-control"
                          type="text"
                          placeholder="????????????????"
                          id="patronymic"
                          value={parent.patronymic}
                          onChange={onChangeParent}
                          name="patronymic"
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
                <div className="row mb-2">
                  <div className="col-sm-3">
                    <label htmlFor="phone">??????????????</label>
                    <InputMask
                      id="phone"
                      mask="+7\(999)999-99-99"
                      maskChar="_"
                      name="phone"
                      value={patient.phone}
                      onChange={onChangePatient}
                    />
                    <label htmlFor="birthday" className="form-label mt-2">
                      ???????? ????????????????
                    </label>
                    <InputMask
                      className="col-sm-2 "
                      mask="99.99.9999"
                      maskChar="_"
                      id="birthday"
                      value={patient.birthday}
                      onChange={onChangePatient}
                      name="birthday"
                    />
                  </div>
                  <div className="col-sm-5">
                    <label htmlFor="description" className="form-label">
                      ??????????????
                    </label>
                    <textarea
                      className="form-control"
                      type="textarea"
                      id="description"
                      value={contract.description}
                      onChange={onChangeContract}
                      name="description"
                    />
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-md-2">
                    <label className="form-label" htmlFor="region">
                      ?????????????? ????
                    </label>
                    <Select
                      className="form-select"
                      id="region"
                      value={patient.regionId}
                      onChange={onChangePatient}
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
                  <div className="col-md-2 mb-2">
                    <label className="form-label" htmlFor="city">
                      ??????????
                    </label>
                    <Input
                      type="text"
                      className="form-control"
                      id="city"
                      name="city"
                      value={patient.city}
                      onChange={onChangePatient}
                    />
                  </div>
                  <div className="col-sm-2 mb-2">
                    <label className="form-label" htmlFor="district">
                      ??????????
                    </label>
                    <Input
                      type="text"
                      className="form-control"
                      id="district"
                      name="district"
                      value={patient.district}
                      onChange={onChangePatient}
                    />
                  </div>
                  <div className="col-sm-2">
                    <label className="form-label" htmlFor="locality">
                      ???????????????????? ??????????
                    </label>
                    <Input
                      type="text"
                      className="form-control"
                      id="locality"
                      name="locality"
                      value={patient.locality}
                      onChange={onChangePatient}
                    />
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-md-2">
                    <label className="form-label" htmlFor="street">
                      ??????????
                    </label>
                    <Input
                      type="text"
                      className=" form-control"
                      id="street"
                      name="street"
                      value={patient.street}
                      onChange={onChangePatient}
                    />
                  </div>
                  <div className="col-md-1">
                    <label className="form-label" htmlFor="house">
                      ??????
                    </label>
                    <Input
                      type="text"
                      className="form-control"
                      id="house"
                      name="house"
                      value={patient.house}
                      onChange={onChangePatient}
                    />
                  </div>
                  <div className="col-md-1">
                    <label className="form-label" htmlFor="apartment">
                      ????????????????
                    </label>
                    <Input
                      type="text"
                      className=" form-control"
                      id="apartment"
                      name="apartment"
                      value={patient.apartment}
                      onChange={onChangePatient}
                    />
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-md-4">
                    <label htmlFor="user" className="form-label">
                      ????????
                    </label>
                    <Select
                      className="form-select "
                      id="user"
                      value={contract.userId}
                      onChange={onChangeContract}
                      name="userId"
                    >
                      <option>????????????????...</option>
                      {doctors &&
                        doctors.map((doc) => (
                          <option value={doc.id} key={doc.id}>
                            {doc.lastname}
                          </option>
                        ))}
                    </Select>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-md-8">
                    <label htmlFor="price" className="form-label">
                      ??????????????????
                    </label>
                    <Select
                      className="form-select "
                      id="prices"
                      value={contract.priceId}
                      onChange={onChangeContract}
                      name="priceId"
                    >
                      <option>????????????????...</option>
                      {prices &&
                        prices.map((item) => (
                          <option value={item.id} key={item.id}>
                            {item.name} {item.price} ??????.
                          </option>
                        ))}
                    </Select>
                  </div>
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end me-3">
                  <button id="btn-modal-add" className="btn btn-success">
                    ??????????????????
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

export default ModalAddContract;
