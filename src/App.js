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
    };
    this.calcbuttonPress = this.calcbuttonPress.bind(this);
    this.setZero = this.setZero.bind(this);
    this.operatorPress = this.operatorPress.bind(this);
  }

  calcbuttonPress(btn) {
    if (btn !== '.') {
      this.setState((state) => {
        if (state.lowerOutput === '0') {
          return { lowerOutput: btn, upperOutput: btn };
        } else {
          return {
            lowerOutput: state.lowerOutput + btn,
            upperOutput: state.upperOutput + btn,
          };
        }
      });
    } else {
      this.setState((state) => {
        if (state.decimals === true) {
          return;
        }
        if (state.lowerOutput === '0') {
          return { lowerOutput: '0.', upperOutput: '0.', decimals: true };
        } else {
          return {
            lowerOutput: state.lowerOutput + btn,
            upperOutput: state.upperOutput + btn,
            decimals: true,
          };
        }
      });
    }
  }

  setZero() {
    this.setState({
      lowerOutput: '0',
      upperOutput: ' ',
      decimals: false
    });
  }

  operatorPress(operator) {
    this.setState((state) => ({
      upperOutput: state.upperOutput + operator,
      lowerOutput: operator
    }));
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
          btnClass="AC"
          press={this.setZero}
        />
        <CalcButton label={'/'} btnClass="light" press={this.operatorPress}/>
        <CalcButton label={'*'} btnClass="light" press={this.operatorPress}/>
        <CalcButton label={'7'} btnClass="dark" press={this.calcbuttonPress} />
        <CalcButton label={'8'} btnClass="dark" press={this.calcbuttonPress} />
        <CalcButton label={'9'} btnClass="dark" press={this.calcbuttonPress} />
        <CalcButton label={'-'} btnClass="light" press={this.operatorPress}/>
        <CalcButton label={'4'} btnClass="dark" press={this.calcbuttonPress} />
        <CalcButton label={'5'} btnClass="dark" press={this.calcbuttonPress} />
        <CalcButton label={'6'} btnClass="dark" press={this.calcbuttonPress} />
        <CalcButton label={'+'} btnClass="light" press={this.operatorPress}/>
        <CalcButton label={'1'} btnClass="dark" press={this.calcbuttonPress} />
        <CalcButton label={'2'} btnClass="dark" press={this.calcbuttonPress} />
        <CalcButton label={'3'} btnClass="dark" press={this.calcbuttonPress} />
        <CalcButton label={'='} gridArea="equal" btnClass="equal" />
        <CalcButton
          label={'0'}
          gridArea="zero"
          btnClass="dark"
          press={this.calcbuttonPress}
        />
        <CalcButton label={'.'} btnClass="dark" press={this.calcbuttonPress} />
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
      <div>{props.upper}</div>
      <div>{props.lower}</div>
    </div>
  );
}

export default App;
