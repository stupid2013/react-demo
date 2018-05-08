import React from 'react';
import { Router, Route } from 'dva/router';
import IndexPage from './components/homepage';
import Cron from './routes/cron-expressions';
import DragResize from './components/drag-resize';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={IndexPage} />
      <Route path="/cron" component={Cron} />
      <Route path="/drag" component={DragResize} />
    </Router>
  );
}

export default RouterConfig;
