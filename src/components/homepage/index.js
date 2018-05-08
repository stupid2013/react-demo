import React from 'react';
import { hashHistory } from 'react-router';
import styles from './index.css';

export default () => {
  return (
    <div className={styles.wrapper}>
      <h1><a onClick={() => hashHistory.push('/cron')}>cron表达式</a></h1>
      <h1><a onClick={() => hashHistory.push('/drag')}>drag-resize(拖拽)</a></h1>
    </div>
  );
};
