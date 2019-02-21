/**
 * Created by Ryn on 2016/8/7.
 * 日历组件
 */

import React,{Component} from 'react';
import H from './Helper';
import style from './style.less';
import {DatePicker,Icon} from 'antd';
import moment from 'moment';

const MonthPicker = DatePicker.MonthPicker;
class Calendar extends Component{

  /**
   * 组件初始化状态
   */
  state={
    row_number : 6,
    col_number : 7,
    current_year : H.getFullYear(),
    current_month : H.getMonth(),
    now_month: H.getMonth(),
    current_day : H.getDate(),
    select_year : H.getFullYear(),
    select_month : H.getMonth(),
    select_day : H.getDate(),
    history_year : undefined,
    history_month : undefined,
    history_day : undefined,
    date_num_array : [],
    first_day:'',
    monthList:[],
    showMonth:false,
    level:-1,
    approvalYear:moment(),
    open:false,
    month:moment(),
    date1:null,
    date2:null,
    };
   day = 0;
  /**
   * 给月份数组附上每月天数
   * @param year 年份
   * @private
   */
  _initMonthDayNumber(year) {
    let _date_array = [];

    for (let i = 0; i < 12; i++) {
      switch (i + 1) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
          _date_array.push(31);
          break;
        case 4:
        case 6:
        case 9:
        case 11:
          _date_array.push(30);
          break;
        case 2:
          if (H.isLeapYear(year)) {
            _date_array.push(29);
          } else {
            _date_array.push(28);
          }
          break;
        default:
          break;
      }
    }

    return _date_array;
  }

  /**
   * 组件将要挂载
   * 设置月份数组以及计算出每月的第一天星期几
   */
  componentWillMount() {
    let date_num_array = this._initMonthDayNumber(this.state.current_year),
      first_day = H.weekOfMonth();
    this.setState({date_num_array : date_num_array, first_day : first_day});
  }

  componentDidMount(){
    const {time} = this.props;
    if(time.length===1){
      this.setState({
        date1:moment(time[0]).format('YYYY-MM-DD'),
        select_month:moment(time[0]).format('M')-1,
        select_year:moment(time[0]).format('YYYY'),
        approvalYear:moment(time[0]),
        first_day:moment(time[0]).startOf('month').format('d'),
        month:moment(time[0]),
      });
    }else if(time.length===2){
      this.setState({
        date1:moment(time[0]).format('YYYY-MM-DD'),
        date2:moment(time[1]).format('YYYY-MM-DD'),
        select_month:moment(time[0]).format('M')-1,
        select_year:moment(time[0]).format('YYYY'),
        approvalYear:moment(time[0]),
        month:moment(time[0]),
        first_day:moment(time[0]).startOf('month').format('d'),
      });
    }
  };
  /**
   * 日期选择
   * @param s_day
   */
  selectDate(s_day) {
    let { select_year, select_month,date2,date1} = this.state;
    this.setState({
      history_year : select_year,
      history_month : select_month,
      history_day : s_day,
      select_day : s_day
    });
    this.day++;
    if(this.day>2){
      this.day=1;
      date2 = '';
    }
    if(this.day===1){
      date1=`${select_year}-${this.PrefixInteger(select_month+1)}-${this.PrefixInteger(s_day)}`;
      this.setState({
        date1,
        date2:''
      },);
    }else if(this.day===2){
      date2 = `${select_year}-${this.PrefixInteger(select_month+1)}-${this.PrefixInteger(s_day)}`;
      if(date1){
        if(moment(date2).isBefore(moment(date1))){
          [date1,date2] = [date2,date1];
        }
        this.setState({
          date1,
          date2,
        });
      }
    }
  };
  //加0
  PrefixInteger(num) {
    return (Array(2).join('0') + num).slice(-2);
  }
  getSortFun(order, sortBy) {
    let ordAlpah = (order == 'asc') ? '>' : '<';
    let sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
    return sortFun;
  }
  /****
   * 下拉选框中选择日期
   * ****/
  chooseMonth(val){
    let { current_year, current_month, current_day,
      select_year, select_month, select_day, date_num_array, first_day} = this.state;
    select_month = val.month-1;
    select_year = val.year;
    first_day = H.weekOfMonth(new Date(select_year, select_month));
    if (current_year === select_year &&
      current_month === select_month) {
      select_day = current_day;
    } else {
      select_day = undefined;
    }
    this.setState({
      select_year : select_year,
      select_month : select_month,
      select_day : select_day,
      date_num_array : date_num_array,
      first_day : first_day,
      showMonth:false,
      level:-1
    }, () => {
      this.props.onSelectMonth(select_year, select_month + 1);
    })
  }
  /***
   * 显示下拉选框
   * */
  showMonth(){
    const {current_month,select_month,current_year} = this.state;
    let date_list = [];
    let month = current_month+2;
    let year = current_year;
    for(let i=0;i<7;i++){
      const now = {};
      month--;
      if(month==0){
        year = year-1;
        month=12;
      }
      now.year = year;
      now.month = month;
      date_list.push(now);
    }
    date_list.map((value,i)=>{
      if(value.month == select_month+1){
        date_list.splice(i,1);
      }
      return value;
    });
    this.setState({
      showMonth:!this.state.showMonth,
      monthList:date_list,
      level:3
    });
  }
  /**
   * 关闭下拉选框
   * */
  closeList(){
    this.setState({
      showMonth:false,
      level:-1
    })
  }
  //改变年
  changeYear=(value)=>{
    const {month} = this.state;
    this.setState({
      approvalYear:moment(value),
      open:false,
      first_day:moment(`${moment(value).format('YYYY')}${moment(month).format('MM')}`,'YYYYMM').startOf('month').format('d'),
      select_year:moment(value).format('YYYY')-0
    });
  };
  decline=()=>{
    let {approvalYear,month} = this.state;
    approvalYear = moment(approvalYear).subtract(1,'year');
    this.setState({
      approvalYear:approvalYear,
      first_day:moment(`${moment(approvalYear).format('YYYY')}${moment(month).format('MM')}`,'YYYYMM').startOf('month').format('d'),
      select_year:approvalYear.format('YYYY')-0
    });
  };
  add=()=>{
    let {approvalYear,month} = this.state;
    approvalYear = moment(approvalYear).add(1,'year');
    this.setState({
      approvalYear:approvalYear,
      first_day:moment(`${moment(approvalYear).format('YYYY')}${moment(month).format('MM')}`,'YYYYMM').startOf('month').format('d'),
      select_year:approvalYear.format('YYYY')-0,
    });
  };
  beforeMonth=()=>{
    let {month,approvalYear} = this.state;
    if(month.format('M')==='1'){
      approvalYear = moment(approvalYear).subtract(1,'year');
    }
    month = moment(month).subtract(1,'month');
    this.setState({
      month,
      approvalYear,
      first_day:moment(`${moment(approvalYear).format('YYYY')}${moment(month).format('MM')}`,'YYYYMM').startOf('month').format('d'),
      select_month:month.format('M')-1,
      select_year:approvalYear.format('YYYY')-0,
    });
  };
  afterMonth=()=>{
    let {month,approvalYear} = this.state;
    if(month.format('M')==='12'){
      approvalYear = moment(approvalYear).add(1,'year');
    }
    month = moment(month).add(1,'month');
    this.setState({
      month,
      approvalYear,
      select_year:approvalYear.format('YYYY')-0,
      first_day:moment(`${moment(approvalYear).format('YYYY')}${moment(month).format('MM')}`,'YYYYMM').startOf('month').format('d'),
      select_month:month.format('M')-1,
    });
  };
  openPicker=(open)=>{
    this.setState({
      open
    });
  };
  //获取当前时间
  getTime=(back)=>{
    if(back){
      this.props.hide();
    }else{
      let {date1,date2} = this.state;
      let time = [];
      if(date1&&date2){
        time = [date1,date2];
      }else if(date1&&!date2){
        time = [date1];
      }
      this.props.setTime(time);
    }

  };

  /**
   * 渲染页面
   * @returns {XML}
   */
  render() {
    let { tags} = this.props;
    let {row_number, col_number,  current_year, current_month, current_day,
      select_year, select_month, select_day,
      history_year, history_month, history_day,
      date_num_array, first_day,showMonth,monthList,level,open,approvalYear,month,date1,date2} = this.state;

    let month_day = date_num_array[select_month],
      n_day = row_number * col_number - first_day - month_day,
      previous_month_days = undefined,
      previous_days = [],
      current_days = [],
      next_days = [],
      total_days = [],
      previous_month = undefined;

    if (select_month === 0) {
      previous_month = 11;
    } else {
      previous_month = select_month - 1;
    }

    //本月中，之前月份的日期变灰
    previous_month_days = date_num_array[previous_month];
    for (let i = 0; i < first_day; i++) {
      let previous_link = (<li className={style['item-gray']} key={'previous'+i}>
        <a href="javascript:;">{previous_month_days - (first_day - i) + 1}</a>
      </li>);
      previous_days.push(previous_link);
    }


    let currentClassName = '',
      currentText = '',downText='';
    for (let i = 0; i < month_day; i++) {
      // 今天样式
      /*if (current_year === select_year && current_month === select_month && current_day === (i + 1)) {
        currentClassName = `${style['item-current']}`;
        currentText = '今天';
        downText = '';
      } else {


      }*/
      currentText = i + 1;
      // 判断选择样式与历史样式是否相等，相等激活
      if ((date1||date2)&&((`${select_year}-${this.PrefixInteger(select_month+1)}-${this.PrefixInteger(i + 1)}`===date1)||(`${select_year}-${this.PrefixInteger(select_month+1)}-${this.PrefixInteger(i + 1)}`===date2))) {
        currentClassName = `${style['item-active']}`;
        if(`${select_year}-${this.PrefixInteger(select_month+1)}-${this.PrefixInteger(i + 1)}`===date1){
          downText = '开始';
        }else if(`${select_year}-${this.PrefixInteger(select_month+1)}-${this.PrefixInteger(i + 1)}`===date2){
          downText = '结束';
        }
      } else if(moment(`${select_year}-${this.PrefixInteger(select_month+1)}-${this.PrefixInteger(i + 1)}`).isBetween(moment(date1),moment(date2))){
        currentClassName = `${style['item-between']}`;
        downText = '';
      }else{
        currentClassName = '';
        downText = '';
      }
      /**
       * 添加tag样式
       * ***/
     /* if (tags.length > 0) {
        for (let j = 0; j < tags.length; j++) {
          if ((i + 1) === tags[j].day && select_month === tags[j].month-1) {
            currentClassName = `${currentClassName} ${style['item-tag']}`;
            break;
          }
        }
      }*/
      /***
       * 给本月日期增加点击事件
       * ***/
      let current_link = (<li className={`${currentClassName}`} key={'current'+i}>
        <a href="javascript:;" onClick={this.selectDate.bind(this, i + 1)}>
          {currentText}
          <span>{downText}</span>
        </a>
      </li>);
      current_days.push(current_link);
    }

    /**
     * 本月中，之后月份的日期变灰
     */
    for (let i = 0; i < n_day; i++) {
      let next_link = (<li className={style['item-gray']} key={'next'+i}>
        <a href="javascript:;">{i + 1}</a>
      </li>);
      next_days.push(next_link);
    }

    total_days = previous_days.concat(current_days, next_days);

    /***
     * 一个月份的日期展示
     * **/
    let ul_list = [];
    if (total_days.length > 0) {
      for (let i = 0; i < row_number; i++) {
        let li_list = [],
          start_index = i * col_number,
          end_index = (i + 1) * col_number;
        for (let j = start_index; j < end_index; j++) {
          li_list.push(total_days[j]);
        }
        ul_list.push(li_list);
      }
    }
    return (
      <div className={style.calendar}>
       {/* <div className={style.fullpage} onClick={this.closeList.bind(this)} style={{zIndex:level}} />*/}
        {/*<div className={style.box}><div className={style['calendar-header']}>
          <p onClick={this.showMonth.bind(this)}> <span> {select_month + 1} 月</span>
          </p>
          {
            showMonth &&
            <ul>
              {
                monthList.map((value, index) => {
                  return (<li key={'li'+index} onClick={this.chooseMonth.bind(this,value)}>{`${value.month} 月`}</li>);
                })
              }
            </ul>}
        </div></div>*/}
        <div className={style.yearPicker}>
          <div className={style.header}>
            <Icon type={'left'}  className={style.left} onClick={this.decline}/>
            <Icon type={'right'}  className={style.right} onClick={this.add}/>
            <DatePicker
              format={'YYYY年'}
              mode={'year'}
              onOpenChange={this.openPicker}
              onPanelChange={this.changeYear}
              open={open}
              allowClear={false}
              value={approvalYear}
            />
          </div>
        </div>
        <div className={style.monthPicker}>
          <div className={style.header}>
            <Icon type={'left'}  className={style.left} onClick={this.beforeMonth}/>
            <Icon type={'right'}  className={style.right} onClick={this.afterMonth}/>
            <MonthPicker value={month} format={'M月'} open={false}/>
          </div>
        </div>
        <div className={style['calendar-body']}>
          <ul className={style['c-body-head']}>
            <li>日</li>
            <li>一</li>
            <li>二</li>
            <li>三</li>
            <li>四</li>
            <li>五</li>
            <li>六</li>
          </ul>
          <div className={style['c-body-content']}>
            {
              ul_list.map((u, index) => {
                return (<ul key={'ul'+index} className={style['content-row']}>{u}</ul>);
              })
            }
          </div>
        </div>
        <div className={style.buttons}>
          <div onClick={this.getTime.bind(this,'back')}>取消</div>
          <div onClick={this.getTime.bind(this,'')}>确定</div>
        </div>
      </div>
    );
  }
}
export default Calendar;
