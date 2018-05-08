import React from 'react';
// import { Input } from 'antd';
import Rnd from 'react-rnd';

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'solid 1px #ddd',
  background: '#fff',
};

class QuestComponent extends React.Component {
  state={
    width: 200,
    height: 200,
    x: 0,
    y: 0,
  };
  render() {
    // const type = (value) => {
    //   console.log('=== value ', value);
    // };
    // <Input onChange={type} style={{ width: this.state.width,
    // height: this.state.height }} type="textarea" placeholder="please type in" />
    return (
      <div style={{ marginBottom: '20px' }}>
        <Rnd
          style={style}
          size={{ width: this.state.width, height: this.state.height }}
          position={{ x: this.state.x, y: this.state.y }}
          onDragStop={(e, d) => { this.setState({ x: d.x, y: d.y }); }}
          onResize={(e, direction, ref, delta, position) => {
            this.setState({
              width: ref.offsetWidth,
              height: ref.offsetHeight,
              ...position,
            });
          }}
        >
          react-rnd
        </Rnd>
      </div>
    );
  }
}

// export { QuestComponent };
export default QuestComponent;
