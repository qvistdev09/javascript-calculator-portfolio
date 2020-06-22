import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gridItemWidth: 4,
      gridItemHeight: 4,
      upperOutput: ' ',
      lowerOutput: '0',
    };
    this.calcbuttonPress = this.calcbuttonPress.bind(this);
  }

  calcbuttonPress(btn) {
    this.setState((state) => ({
      lowerOutput: state.lowerOutput + btn,
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
        <CalcButton label={'AC'} gridArea={'AC'} btnClass="AC" />
        <CalcButton label={'/'} btnClass="light" />
        <CalcButton label={'X'} btnClass="light" />
        <CalcButton label={'7'} btnClass="dark" press={this.calcbuttonPress} />
        <CalcButton label={'8'} btnClass="dark" />
        <CalcButton label={'9'} btnClass="dark" />
        <CalcButton label={'-'} btnClass="light" />
        <CalcButton label={'4'} btnClass="dark" />
        <CalcButton label={'5'} btnClass="dark" />
        <CalcButton label={'6'} btnClass="dark" />
        <CalcButton label={'+'} btnClass="light" />
        <CalcButton label={'1'} btnClass="dark" />
        <CalcButton label={'2'} btnClass="dark" />
        <CalcButton label={'3'} btnClass="dark" />
        <CalcButton label={'='} gridArea="equal" btnClass="equal" />
        <CalcButton label={'0'} gridArea="zero" btnClass="dark" />
        <CalcButton label={'.'} btnClass="dark" />
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
