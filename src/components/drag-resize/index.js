import React from 'react';
import Test from './testDrag-原生';
import DragResize from './test-drag-resize(react-rnd)';
import DraggableDemo from './test-drag-resize-based-on-react-draggable';

export default () => {
  return (
    <div>
      <Test />
      <DragResize />
      <DraggableDemo />
    </div>
  );
};
