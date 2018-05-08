import { connect } from 'dva';
import Cron from '../../components/cron-expressions';

export default connect((s) => {
  return {
    ...s.cron,
  };
})(Cron);
