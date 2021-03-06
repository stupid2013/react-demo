import dva from 'dva';
import createLoading from 'dva-loading';
import { useRouterHistory } from 'dva/router';
import { createHashHistory } from 'history';
import './index.css';

// 1. Initialize
const app = dva({
  ...createLoading(),
  history: useRouterHistory(createHashHistory)({ queryKey: false }),
  onError() { // global error handler
    // console.log('== error ', e);
  },
});

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/drag-resize'));
app.model(require('./models/cron-expressions'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
