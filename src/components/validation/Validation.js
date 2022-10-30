import { isEmail } from 'validator';

const required = (value) => {
  if (!value) {
    return (
      <div id="error" className="alert alert-danger" role="alert">
        Это поле обязательно для заполнения!
      </div>
    );
  }
};
const email = (value) => {
  if (!isEmail(value)) {
    return (
      <div id="error-email" className="alert alert-danger" role="alert">
        Это не верный email.
      </div>
    );
  }
};
const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div id="error-name" className="alert alert-danger" role="alert">
        Имя пользователя должно содержать от 3 до 20 символов.
      </div>
    );
  }
};
const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div id="error-password" className="alert alert-danger" role="alert">
        Пароль должен содержать от 6 до 40 символов.
      </div>
    );
  }
};
const vphone = (value) => {
  // eslint-disable-next-line no-useless-escape
  const pattern = new RegExp(/^[\d\+][\d\(\)\ -]{4,14}\d$/);
  if (!pattern.test(value)) {
    return (
      <div id="error-password" className="alert alert-danger" role="alert">
        Номер телефона введен правильно!
      </div>
    );
  }
};

export { required, email, vusername, vpassword, vphone };
