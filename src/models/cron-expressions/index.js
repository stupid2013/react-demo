
export default {
  namespace: 'cron',
  state: {
    intervalPeriod: 0,
    unit: '天',
    visible: false,
    showRange: false,
  },
  reducers: {
    stateWillUpdate(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
  },
  subscriptions: {
  },
};
