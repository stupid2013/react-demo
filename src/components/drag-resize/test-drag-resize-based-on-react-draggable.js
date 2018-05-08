import React from 'react';
import Draggable from 'react-draggable';
// import { Input } from 'antd';

/* eslint no-plusplus: 0 */
class QuestComponent extends React.Component {
  state = {
    activeDrags: 0,
    deltaPosition: {
      x: 0, y: 0,
    },
    controlledPosition: {
      x: -400, y: 200,
    },
  }
  onStart = () => {
    let { activeDrags } = this.state;
    this.setState({ activeDrags: ++activeDrags });
  }
  onStop = () => {
    let { activeDrags } = this.state;
    this.setState({ activeDrags: --activeDrags });
  }
  render() {
    const dragHandlers = { onStart: this.onStart, onStop: this.onStop };
    return (
      <Draggable {...dragHandlers}>
        <div style={{ width: '180px', height: '80px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
          can be dragged everywhere
        </div>
      </Draggable>
    );
  }
}

// export { QuestComponent };
export default QuestComponent;
