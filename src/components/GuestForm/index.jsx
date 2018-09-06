import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';

const GuestForm = ({ handleSubmit }) => {
  const validate = (values) => {
    const errors = {};
    // formats
    if (!Number.isInteger(values.numberOfGuests)) {
      errors.numberOfGuests = 'We need at least one traveller!';
    }
    if (values.numberOfGuests <= 0) {
      errors.numberOfGuests = 'We need at least one traveller!';
    }
    // This is throwing warnings from momentjs but we don't really mind
    const normalizedArrival = moment(values.arrival);
    const normalizedDeparture = moment(values.departure);
    if (!normalizedArrival.isValid()) {
      errors.arrival = 'Invalid arrival date!';
    }
    if (!normalizedDeparture.isValid()) {
      errors.departure = 'Invalid arrival date!';
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
    result.numberOfGuests = values.numberOfGuests;
    result.arrival = moment(values.arrival);
    result.departure = moment(values.departure);
    result.formActions = {
      setSubmitting: formActions.setSubmitting,
      setErrors: formActions.setErrors,
    };
    handleSubmit(result);
  };
  const nextFriday = moment().isoWeekday(5).startOf('day').format('YYYY-MM-DD');
  const nextSunday = moment().isoWeekday(7).startOf('day').format('YYYY-MM-DD');

  return (
    <div>
      <h2>Get an estimate</h2>
      <Formik
        initialValues={{ arrival: nextFriday, departure: nextSunday, numberOfGuests: 1 }}
        validate={validate}
        onSubmit={doSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <div className="form-row">
              <div className="form-group col-md-4">
                <label htmlFor="arrival">Date of arrival</label>
                <Field type="text" className="form-control" name="arrival" id="arrival" placeholder="Date of arrival" />
                {errors.arrival && touched.arrival && <small className="text-danger">{errors.arrival}</small>}

              </div>
              <div className="form-group col-md-4">
                <label htmlFor="departure">Date of departure</label>
                <Field type="text" className="form-control" name="departure" id="departure" placeholder="Date of departure" />
                {errors.departure && touched.departure && <small className="text-danger">{errors.departure}</small>}
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="numberOfGuests">Number of guests</label>
                <Field type="number" className="form-control" name="numberOfGuests" id="numberOfGuests" placeholder="Number of guests" />
                {errors.numberOfGuests && touched.numberOfGuests && <small className="text-danger">{errors.numberOfGuests}</small>}
              </div>
            </div>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">Get estimates!</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

GuestForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default GuestForm;
