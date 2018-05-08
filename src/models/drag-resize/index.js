
export default {
  namespace: 'drag',
  state: {
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
    // setup({ dispatch, history }) {
    //   return history.listen(({ pathname }) => {
    //     if (pathname === '/hubble/show') {
    //       dispatch({
    //         type: 'stateWillUpdate',
    //         payload: {
    //           showType: 'show',
    //         },
    //       });
    //     }
    //   });
    // },
  },
};
