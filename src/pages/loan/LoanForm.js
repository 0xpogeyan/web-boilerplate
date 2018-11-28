import React from 'react';
import { Prompt } from 'react-router';
import { Form, Field } from 'formik';
import PropTypes from 'prop-types';
import { FormField, FormDebug } from '@/components/Form';
import { loanTermOptions, frequencyOptions, loanTypeOptions } from './data';
import { frequencyPeriodMap } from './constant';

class LoanForm extends React.PureComponent {
  static propTypes = {
    formProps: PropTypes.object.isRequired,
  };

  calculateAmountTobePaid = ({ amount, interestRate, repaymentFrequency, loanTerm }) => {
    const period = frequencyPeriodMap[repaymentFrequency];
    const numberOfPeriod = +loanTerm * period;
    const numerator = +interestRate / numberOfPeriod;
    const denominator = 1 - Math.pow(numerator + 1, -numberOfPeriod); // eslint-disable-line
    const result = (numerator / denominator) * amount;
    return result.toFixed(2);
  };

  renderAmountTobePaid = (values, errors) => {
    const frequency = values.repaymentFrequency;
    const isValid = !Object.keys(errors).length;
    const amount = isValid
      ? this.calculateAmountTobePaid({
        amount: values.amount,
        interestRate: +values.interestRate / 100,
        repaymentFrequency: values.repaymentFrequency.value,
        loanTerm: values.loanTerm.value,
        frequencyPeriodMap,
      })
      : 0;
    return (
      <div className="AmountTobePaid">{`${frequency.label} amount to be paid: $ ${amount}`}</div>
    );
  };

  renderComponent = ({ formProps }) => {
    const { isSubmitting, dirty, values, errors, setFieldValue } = formProps;
    return (
      <Form>
        <h1 className="FormTitle">Loan Request</h1>
        <Field name="amount" label="Amount ($)" placeHolder={0} component={FormField} />
        <Field
          name="loanTerm"
          label="Loan Term"
          type="select"
          component={FormField}
          options={loanTermOptions}
        />
        <Field
          name="repaymentFrequency"
          label="Repayment Frequency"
          type="select"
          component={FormField}
          options={frequencyOptions(values)}
        />
        <Field
          name="loanType"
          label="Loan Type"
          type="select"
          onFieldChange={({ value }) => setFieldValue('interestRate', value)}
          component={FormField}
          options={loanTypeOptions}
        />
        <Field name="interestRate" label="Interest Rate (%)" component={FormField} disabled />
        {this.renderAmountTobePaid(values, errors)}
        <button className="Btn PrimaryBtn" type="submit" disabled={isSubmitting || !dirty}>
          {isSubmitting ? 'Loading...' : 'Create'}
        </button>
        <Prompt when={dirty} message="Are you sure you want to leave?" />
        <FormDebug props={formProps} />
      </Form>
    );
  };

  render() {
    return <div className="LoanForm">{this.renderComponent(this.props)}</div>;
  }
}

export default LoanForm;
