import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.operatorRegex = /(\*|\/|\+|-)/;
    this.state = {
      gridItemWidth: 4,
      gridItemHeight: 4,
      upperOutput: ' ',
      lowerOutput: '0',
      decimals: false,
      upperLast: '',
      showingResult: false,
    };
    this.onClearPress = this.onClearPress.bind(this);
    this.onDigitPress = this.onDigitPress.bind(this);
    this.onZeroPress = this.onZeroPress.bind(this);
    this.onEqualPress = this.onEqualPress.bind(this);
    this.onOperatorPress = this.onOperatorPress.bind(this);
    this.onDecimalPress = this.onDecimalPress.bind(this);
    this.addToState = this.addToState.bind(this);
  }

  onClearPress() {
    this.setState({
      upperOutput: '',
      lowerOutput: '0',
      decimals: false,
      upperLast: '',
      showingResult: false,
    });
  }

  onDigitPress(digit) {
    if (this.state.showingResult) {
      this.setState({
        showingResult: false,
        upperOutput: digit,
        lowerOutput: digit,
        upperLast: digit,
        decimals: false,
      });
    } else if (this.state.lowerOutput === '0') {
      this.setState({
        upperOutput: digit,
        lowerOutput: digit,
        upperLast: digit,
      });
    } else if (this.operatorRegex.test(this.state.upperLast)) {
      this.setState((state) => ({
        upperLast: digit,
        lowerOutput: digit,
        upperOutput: state.upperOutput + digit,
        decimals: false,
      }));
    } else {
      this.addToState('both', digit);
      this.setState({
        upperLast: digit,
      });
    }
  }

  onZeroPress() {
    if (this.state.showingResult) {
      this.setState({
        showingResult: false,
        decimals: false,
        upperLast: '',
        upperOutput: '',
        lowerOutput: '0',
      });
    } else if (this.state.lowerOutput === '0') {
      return;
    } else if (this.operatorRegex.test(this.state.upperLast)) {
      this.setState((state) => ({
        decimals: false,
        upperOutput: state.upperOutput + '0',
        lowerOutput: '0',
        upperLast: '0',
      }));
    } else {
      this.addToState('both', '0');
      this.setState({
        upperLast: '0',
      });
    }
  }

  onEqualPress() {
    if (
      this.state.showingResult === false &&
      /[0-9]+[+|\-|*|/][0-9]+/.test(this.state.upperOutput)
    ) {
      this.setState((state) => ({
        // eslint-disable-next-line
        lowerOutput: Math.round(eval(state.upperOutput) * 10000000) / 10000000,
        decimals: false,
        // eslint-disable-next-line
        upperOutput: state.upperOutput + '=' + Math.round(eval(state.upperOutput) * 10000000) / 10000000,
        showingResult: true,
      }));
    }
  }

  onOperatorPress(operator) {
    if (this.state.showingResult) {
      this.setState((state) => ({
        upperOutput: state.lowerOutput + operator,
        lowerOutput: operator,
        upperLast: operator,
        decimals: false,
        showingResult: false,
      }));
    } else if (this.state.upperLast === operator) {
      return;
    } else if (
      operator === '-' &&
      this.operatorRegex.test(this.state.upperLast) &&
      this.state.upperLast !== '-'
    ) {
      this.setState((state) => ({
        upperOutput: state.upperOutput + operator,
        lowerOutput: operator,
        upperLast: operator,
      }));
    } else if (
      this.operatorRegex.test(this.state.upperLast) &&
      this.operatorRegex.test(
        this.state.upperOutput[this.state.upperOutput.length - 2]
      ) !== true &&
      this.state.upperLast !== operator
    ) {
      this.setState((state) => ({
        lowerOutput: operator,
        upperOutput:
          state.upperOutput.slice(0, state.upperOutput.length - 1) + operator,
        upperLast: operator,
      }));
    } else if (this.state.lowerOutput === '0') {
      this.setState({
        upperOutput: '0' + operator,
        lowerOutput: operator,
        upperLast: operator,
      });
    } else if (/[0-9]/.test(this.state.upperLast)) {
      this.setState((state) => ({
        upperLast: operator,
        upperOutput: state.upperOutput + operator,
        lowerOutput: operator,
      }));
    }
  }

  onDecimalPress() {
    if (this.state.showingResult) {
      this.setState({
        upperLast: '.',
        upperOutput: '0.',
        lowerOutput: '0.',
        decimals: true,
        showingResult: false,
      });
    } else if (this.state.decimals === true) {
      return;
    } else {
      this.addToState('both', '.');
      this.setState({ decimals: true, upperLast: '.' });
    }
  }

  addToState(choice, input) {
    switch (choice) {
      case 'upper':
        this.setState((state) => ({
          upperOutput: state.upperOutput + input,
        }));
        break;
      case 'lower':
        this.setState((state) => ({
          lowerOutput: state.lowerOutput + input,
        }));
        break;
      case 'both':
        this.setState((state) => ({
          lowerOutput: state.lowerOutput + input,
          upperOutput: state.upperOutput + input,
        }));
        break;
      default:
        return;
    }
  }

  render() {
    return (
      <div
        id="calculator"
        style={{
          gridTemplateColumns: 'repeat(4, ' + this.state.gridItemWidth + 'rem)',
          gridTemplateRows: 'repeat(6, ' + this.state.gridItemHeight + 'rem)',
        }}
      >
        <OutputField
          upper={this.state.upperOutput}
          lower={this.state.lowerOutput}
        />
        <CalcButton
          label={'AC'}
          gridArea={'AC'}
          btnClass="AC hoverable"
          press={this.onClearPress}
        />
        <CalcButton
          label={'/'}
          btnClass="light hoverable"
          press={this.onOperatorPress}
        />
        <CalcButton
          label={'*'}
          btnClass="light hoverable"
          press={this.onOperatorPress}
        />
        <CalcButton
          label={'7'}
          btnClass="dark hoverable"
          press={this.onDigitPress}
        />
        <CalcButton
          label={'8'}
          btnClass="dark hoverable"
          press={this.onDigitPress}
        />
        <CalcButton
          label={'9'}
          btnClass="dark hoverable"
          press={this.onDigitPress}
        />
        <CalcButton
          label={'-'}
          btnClass="light hoverable"
          press={this.onOperatorPress}
        />
        <CalcButton
          label={'4'}
          btnClass="dark hoverable"
          press={this.onDigitPress}
        />
        <CalcButton
          label={'5'}
          btnClass="dark hoverable"
          press={this.onDigitPress}
        />
        <CalcButton
          label={'6'}
          btnClass="dark hoverable"
          press={this.onDigitPress}
        />
        <CalcButton
          label={'+'}
          btnClass="light hoverable"
          press={this.onOperatorPress}
        />
        <CalcButton
          label={'1'}
          btnClass="dark hoverable"
          press={this.onDigitPress}
        />
        <CalcButton
          label={'2'}
          btnClass="dark hoverable"
          press={this.onDigitPress}
        />
        <CalcButton
          label={'3'}
          btnClass="dark hoverable"
          press={this.onDigitPress}
        />
        <CalcButton
          label={'='}
          gridArea="equal"
          btnClass="equal hoverable rounded-corner-right"
          press={this.onEqualPress}
        />
        <CalcButton
          label={'0'}
          gridArea="zero"
          btnClass="dark hoverable rounded-corner-left"
          press={this.onZeroPress}
        />
        <CalcButton
          label={'.'}
          btnClass="dark hoverable"
          press={this.onDecimalPress}
        />
      </div>
    );
  }
}

function CalcButton(props) {
  return (
    <div
      className={props.btnClass ? props.btnClass + ' calc-child' : 'calc-child'}
      style={
        props.gridArea ? { gridArea: props.gridArea } : { gridArea: 'initial' }
      }
      onClick={() => props.press(props.label)}
    >
      {props.label}
    </div>
  );
}

function OutputField(props) {
  return (
    <div className="calc-child output" style={{ gridArea: 'output' }}>
      <div className="output-row">{props.upper}</div>
      <div className="outpot-row">{props.lower}</div>
    </div>
  );
}

export default App;
