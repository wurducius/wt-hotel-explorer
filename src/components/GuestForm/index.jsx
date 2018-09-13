import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Formik, Form, Field, FieldArray,
} from 'formik';

const GuestAgeForm = ({
  push, remove, form,
}) => (
  <div>
    <h5>
Information about guests
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() => push('')}
      >
        Add another guest
      </button>
    </h5>
    {form.values.guestAges && form.values.guestAges.map((guestAge, index) => (
      /* eslint-disable-next-line react/no-array-index-key */
      <div key={`guestAges.${index}`} className="form-inline">
        <label htmlFor={`guestAges.${index}`}>
Age of guest #
          {index + 1}
        </label>
        <Field
          type="number"
          className="form-control"
          name={`guestAges.${index}`}
          id={`guestAges.${index}`}
          min="0"
        />
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={() => remove(index)}
        >
        -
        </button>
      </div>
    ))}
  </div>
);

GuestAgeForm.propTypes = {
  push: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  form: PropTypes.instanceOf(Object).isRequired,
};

const GuestForm = ({ handleSubmit, initialValues }) => {
  const validate = (values) => {
    const errors = {};
    // formats
    if (!values.guestAges || values.guestAges.length < 1) {
      errors.guestAges = 'We need information about at least one guest!';
    }
    if (values.guestAges.filter(x => Number.isInteger(x)).length < 1) {
      errors.guestAges = 'We need information about at least one guest!';
    }
    // This is throwing warnings from momentjs but we don't really mind
    const normalizedArrival = moment(values.arrival);
    const normalizedDeparture = moment(values.departure);
    if (!normalizedArrival.isValid()) {
      errors.arrival = 'Invalid arrival date!';
    }
    if (!normalizedDeparture.isValid()) {
      errors.departure = 'Invalid departure date!';
    }
    // arrival has to be before departure
    if (normalizedArrival.isValid()
        && normalizedDeparture.isValid()
        && normalizedArrival.isAfter(normalizedDeparture)) {
      errors.arrival = 'Arrival has to be before departure!';
    }
    return errors;
  };

  const doSubmit = (values, formActions) => {
    const result = {};
    result.guestAges = values.guestAges.map(x => parseInt(x, 10));
    result.arrival = moment(values.arrival).format('YYYY-MM-DD');
    result.departure = moment(values.departure).format('YYYY-MM-DD');
    result.formActions = {
      setSubmitting: formActions.setSubmitting,
      setErrors: formActions.setErrors,
    };
    handleSubmit(result);
  };
  return (
    <div>
      <h2 className="my-1 h3">Get an estimate</h2>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={doSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="mb-1">
            <div className="form-row mb-1">
              <div className="form-group col-md-6">
                <label htmlFor="arrival">Date of arrival</label>
                <Field type="text" className="form-control" name="arrival" id="arrival" placeholder="Date of arrival" />
                {errors.arrival && touched.arrival && <small className="text-danger">{errors.arrival}</small>}

              </div>
              <div className="form-group col-md-6">
                <label htmlFor="departure">Date of departure</label>
                <Field type="text" className="form-control" name="departure" id="departure" placeholder="Date of departure" />
                {errors.departure && touched.departure && <small className="text-danger">{errors.departure}</small>}
              </div>
            </div>
            <div className="form-row mb-1">
              <div className="form-group col-md-4">
                <FieldArray
                  name="guestAges"
                  component={GuestAgeForm}
                />
                {errors.guestAges && touched.guestAges && <small className="text-danger">{errors.guestAges}</small>}
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary">Get estimates!</button>

            <hr className="my-2" />
          </Form>
        )}
      </Formik>
    </div>
  );
};

const baseDate = moment().isoWeekday() <= 4 ? moment() : moment().isoWeekday(1).add(7, 'days');
const defaultArrival = moment(baseDate).isoWeekday(5).startOf('day').format('YYYY-MM-DD');
const defaultDeparture = moment(baseDate).isoWeekday(7).startOf('day').format('YYYY-MM-DD');

GuestForm.defaultProps = {
  initialValues: {
    arrival: defaultArrival,
    departure: defaultDeparture,
    guestAges: [''],
  },
};

GuestForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.instanceOf(Object),
};

export default GuestForm;
