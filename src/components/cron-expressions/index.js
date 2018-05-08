import React from 'react';
import moment from 'moment';
import { Form, DatePicker, Button, Radio, Input, TimePicker } from 'antd';
import Modal from './modal';
import styles from './index.css';

const FormItem = Form.Item;
const { RangePicker, MonthPicker } = DatePicker;
const RadioGroup = Radio.Group;

export default Form.create()(({
  dispatch,
  intervalPeriod,
  unit,
  visible,
  showRange,
  form,
}) => {
  /* eslint no-console:0 */
  const disabledDate = current => current && current.valueOf() < Date.now();
  const { getFieldDecorator } = form;
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 3 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 3,
      },
    },
  };
  const radioChange = (e) => {
    if (e.target.value === 3) {
      dispatch({
        type: 'cron/stateWillUpdate',
        payload: {
          visible: true,
        },
      });
    }
    if (e.target.value === 1) {
      dispatch({
        type: 'cron/stateWillUpdate',
        payload: {
          showRange: false,
        },
      });
    } else {
      dispatch({
        type: 'cron/stateWillUpdate',
        payload: {
          showRange: true,
        },
      });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { startTime, time, date, repeat, startDa, startMon, endMon } = values;
        const cronArr = [];
        const hour = moment(time).hour();
        const minutes = moment(time).minutes();
        const seconds = moment(time).seconds();
        if (startTime) {
          const year = moment(startTime).year();
          const month = moment(startTime).month() + 1;
          const day = moment(startTime).date();
          cronArr.push(`${seconds} ${minutes} ${hour} ${day} ${month} ? ${year}`);
        }
        if (date) {
          const startYear = moment(date[0]).year();
          const endYear = moment(date[1]).year();
          const startMonth = moment(date[0]).month() + 1;
          const endMonth = moment(date[1]).month() + 1;
          const startDay = moment(date[0]).date();
          const endDay = moment(date[1]).date();
          const intervalYear = endYear - startYear; // 间隔年份
          const intervalMonth = endMonth - startMonth; // 间隔月份

          /**
           * intervalYear === 0 --> 同年
           * intervalMonth === 0 --> 同月
           * (repeat === 2 || (repeat === 3 && intervalPeriod === 1 && unit === '天')) --> 执行时间间隔为每天
           */
          if ((intervalYear === 0) && (intervalMonth === 0) && (repeat === 2 || (repeat === 3 && intervalPeriod === 1 && unit === '天'))) {
            cronArr.push(`${seconds} ${minutes} ${hour} ${startDay}-${endDay} ${startMonth} ? ${startYear}`);
          }
          /**
           * [if description]
           * @param  intervalYear === 0 --> 同年
           * @param intervalMonth !== 0 --> 不同月
           * @param (repeat === 2 || (repeat === 3 && repeatPeriod === '1天')) --> 执行时间间隔为每天
           * @return cronArr
           */
          if ((intervalYear === 0) && (intervalMonth !== 0) && (repeat === 2 || (repeat === 3 && intervalPeriod === 1 && unit === '天'))) {
            cronArr.push(`${seconds} ${minutes} ${hour} ${startDay}/1 ${startMonth} ? ${startYear}`); // 第一个月
            if (intervalMonth !== 1) {
              cronArr.push(`${seconds} ${minutes} ${hour} 1/1 ${startMonth + 1}-${endMonth - 1} ? ${startYear}`); // 中间月份
            }
            cronArr.push(`${seconds} ${minutes} ${hour} 1-${endDay} ${endMonth} ? ${startYear}`); // 最后一个月
          }

          /**
           * intervalYear !== 0 --> 不同年
           * (repeat === 2 || (repeat === 3 && repeatPeriod === '1天')) --> 执行时间间隔为每天
           */
          if ((intervalYear !== 0) && (repeat === 2 || (repeat === 3 && intervalPeriod === 1 && unit === '天'))) { // 同月份和不同月份情况相同
            cronArr.push(`${seconds} ${minutes} ${hour} ${startDay}/1 ${startMonth} ? ${startYear}`); // 第一年 第一个月
            cronArr.push(`${seconds} ${minutes} ${hour} 1/1 ${startMonth + 1}/1 ? ${startYear}`); // 第一年剩下的月份
            if (intervalYear !== 1) {
              cronArr.push(`${seconds} ${minutes} ${hour} 1/1 1/1 ? ${startYear + 1}-${endYear - 1}`); // 中间的年份
            }
            if (endMonth !== 1) { // 结束月份不为一月时才存在最后一年最后一月的前面几月这种情况
              cronArr.push(`${seconds} ${minutes} ${hour} 1/1 1-${endMonth - 1} ? ${endYear}`); // 最后一年的最后一个月的前面的月份
            }
            cronArr.push(`${seconds} ${minutes} ${hour} 1-${endDay} ${endMonth} ? ${endYear}`); // 最后一年的最后一个月
          }

          /**
           * intervalYear === 0 --> 同年
           * intervalMonth === 0 --> 同月
           * intervalPeriod !== 1 --> 间隔天数不为1
           * unit === 天 --> 天数
           * 同年同月间隔n天的cron表达式
           */
          if ((intervalYear === 0) && (intervalMonth === 0) && (intervalPeriod !== 1) && (unit === '天')) {
            cronArr.push(`${seconds} ${minutes} ${hour} ${startDay}-${endDay}/${intervalPeriod} ${startMonth} ? ${startYear}`);
          }

          /**
           * intervalYear === 0 --> 同年
           * intervalMonth !== 0 --> 不同月
           * intervalPeriod !== 1 --> 间隔天数不为1（间隔天数为一的情况与选择时间范围内的每天执行是一样的，已在前面合并）
           * unit === 天 --> 天数
           * 同年不同月间隔n天的cron表达式
           */
          if ((intervalYear === 0) && (intervalMonth !== 0) && (intervalPeriod !== 1) && (unit === '天')) {
            // 不管是相隔一个月还是多个月 初始第一个月的cron表达式都一样
            // 比如 6.8-8.10，那第一个月的就是： seconds minutes hours X 8/intervalPeriod 8
            cronArr.push(`${seconds} ${minutes} ${hour} ${startDay}/${intervalPeriod} ${startMonth} ? ${startYear}`); // 第一个月 从开始日开始每隔intervalPeriod天执行一次

            /**
             * 计算某一天到月底每隔n天后，最后一次距离月底剩余几天
             * 注意： 前面的第二个月的第一天零点 后面是开始日期+1的时间 --> 为了获取准确的天数（实践得出 = =）
             *
             * surplus1 --> 第一个月，最后一次执行时离月底还剩余多少天
             */
            const days1 = moment(new Date(`${startYear}-${startMonth + 1}-01 00:00:00`).toISOString()).diff(moment(new Date(`${startYear}-${startMonth}-${startDay + 1} 00:00:00`).toISOString()), 'days');
            const surplus1 = days1 % intervalPeriod;

            if (intervalMonth === 1) { // 相隔一个月 比如6-7月
              const start = intervalPeriod - surplus1;
              if (start < endDay) {
                cronArr.push(`${seconds} ${minutes} ${hour} ${start}-${endDay}/${intervalPeriod} ${endMonth} ? ${startYear}`); // 第二个月
              }
            } else {
              /**
               * 相隔多个月
               * initDate --> 循环开始时的第一个月的开始日期（即第二个月的第一次执行的日期）
               * initMonth --> 循环开始月份（第二个月）
               * 实例： 2018年6月8号到2018年9月18号的日和月部分的cron所有表达式如下所示
               *  8/3     6 剩余1天 因此7月第一次执行时间为2号
               *  2/3     7 剩余2天
               *  1/3     8 剩余0天
               *  3-18/3  9 结束
               * 综上：上一个月剩余的天数决定下个月的开始日期
               */
              let initDate = intervalPeriod - surplus1;
              let initMonth = startMonth + 1;
              for (let i = 1; i <= intervalMonth; i += 1) {
                const surplus = (moment(new Date(`${startYear}-${initMonth + 1}-01 00:00:00`).toISOString()).diff(moment(new Date(`${startYear}-${initMonth}-${initDate + 1} 00:00:00`).toISOString()), 'days')) % intervalPeriod;
                if (i === 1) { // 第二个月
                  cronArr.push(`${seconds} ${minutes} ${hour} ${intervalPeriod - surplus1}/${intervalPeriod} ${initMonth} ? ${startYear}`);
                } else if (i === intervalMonth) { // 最后一个月
                  if (initDate < endDay) {
                    cronArr.push(`${seconds} ${minutes} ${hour} ${initDate}-${endDay}/${intervalPeriod} ${endMonth} ? ${startYear}`);
                  }
                } else { // 中间月
                  cronArr.push(`${seconds} ${minutes} ${hour} ${initDate}/${intervalPeriod} ${initMonth} ? ${startYear}`);
                }
                initMonth += 1; // 月份+1
                initDate = intervalPeriod - surplus; // 更新下个月的开始日期
              }
            }
          }

          /**
           * intervalYear !== 0 不同年
           * intervalPeriod !== 1 --> 间隔天数不为1
           * unit === 天 --> 天数
           * surplus --> 每个月最后一次执行时间距离月底的时间
           * 不同年间隔n天的cron表达式
           */
          let special = 0; // 用于处理12月份时剩余天数，用于计算下一年第一个月的开始日期 放这儿是因为循环每次进入j时，会重置。。只有month为12时，才重置
          if ((intervalYear !== 0) && (intervalPeriod !== 1) && (unit === '天')) {
            let year = startYear; // 年份
            for (let i = 0; i <= intervalYear; i += 1) {
              let month = 0; // 月份
              let startDate = startDay; // 每个月开始的日期 初始值为第一个月开始的那天 即用户选择的第一天
              let surplusMonth = 0; // 剩余的月份
              if (i === 0) { // 第一年
                month = startMonth; // 月份
                surplusMonth = 12 - startMonth;
              } else if (i === intervalYear) { // 最后一年
                month = 1;
                surplusMonth = endMonth - 1; // 因为j从零开始
              } else {
                month = 1;
                surplusMonth = 11; // 因为j从零开始
              }
              for (let j = 0; j <= surplusMonth; j += 1) {
                if ((year === endYear) && (month === endMonth)) { // 如果是最后一年的最后一个月
                  if (startDate <= endDay) {
                    cronArr.push(`${seconds} ${minutes} ${hour} ${startDate}-${endDay}/${intervalPeriod} ${endMonth} ? ${endYear}`);
                  }
                } else {
                  let surplus = 0;
                  if (month === 12) {
                    surplus = (moment(new Date(`${year + 1}-01-01 00:00:00`).toISOString()).diff(moment(new Date(`${year}-${month}-${startDate + 1} 00:00:00`).toISOString()), 'days')) % intervalPeriod;
                    special = intervalPeriod - surplus;
                  } else if (month < 12) {
                    if (month === 1) {
                      surplus = (moment(new Date(`${year}-${month + 1}-01 00:00:00`).toISOString()).diff(moment(new Date(`${year}-${month}-${special + 1} 00:00:00`).toISOString()), 'days')) % intervalPeriod;
                    } else {
                      // console.log('=== start ', `${year}-${month}-${startDate + 1} 00:00:00`);
                      // console.log('=== end ', `${year}-${month + 1}-01 00:00:00`);
                      // console.log('\n');
                      surplus = (moment(new Date(`${year}-${month + 1}-01 00:00:00`).toISOString()).diff(moment(new Date(`${year}-${month}-${startDate + 1} 00:00:00`).toISOString()), 'days')) % intervalPeriod;
                    }
                  }
                  if (month === 1) { // 因为每一次i进来的时候 也就是i++的时候 startDate都被重置为startDay了。。。
                                    // 因此需要特殊处理，每次i进来的时候，月份一定为1，因此这么写判断条件 = =
                    cronArr.push(`${seconds} ${minutes} ${hour} ${special}/${intervalPeriod} ${month} ? ${year}`);
                  } else {
                    cronArr.push(`${seconds} ${minutes} ${hour} ${startDate}/${intervalPeriod} ${month} ? ${year}`);
                  }
                  month += 1;
                  startDate = intervalPeriod - surplus;
                }
              }
              year += 1;
            }
          }
        }
        /**
         * 间隔时间为月份时
         */
        if (unit === '月') {
          const startYear = moment(startMon).year();
          const endYear = moment(endMon).year();
          const startMonth = moment(startMon).month() + 1;
          const endMonth = moment(endMon).month() + 1;
          const intervalYear = endYear - startYear; // 间隔年份

          /**
           * intervalYear === 0 --> 不跨年
           *  intervalPeriod === 1 --> 每月执行
           */
          if (intervalYear === 0 && intervalPeriod === 1) {
            cronArr.push(`${seconds} ${minutes} ${hour} ${startDa} ${startMonth}-${endMonth} ? ${startYear}`);
          }

          /**
           * intervalYear !== 0 --> 跨年
           * intervalPeriod === 1 --> 每月执行
           */
          if (intervalYear !== 0 && intervalPeriod === 1) {
            let year = startYear;
            for (let i = 0; i <= intervalYear; i += 1) {
              if (i === 0) {
                cronArr.push(`${seconds} ${minutes} ${hour} ${startDa} ${startMonth}-12 ? ${startYear}`);
              } else if (i === intervalYear) {
                cronArr.push(`${seconds} ${minutes} ${hour} ${startDa} 1-${endMonth} ? ${endYear}`);
              } else {
                cronArr.push(`${seconds} ${minutes} ${hour} ${startDa} 1/1 ? ${year}`);
              }
              year += 1;
            }
          }

          /**
           * intervalYear === 0 --> 不跨年
           * intervalPeriod !== 1 --> 每intervalPeriod月执行
           */
          if (intervalYear === 0 && intervalPeriod !== 1) {
            cronArr.push(`${seconds} ${minutes} ${hour} ${startDa} ${startMonth}-${endMonth}/${intervalPeriod} ? ${startYear}`);
          }

          /**
           * intervalYear !== 0 --> 跨年
           * intervalPeriod !== 1 --> 每intervalPeriod月执行
           */
          if (intervalYear !== 0 && intervalPeriod !== 1) {
            let year = startYear;
            let month = startMonth; // 每一年的开始月份
            for (let i = 0; i <= intervalYear; i += 1) {
              let surplus = 0;
              if ((12 - month - intervalPeriod) > 0) {
                surplus = (12 - month) % intervalPeriod;
              } else {
                surplus = 12 - month;
              }
              if (month === 1 && intervalPeriod === 3) { // 开始月份为1月且间隔为3时，特殊情况
                surplus = 0;
              }
              if (i === 0) { // 第一年
                cronArr.push(`${seconds} ${minutes} ${hour} ${startDa} ${startMonth}-12/${intervalPeriod} ? ${startYear}`);
              } else if (i === intervalYear) { // 最后一年
                if (month <= endMonth) {
                  cronArr.push(`${seconds} ${minutes} ${hour} ${startDa} ${month}-${endMonth}/${intervalPeriod} ? ${endYear}`);
                }
              } else {
                cronArr.push(`${seconds} ${minutes} ${hour} ${startDa} ${month}/${intervalPeriod} ? ${year}`);
              }
              year += 1;
              month = intervalPeriod - surplus;
            }
          }
        }
        console.log('=== cronArr ', cronArr);
      }
    });
  };
  const onCancel = () => dispatch({
    type: 'cron/stateWillUpdate',
    payload: {
      newTask: false,
    },
  });
  return (
    <Form onSubmit={handleSubmit} className={styles.formWrapper}>
      <FormItem {...formItemLayout} label="重复设置">
        {getFieldDecorator('repeat', {
          initialValue: !showRange ? 1 : 0,
          rules: [{
            required: true, message: '请选择重复规则!',
          }],
        })(
          <RadioGroup onChange={radioChange}>
            <Radio value={1}>永不</Radio>
            <Radio value={2}>每天</Radio>
            <Radio value={3}>自定义时间{(intervalPeriod !== 0) && `(每${intervalPeriod}${unit})`}</Radio>
          </RadioGroup>,
        )}
      </FormItem>
      { !showRange && unit === '天' &&
        <FormItem {...formItemLayout} label="开始日期">
          {getFieldDecorator('startTime', {
            rules: [{
              required: true, message: '请选择开始日期！',
            }],
          })(
            <DatePicker disabledDate={disabledDate} style={{ width: '220px' }} />,
          )}
        </FormItem>
      }
      { showRange && unit !== '月' &&
        <FormItem {...formItemLayout} label="起止日期" >
          {getFieldDecorator('date', {
            rules: [{
              required: true, message: '请选择起止日期!',
            }],
          })(
            <RangePicker disabledDate={disabledDate} placeholder={['开始日期', '结束日期']} />,
          )}
        </FormItem>
      }
      {unit && (unit === '月') &&
        <FormItem {...formItemLayout} className={styles.monthRange} label="起止月份">
          <FormItem style={{ display: 'inline-block' }}>
            {getFieldDecorator('startMon', {
              rules: [
                {
                  required: true, message: '请选择开始月份',
                },
              ],
            })(
              <MonthPicker disabledDate={disabledDate} placeholder="开始月份" />,
            )}
          </FormItem> ~ <FormItem style={{ display: 'inline-block' }}>
            {getFieldDecorator('endMon', {
              rules: [
                {
                  required: true, message: '请选择结束月份',
                },
              ],
            })(
              <MonthPicker disabledDate={disabledDate} placeholder="结束月份" />,
            )}
          </FormItem>
        </FormItem>
      }
      {unit && (unit === '月') &&
        <FormItem {...formItemLayout} label="执行日期">
          {getFieldDecorator('startDa', {
            rules: [
              { required: true, message: '请输入执行日期' },
              { pattern: /^[1-9]$|^[1-2][0-9]$|^[3][0-1]$/, message: '请输入1-31的正整数' },
            ],
          })(
            <Input placeholder="执行日期" style={{ display: 'inline-block', width: '66px' }} />,
          )} 号开始每 {intervalPeriod}{unit} 执行一次
        </FormItem>
      }
      <FormItem {...formItemLayout} label="选择时间">
        {getFieldDecorator('time', {
          rules: [{
            required: true, message: '请选择执行时间!',
          }],
        })(
          <TimePicker />,
        )}
      </FormItem>
      <FormItem {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit" style={{ marginRight: '16px' }}>提交</Button>
        <Button type="default" onClick={onCancel}>取消</Button>
      </FormItem>
      {visible &&
        <Modal dispatch={dispatch} unit={unit} />
      }
    </Form>
  );
});
