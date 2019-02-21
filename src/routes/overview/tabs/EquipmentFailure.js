import React,{Component} from 'react';
import {Icon} from 'antd-mobile';
import {DatePicker,Dropdown,Menu,Spin,message} from 'antd';
import 'antd/dist/antd.css';
import tab2 from './tabStyle.less';
import Calendar from "../../../components/Calendar";
import moment from 'moment';
import MyIcon from "../../../components/MyIcon";
import TimePicker from "./TimePicker";
import ProjectPicker from "./ProjectPicker";
import {hashHistory} from 'dva/router';
import {connect} from 'dva';
import request from "../../../utils/request";


const RangePicker = DatePicker.RangePicker;
class EquipmentFailure extends Component{
  state={
    date:false,
    time:[moment()],
    name:'今日',
    timeStr:`${moment().format('YYYY.MM.DD')}`,
    dataSource:[],
    open:false,
    projectName:this.props.companies.length?this.props.companies[0].name:'',
    projectId: '',
    spinning:false,
  };

  componentDidMount(){
    this.getList();
  };
  getList=(params)=>{
    this.setState({
      spinning: true,
    });
    request({
      url:'/wcsVisualPlatform/dingtalk/alarmList',
      method:'GET',
      params
    }).then(data=>{
      if(data.rc===0){
        this.setState({
          total:data.ret.total,
          dataSource: data.ret.alarmList,
          spinning: false,
        });
        this.props.dispatch({type:'public/save',payload:{total:data.ret.total}});
      }else{
        message.error(data.err);
      }
    });
  };
  //改变时间
  changeDate=(time,name,timeStr)=>{
    this.setState({
      time,
      name,
      timeStr,
      date:false,
    });
  };

  //日期显隐
  showDate=()=>{
    const {date} = this.state;
    this.setState({
      date:!date,
      open:false,
    });
  };
  //选择项目
  selectProject=()=>{
    const {open} = this.state;
    this.setState({
      open:!open,
      date:false,
    });
  };
  changeProject=(name,code)=>{
    this.getList({projectCode:code});
    this.setState({
      projectName:name,
      open:false
    });
  };
  //进入详情页
  showDetail=(record)=>{
    const path={
      pathname:'/detail',
      state:{
        record,
      }
    };
    hashHistory.push(path);
  };
  render(){
    const {date,name,time,timeStr,dataSource,open,projectName,spinning} = this.state;
    return <div style={{width:'100%',position:'relative',minHeight:'100%',background:'#fff'}}>
      {
        date||open?
          <div style={{position:'absolute',width:'100%',height:'100%',zIndex:10,background:'#fff'}}/> :''
      }
      <div className={tab2.header}>
       {/* <span onClick={this.showDate} style={{float:'left',marginLeft:20}}>
          <span style={{paddingRight:5}}>{name?`${name}(${timeStr})`:timeStr}</span>
          {
            date?
              <Icon type={'up'}/>
              :
              <Icon type={'down'}/>
          }
        </span>*/}
        <span onClick={this.selectProject} style={{float:'right',marginRight:20}} >
          <span style={{paddingRight:5}}>{projectName}</span>
          {
            open?
              <Icon type={'up'}/>
              :
              <Icon type={'down'}/>
          }
        </span>
      </div>
      {
        date?
          <TimePicker changeDate={this.changeDate}  name={name}/>:''
      }
      {
        open?
          <ProjectPicker projectName={projectName} changeProject={this.changeProject}/>:''
      }
      <Spin spinning={spinning}>
        <div className={tab2.body2}>
          {
            dataSource.length?dataSource.map((val,index)=>{
              return <div key={index} onClick={this.showDetail.bind(this,val)}>
                <h1>{val.projectName}</h1>
                <p>报警设备：{val.deviceName}</p>
                <p>报警测点：{val.pointName}</p>
                <p>报警类型：{val.status}</p>
                <p className={tab2.time}>{val.alarmTime?moment(val.alarmTime).format('YYYY-MM-DD HH:mm:ss'):''}</p>
              </div>
            }): <span className={tab2.tip}>暂无数据</span>
          }

        </div>
      </Spin>

    </div>
  }
}

function mapStateToProps(state) {
  return {
    companies:state.public.companies,
  };
}

export default connect(mapStateToProps)(EquipmentFailure);
