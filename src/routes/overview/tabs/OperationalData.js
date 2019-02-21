import React,{Component} from 'react';
import {Icon} from 'antd-mobile';
import {DatePicker,Spin,message} from 'antd';
import 'antd/dist/antd.css';
import tab1 from './tabStyle.less';
import Calendar from "../../../components/Calendar";
import moment from 'moment';
import MyIcon from "../../../components/MyIcon";
import TimePicker from "./TimePicker";
import totalPic from '../../../assets/tongji.png';
import request from "../../../utils/request";

const RangePicker = DatePicker.RangePicker;
class OperationalData extends Component{
  state={
    date:false,
    time:[moment()],
    name:'今日',
    timeStr:`${moment().format('YYYY.MM.DD')}`,
    dataSource:[],
    totalPowerGeneration:0,
    totalIncomingRefuse:0,
    spinning:false,
  };
  lists = [
    {text:'今日',time:[moment()],type:1},
    {text:'昨日',time: [moment().subtract(1,'days')],type:2},
    {text:'本周',time:[moment().startOf('isoWeek'),moment().endOf('isoWeek')],type:3},
    {text:'上周',time:[moment().startOf('isoWeek').subtract(7,'days'),moment().endOf('isoWeek').subtract(7,'days')],type:4},
    {text:'本月',time:[moment().startOf('month'),moment().endOf('month')],type:5},
    {text:'上月',time:[moment().subtract(1,'month').startOf('month'),moment().subtract(1,'month').endOf('month')],type:6},
  ];

  componentDidMount(){
    this.getList(1);
  }

  getList =(type)=>{
    const {time} = this.state;
    let startTime = 0;
    let endTime = '';
    if(time.length===1){
      startTime  = moment(time[0]).startOf('day').valueOf();
    }else if(time.length===2){
      startTime  = moment(time[0]).startOf('day').valueOf();
      endTime  = moment(time[1]).endOf('day').valueOf();
    }
    this.setState({
      spinning: true,
    });
    request({
      url:'/wcsVisualPlatform/dingtalk/operationalData',
      method:'GET',
      params:{
        startTime,
        endTime,
        type,
      }
    }).then(data=>{
      if(data.rc===0){
        this.setState({
          dataSource: data.ret.dataList,
          spinning:false,
          totalIncomingRefuse:data.ret.totalIncomingRefuse,
          totalPowerGeneration:data.ret.totalPowerGeneration,
        });
      }else{
        message.error(data.err);
        this.setState({
          spinning:false,
          dataSource:[]
        });
      }
    });
  };
  //改变时间
  changeDate=(time,name,timeStr,type)=>{

    this.setState({
      time,
      name,
      timeStr,
      date:false,
      type
    },()=>{ this.getList(type);});
  };

  //日期显隐
  showDate=()=>{
    const {date} = this.state;
    this.setState({
      date:!date,
    });
  };
  //上一个日期
  beforeDate=()=>{
    let {time} = this.state;
    let name = '';
    let type = 7 ;
    if(time.length===1){
      time = [moment(time[0]).subtract(1,'days')];
      const same = [...this.lists].filter(val=>val.time.length===1&&moment(val.time[0]).format('YYYY.MM.DD')===moment(time[0]).format('YYYY.MM.DD'));
      if(same.length){
        name = same[0].text;
        type = same[0].type;
      }
      this.setState({
        time,
        name,
        timeStr:`${moment(time[0]).format('YYYY.MM.DD')}`,
      },()=>{this.getList(type)});
    }else{
      const day= moment(time[1]).diff(moment(time[0]),'days');
      if(day>=25){
        time = [moment(time[0]).subtract(1,'month').startOf('month'),moment(time[1]).subtract(1,'month').endOf('month')];
      }else if(day===6){
        time = [time[0].subtract(1,'week').startOf('week'),time[1].subtract(1,'week').endOf('week')];
      }else{
        time = [moment(time[0]).subtract(day,'days'),moment(time[1]).subtract(day,'days')];
      }
      const same = [...this.lists].filter(val=>val.time.length===2&&val.time[0].format('YYYY.MM.DD')===moment(time[0]).format('YYYY.MM.DD')&&val.time[1].format('YYYY.MM.DD')===moment(time[1]).format('YYYY.MM.DD'));
      if(same.length){
        name = same[0].text;
        type = same[0].type;
      }
      this.setState({
        time,
        name,
        timeStr:`${moment(time[0]).format('YYYY.MM.DD')}-${moment(time[1]).format('YYYY.MM.DD')}`,
      },()=>{this.getList(type)});
    }
  };

  //下一个日期
  afterDate=()=>{
    let {time} = this.state;
    let name = '';
    let type = 7;
    if(time.length===1){
      time = [time[0].add(1,'days')];
      const same = [...this.lists].filter(val=>val.time.length===1&&val.time[0].format('YYYY.MM.DD')===time[0].format('YYYY.MM.DD'));
      if(same.length){
        name = same[0].text;
        type = same[0].type;
      }
      this.setState({
        time,
        name,
        timeStr:`${time[0].format('YYYY.MM.DD')}`,
      },()=>{this.getList(type)});
    }else{
      const day= time[1].diff(time[0],'days');
      if(day>=25){
        time = [time[0].add(1,'month').startOf('month'),time[1].add(1,'month').endOf('month')];
      }else if(day===6){
        time = [time[0].add(1,'week').startOf('week'),time[1].add(1,'week').endOf('week')];
      }else{
        time = [time[0].add(day,'days'),time[1].add(day,'days')];
      }
      const same = [...this.lists].filter(val=>val.time.length===2&&val.time[0].format('YYYY.MM.DD')===time[0].format('YYYY.MM.DD')&&val.time[1].format('YYYY.MM.DD')===time[1].format('YYYY.MM.DD'));
      if(same.length){
        name = same[0].text;
        type = same[0].type;
      }
      this.setState({
        time,
        name,
        timeStr:`${time[0].format('YYYY.MM.DD')}-${time[1].format('YYYY.MM.DD')}`,
      },()=>{this.getList(type)});
    }
  };

  render(){
    const {date,name,time,timeStr,dataSource,totalIncomingRefuse,totalPowerGeneration,spinning} = this.state;
    const width = document.body.clientWidth;
    return <div style={{width:'100%',position:'relative',minHeight:690,background:'#fff'}}>
      {
        date?
          <div style={{position:'absolute',width:'100%',height:'100%',zIndex:10,background:'#fff'}}/> :''
      }
      <div className={tab1.header}>
        <Icon type={'left'} className={tab1.left} onClick={this.beforeDate}/>
        <span onClick={this.showDate} style={{cursor:'pointer'}}>
          <span style={{paddingRight:5}}>{name?`${name}(${timeStr})`:timeStr}</span>
          {
            date?
              <Icon type={'up'}/>
              :
              <Icon type={'down'}/>
          }
        </span>
        <Icon type={'right'} className={tab1.right} onClick={this.afterDate}/>
      </div>
      {
        date?
         <TimePicker changeDate={this.changeDate} name={name} time={time} timeStr={timeStr}/>:''
      }
      <div className={tab1.content}>
        <p className={tab1.header2}>旺能总览</p>
        <div className={tab1.body1} style={{display:'flex'}}>
          <div>
            <p>{`${name?name:''}总入厂垃圾量`}</p>
            <p>{totalIncomingRefuse?totalIncomingRefuse.toFixed(2):0}t<img src={totalPic} alt=""/></p>
          </div>
          <div>
            <p>{`${name?name:''}总发电量`}</p>
            <p>{totalPowerGeneration?totalPowerGeneration.toFixed(2):0}t<img src={totalPic} alt=""/></p>
          </div>
        </div>
        <p className={tab1.header2}>项目概况</p>
        <div className={tab1.table}>
          <Spin spinning={spinning}>
            <p><span>项目</span><span>入厂垃圾量(t)</span><span>发电量(万KW·h)</span></p>
            {
              dataSource.length?dataSource.map((val,index)=>{
                return <p key={index}><span>{val.projectName}</span><span>{val.incomingRefuse?val.incomingRefuse.toFixed(2):'--'}</span><span>{val.powerGeneration?val.powerGeneration.toFixed(2):'--'}</span></p>
              }): <span className={tab1.tip}>暂无数据</span>
            }
          </Spin>

        </div>
      </div>
    </div>
  }
}

export default OperationalData;
