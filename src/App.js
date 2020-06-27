import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gridItemWidth: 4,
      gridItemHeight: 4,
      upperOutput: ' ',
      lowerOutput: '0',
      decimals: false,
      upperLast: '',
      calcState: 'zero',
    };
    this.digitLimit = 24;
    this.warningBlock = false;
    this.isValid = this.isValid.bind(this);
    this.onCalcButtonPress = this.onCalcButtonPress.bind(this);
    this.categorizeInput = this.categorizeInput.bind(this);
    this.numberLimit = this.numberLimit.bind(this);
  }

  isValid(input, category) {
    if (input === 'AC') {
      return true;
    }

    switch (this.state.calcState) {
      case 'zero':
        if (
          category === 'digit' ||
          category === 'decimal' ||
          input === '-' ||
          category === 'equals'
        ) {
          return true;
        } else {
          return false;
        }
      case 'operator':
        if (
          category === 'digit' ||
          category === 'zero' ||
          category === 'operator' ||
          category === 'decimal'
        ) {
          return true;
        } else {
          return false;
        }
      case 'digit':
        if (
          category === 'digit' ||
          category === 'zero' ||
          category === 'operator'
        ) {
          return true;
        } else if (category === 'decimal' && this.state.decimals === false) {
          return true;
        } else if (category === 'equals') {
          return true;
        } else {
          return false;
        }
      case 'decimal':
        if (
          category === 'digit' ||
          category === 'zero' ||
          category === 'operator' ||
          category === 'equals'
        ) {
          return true;
        } else {
          return false;
        }
      case 'result':
        if (
          category === 'digit' ||
          category === 'operator' ||
          category === 'decimal'
        ) {
          return true;
        } else {
          return false;
        }
      default:
        return false;
    }
  }

  categorizeInput(input) {
    switch (input) {
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        return 'digit';
      case '0':
        return 'zero';
      case '.':
        return 'decimal';
      case '=':
        return 'equals';
      case '*':
      case '/':
      case '-':
      case '+':
        return 'operator';
      case 'AC':
        return 'AC';
      default:
        return 'unrecognized';
    }
  }

  onCalcButtonPress(btn) {
    if (this.warningBlock) {
      return;
    }

    const category = this.categorizeInput(btn);

    if (this.state.lowerOutput.length >= this.digitLimit) {
      if (
        category === 'digit' ||
        category === 'zero' ||
        category === 'decimal'
      ) {
        this.numberLimit();
        return;
      }
    }

    if (!this.isValid(btn, category)) {
      return;
    }

    switch (category) {
      case 'AC':
        this.setState({
          calcState: 'zero',
          upperLast: '',
          upperOutput: '',
          lowerOutput: '0',
          decimals: false,
        });
        break;
      case 'zero':
        if (this.state.calcState === 'operator') {
          this.setState((state) => ({
            calcState: 'zero',
            upperLast: '0',
            upperOutput: state.upperOutput + btn,
            lowerOutput: btn,
          }));
        } else {
          this.setState((state) => ({
            calcState: 'digit',
            upperLast: '0',
            upperOutput: state.upperOutput + '0',
            lowerOutput: state.lowerOutput + '0',
          }));
        }
        break;
      case 'digit':
        if (this.state.calcState === 'result') {
          this.setState({
            calcState: 'digit',
            upperLast: btn,
            upperOutput: btn,
            lowerOutput: btn,
            decimals: false,
          });
        } else if (this.state.calcState === 'zero') {
          this.setState((state) => ({
            calcState: 'digit',
            upperLast: btn,
            upperOutput:
              state.upperOutput.slice(0, state.upperOutput.length - 1) + btn,
            lowerOutput: btn,
          }));
        } else if (this.state.calcState === 'operator') {
          this.setState((state) => ({
            calcState: 'digit',
            upperLast: btn,
            upperOutput: state.upperOutput + btn,
            lowerOutput: btn,
          }));
        } else {
          this.setState((state) => ({
            calcState: 'digit',
            upperLast: btn,
            upperOutput: state.upperOutput + btn,
            lowerOutput: state.lowerOutput + btn,
          }));
        }
        break;
      case 'operator':
        if (this.state.calcState === 'result') {
          const savedResult = this.state.lowerOutput;
          this.setState({
            calcState: 'operator',
            upperLast: btn,
            upperOutput: savedResult + btn,
            lowerOutput: btn,
            decimals: false,
          });
        } else if (this.state.calcState === 'operator') {
          if (this.state.upperLast === btn) {
            return;
          } else if (this.state.upperLast !== '-' && btn === '-') {
            this.setState((state) => ({
              calcState: 'operator',
              upperLast: btn,
              upperOutput: state.upperOutput + btn,
              lowerOutput: btn,
              decimals: false,
            }));
          } else {
            if (
              /(\*|\/|\+|-)/.test(
                this.state.upperOutput[this.state.upperOutput.length - 2]
              )
            ) {
              this.setState((state) => ({
                calcState: 'operator',
                upperLast: btn,
                upperOutput:
                  state.upperOutput.slice(0, state.upperOutput.length - 2) +
                  btn,
                lowerOutput: btn,
                decimals: false,
              }));
            } else {
              this.setState((state) => ({
                calcState: 'operator',
                upperLast: btn,
                upperOutput:
                  state.upperOutput.slice(0, state.upperOutput.length - 1) +
                  btn,
                lowerOutput: btn,
                decimals: false,
              }));
            }
          }
        } else {
          this.setState((state) => ({
            calcState: 'operator',
            upperLast: btn,
            upperOutput: state.upperOutput + btn,
            lowerOutput: btn,
            decimals: false,
          }));
        }
        break;
      case 'equals':
        const calcResult =
          // eslint-disable-next-line
          Math.round(eval(this.state.upperOutput) * 10000000) / 10000000;
        this.setState((state) => ({
          calcState: 'result',
          upperLast: '',
          upperOutput: state.upperOutput + '=' + calcResult,
          lowerOutput: calcResult,
          decimals: false,
        }));
        break;
      case 'decimal':
        if (this.state.calcState === 'operator') {
          this.setState((state) => ({
            calcState: 'decimal',
            upperLast: '.',
            upperOutput: state.upperOutput + '0.',
            lowerOutput: '0.',
            decimals: true,
          }));
        } else if (this.state.calcState === 'result') {
          this.setState({
            calcState: 'decimal',
            upperLast: '.',
            upperOutput: '0.',
            lowerOutput: '0.',
            decimals: true,
          });
        } else if (this.state.calcState === 'zero') {
          if (this.state.upperOutput === '') {
            this.setState({
              calcState: 'decimal',
              upperLast: '.',
              upperOutput: '0.',
              lowerOutput: '0.',
              decimals: true,
            });
          } else {
            this.setState((state) => ({
              calcState: 'decimal',
              upperLast: '.',
              upperOutput: state.upperOutput + btn,
              lowerOutput: state.lowerOutput + btn,
              decimals: true,
            }));
          }
        } else {
          this.setState((state) => ({
            calcState: 'decimal',
            upperLast: '.',
            upperOutput: state.upperOutput + '.',
            lowerOutput: state.lowerOutput + '.',
            decimals: true,
          }));
        }
        break;
      default:
        return;
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
          press={this.onCalcButtonPress}
          id="clear"
        />
        <CalcButton
          label={'/'}
          btnClass="light hoverable"
          press={this.onCalcButtonPress}
          id="divide"
        />
        <CalcButton
          label={'*'}
          btnClass="light hoverable"
          press={this.onCalcButtonPress}
          id="multiply"
        />
        <CalcButton
          label={'7'}
          btnClass="dark hoverable"
          press={this.onCalcButtonPress}
          id="seven"
        />
        <CalcButton
          label={'8'}
          btnClass="dark hoverable"
          press={this.onCalcButtonPress}
          id="eight"
        />
        <CalcButton
          label={'9'}
          btnClass="dark hoverable"
          press={this.onCalcButtonPress}
          id="nine"
        />
        <CalcButton
          label={'-'}
          btnClass="light hoverable"
          press={this.onCalcButtonPress}
          id="subtract"
        />
        <CalcButton
          label={'4'}
          btnClass="dark hoverable"
          press={this.onCalcButtonPress}
          id="four"
        />
        <CalcButton
          label={'5'}
          btnClass="dark hoverable"
          press={this.onCalcButtonPress}
          id="five"
        />
        <CalcButton
          label={'6'}
          btnClass="dark hoverable"
          press={this.onCalcButtonPress}
          id="six"
        />
        <CalcButton
          label={'+'}
          btnClass="light hoverable"
          press={this.onCalcButtonPress}
          id="add"
        />
        <CalcButton
          label={'1'}
          btnClass="dark hoverable"
          press={this.onCalcButtonPress}
          id="one"
        />
        <CalcButton
          label={'2'}
          btnClass="dark hoverable"
          press={this.onCalcButtonPress}
          id="two"
        />
        <CalcButton
          label={'3'}
          btnClass="dark hoverable"
          press={this.onCalcButtonPress}
          id="three"
        />
        <CalcButton
          label={'='}
          gridArea="equal"
          btnClass="equal hoverable rounded-corner-right"
          press={this.onCalcButtonPress}
          id="equals"
        />
        <CalcButton
          label={'0'}
          gridArea="zero"
          btnClass="dark hoverable rounded-corner-left"
          press={this.onCalcButtonPress}
          id="zero"
        />
        <CalcButton
          label={'.'}
          btnClass="dark hoverable"
          press={this.onCalcButtonPress}
          id="decimal"
        />
      </div>
    );
  }
}

function CalcButton(props) {
  return (
    <button
      className={props.btnClass ? props.btnClass + ' calc-child' : 'calc-child'}
      style={
        props.gridArea ? { gridArea: props.gridArea } : { gridArea: 'initial' }
      }
      onClick={() => props.press(props.label)}
      id={props.id}
    >
      {props.label}
    </button>
  );
}

function OutputField(props) {
  return (
    <div className="calc-child output" style={{ gridArea: 'output' }}>
      <div className="output-row">{props.upper}</div>
      <div className="output-row" id="display">
        {props.lower}
      </div>
    </div>
  );
}

export default App;
