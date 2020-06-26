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
    this.digitLimit = 24;
    this.warningBlock = false;
    this.onClearPress = this.onClearPress.bind(this);
    this.onDigitPress = this.onDigitPress.bind(this);
    this.onZeroPress = this.onZeroPress.bind(this);
    this.onEqualPress = this.onEqualPress.bind(this);
    this.onOperatorPress = this.onOperatorPress.bind(this);
    this.onDecimalPress = this.onDecimalPress.bind(this);
    this.numberLimit = this.numberLimit.bind(this);
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
    if (this.warningBlock) {
      return;
    }

    if (this.state.lowerOutput.length >= this.digitLimit) {
      this.numberLimit();
      return;
    }
    // if showing result, build new number
    else if (this.state.showingResult) {
      this.setState({
        showingResult: false,
        upperOutput: digit,
        lowerOutput: digit,
        upperLast: digit,
        decimals: false,
      });
      // if lower field is zero only, replace zero instead of adding onto it
    } else if (this.state.lowerOutput === '0') {
      this.setState((state) => ({
        upperOutput:
          state.upperOutput.slice(0, state.upperOutput.length - 1) + digit,
        lowerOutput: digit,
        upperLast: digit,
      }));
      // if lower field is math operator
    } else if (this.operatorRegex.test(this.state.upperLast)) {
      this.setState((state) => ({
        upperLast: digit,
        lowerOutput: digit,
        upperOutput: state.upperOutput + digit,
        decimals: false,
      }));
    } else {
      this.setState((state) => ({
        upperOutput: state.upperOutput + digit,
        lowerOutput: state.lowerOutput + digit,
        upperLast: digit,
      }));
    }
  }

  onZeroPress() {
    if (this.warningBlock) {
      return;
    }

    if (this.state.lowerOutput.length >= this.digitLimit) {
      this.numberLimit();
      return;
    }
    // if showing result, reset
    else if (this.state.showingResult) {
      this.setState({
        showingResult: false,
        decimals: false,
        upperLast: '',
        upperOutput: '',
        lowerOutput: '0',
      });
      // if lower field is single zero, do nothing
    } else if (this.state.lowerOutput === '0') {
      return;
      // if last input is math operator
    } else if (this.operatorRegex.test(this.state.upperLast)) {
      this.setState((state) => ({
        decimals: false,
        upperOutput: state.upperOutput + '0',
        lowerOutput: '0',
        upperLast: '0',
      }));
    } else {
      this.setState((state) => ({
        upperOutput: state.upperOutput + '0',
        lowerOutput: state.lowerOutput + '0',
        upperLast: '0',
      }));
    }
  }

  onEqualPress() {
    // only eval math string if it looks like an actual formula
    if (
      this.state.showingResult === false &&
      /[0-9]+[+|\-|*|/]+[0-9]+/.test(this.state.upperOutput)
    ) {
      this.setState((state) => ({
        // eslint-disable-next-line
        lowerOutput: Math.round(eval(state.upperOutput) * 10000000) / 10000000,
        decimals: false,
        upperOutput:
          state.upperOutput +
          '=' +
          // eslint-disable-next-line
          Math.round(eval(state.upperOutput) * 10000000) / 10000000,
        showingResult: true,
      }));
    }
  }

  onOperatorPress(operator) {
    // if showing result, build new formula with old result as first value
    if (this.state.showingResult) {
      this.setState((state) => ({
        upperOutput: state.lowerOutput + operator,
        lowerOutput: operator,
        upperLast: operator,
        decimals: false,
        showingResult: false,
      }));
      // if pressing same operator twice, do nothing
    } else if (this.state.upperLast === operator) {
      return;
      // if pressing minus and last input was operator but not minus, allow minus as second operator
    } else if (
      operator === '-' &&
      this.operatorRegex.test(this.state.upperLast) &&
      this.state.upperLast !== '-'
    ) {
      this.setState((state) => ({
        upperOutput: state.upperOutput + operator,
        lowerOutput: operator,
        upperLast: operator,
        decimals: false,
      }));
      // if pressing operator and last input was different operator, switch to new operator
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
        decimals: false,
      }));
    } else if (this.state.lowerOutput === '0') {
      this.setState({
        upperOutput: '0' + operator,
        lowerOutput: operator,
        upperLast: operator,
        decimals: false,
      });
    } else if (/[0-9]/.test(this.state.upperLast)) {
      this.setState((state) => ({
        upperLast: operator,
        upperOutput: state.upperOutput + operator,
        lowerOutput: operator,
        decimals: false,
      }));
    }
  }

  onDecimalPress() {
    if (this.warningBlock) {
      return;
    }

    if (this.state.lowerOutput.length >= this.digitLimit) {
      this.numberLimit();
      return;
    }
    // if showing result and pressing decimal, start new number with 0.
    else if (this.state.showingResult) {
      this.setState({
        upperLast: '.',
        upperOutput: '0.',
        lowerOutput: '0.',
        decimals: true,
        showingResult: false,
      });
      // do nothing if current number is already a decimal number
    } else if (this.state.decimals === true) {
      return;
      // if last input is operator and pressing decimal, start next number with 0.
    } else if (this.operatorRegex.test(this.state.upperLast)) {
      this.setState((state) => ({
        decimals: true,
        upperLast: '.',
        upperOutput: state.upperOutput + '0.',
        lowerOutput: '0.',
      }));
    } else if (this.state.lowerOutput === '0') {
      this.setState((state) => ({
        upperOutput: state.upperOutput + '0.',
        lowerOutput: '0.',
        decimals: true,
        upperLast: '.',
      }));
    } else {
      this.setState((state) => ({
        upperOutput: state.upperOutput + '.',
        lowerOutput: state.lowerOutput + '.',
        decimals: true,
        upperLast: '.',
      }));
    }
  }

  numberLimit() {
    if (this.warningBlock) {
      return;
    }

    this.warningBlock = true;
    const savedValue = this.state.lowerOutput;
    this.setState({
      lowerOutput: 'MAX DIGITS REACHED',
    });
    setTimeout(() => {
      this.setState({ lowerOutput: savedValue });
      this.warningBlock = false;
    }, 1000);
  }

  render() {
    return (
      <div
        id="calculator"
        style={{
          gridTemplateColumns: 'repeat(4, ' + this.state.gridItemWidth + 'rem)',
          gridTemplateRows:
            'minmax(4rem, max-content) repeat(5, ' +
            this.state.gridItemHeight +
            'rem)',
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
      <div className="output-row">{props.lower}</div>
    </div>
  );
}

export default App;
