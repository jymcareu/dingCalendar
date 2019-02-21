import React,{Component} from 'react';
import {Icon} from 'antd-mobile';
import {DatePicker} from 'antd';
import 'antd/dist/antd.css';
import tab1 from './tabStyle.less';
import Calendar from "../../../components/Calendar";
import moment from 'moment';
import MyIcon from "../../../components/MyIcon";

class TimePicker extends Component{
  state={
    show: false,
    diyName:'自定义日期范围',
    time:[],
  };
  lists = [
    {text:'今日',time:[moment()]},
    {text:'昨日',time: [moment().subtract(1,'days')]},
    {text:'本周',time:[moment().startOf('isoWeek'),moment().endOf('isoWeek')]},
    {text:'上周',time:[moment().startOf('isoWeek').subtract(7,'days'),moment().endOf('isoWeek').subtract(7,'days')]},
    {text:'本月',time:[moment().startOf('month'),moment().endOf('month')]},
    {text:'上月',time:[moment().subtract(1,'month').startOf('month'),moment().subtract(1,'month').endOf('month')]},
  ];
  componentDidMount(){
    const {timeStr,time,name} = this.props;
    if(!name){
      this.setState({
        diyName:timeStr,
        time
      });
    }
  };
  //改变时间
  changeDate=(name,time,index)=>{
    if(time.length>1){
      time=[moment(time[0]),moment(time[1])];
      const timeStr=`${moment(time[0]).format('YYYY.MM.DD')}-${moment(time[1]).format('YYYY.MM.DD')}`;
      this.props.changeDate(time,name,timeStr,index);
    }else{
      time=[moment(time[0])];
      const timeStr=`${moment(time[0]).format('YYYY.MM.DD')}`;
      this.props.changeDate(time,name,timeStr,index);
    }
  };
  //日历显隐
  changeByOwn=()=>{
    const {show} = this.state;
    this.setState({
      show:!show
    });
  };
  //自定义日期
  setTime=(time)=>{
    let name = '';
    let timeStr = '';
    if(!time){
      this.setState({
        show:false,
      });
    }else{
      if(time.length>1){
        time=[moment(time[0]),moment(time[1])];
        timeStr=`${moment(time[0]).format('YYYY.MM.DD')}-${moment(time[1]).format('YYYY.MM.DD')}`;
        this.props.changeDate(time,name,timeStr,7);
      }else{
        time=[moment(time[0])];
        timeStr=`${moment(time[0]).format('YYYY.MM.DD')}`;
        this.props.changeDate(time,name,timeStr,7);
      }
    }
    this.setState({
      diyName:name
    });
  };
  render(){
    const {name} = this.props;
    const {show,diyName,time} = this.state;
    return <div className={tab1.date}>
      <p>日期</p>
      {
        show ?
          <Calendar setTime={this.setTime} time={time} hide={this.changeByOwn}/>
          : <ul className={tab1.ul}>
            {
              JSON.parse(JSON.stringify(this.lists)).map((val,index)=>{
                return <li className={name===val.text?tab1.active:''} key={index} onClick={this.changeDate.bind(this,val.text,val.time,index+1)}>
                  {val.text}
                </li>
              })
            }
            <li className={!name?tab1.active:''} style={{width:'94%'}} onClick={this.changeByOwn}>{diyName}</li>
          </ul>
      }
    </div>
  }
}
export default TimePicker;
