import {ValidationError} from 'yup';

interface Errors {
  [key: string]: string;
}
// carrega qualquer item como string no Typescript

export default function getValidationErrors(err: ValidationError): Errors {
  const validationErrors: Errors = {};

  err.inner.forEach(error => {
    validationErrors[error.path] = error.message;
  });

  return validationErrors;
}