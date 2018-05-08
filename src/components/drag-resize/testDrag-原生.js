import React from 'react';
import { Button } from 'antd';
// import '../../styles/user/userQuest.css';

/* eslint no-undef:0 */
class QuestComponent extends React.Component {
  state={
    cursor: 'pointer',
    isDragging: false, // 设置下是不是在drag状态
    top: 162,
    right: 2,
    left: 1300,
  };
  handleMouseEnter= () => {
    // debugger;
    this.setState({ cursor: 'move' });
  }
  handleMouseLeave= () => {
    this.setState({ cursor: 'pointer', isDragging: false });
  }
  handleMouseDown= (e) => {
    // this.refs.toggleWindow.style.color='red';
    this.setState({
      relativeX: e.pageX, // 当前鼠标位置到面板边界的距离
      relativeY: e.pageY,
      isDragging: true,
    });
  }
  handleMouseMove= (e) => {
    if (this.state.isDragging === true) {
      // debugger;
      // const maxX = window.innerWidth - this.refs.toggleWindow.clientWidth;
      // const maxY = window.innerHeight - this.refs.toggleWindow.clientHeight;
      const moveX = e.pageX - this.state.relativeX;
      const moveY = e.pageY - this.state.relativeY;
      let newTop = moveY + this.state.top;
      // var newLeft = moveX + this.state.left;
      let newRight = this.state.right - moveX;
      // let newRight = window.innerWidth - newLeft;
      newTop = Math.min(Math.max(0, newTop), maxX);
      newRight = Math.min(Math.max(0, newRight), maxY);
      this.setState({ top: newTop, right: newRight });
    } else {
      return false;
    }
  }
  handleMouseUp = (e) => {
    e.preventDefault();
    this.setState({
      isDragging: false,
    });
  }
  render() {
    return (
      <div
        // ref="toggleWindow"
        style={{ cursor: this.state.cursor, position: 'fixed', top: `${this.state.top}px`, right: `${this.state.right}px` }}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
      >
        <p>记得把32，33，56行解除注释才能正常运行！虽然还是有问题。主要是react要报错才注释的。后面好好研究原生的完美实现！</p>
        <Button type="primary">拖拽我</Button>
      </div>
    );
  }
}

export default QuestComponent;
