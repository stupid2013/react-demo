import React from 'react';
import { Router, Route } from 'dva/router';
import IndexPage from './components/homepage';
import Cron from './routes/cron-expressions';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={IndexPage} />
      <Route path="/cron" component={Cron} />
    </Router>
  );
}

export default RouterConfig;
