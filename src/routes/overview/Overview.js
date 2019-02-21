import React,{Component} from 'react';
import {Tabs} from 'antd-mobile';
import {LocaleProvider,Badge} from 'antd';
import style from './view.less';
import OperationalData from "./tabs/OperationalData";
import zhCN from 'antd/lib/locale-provider/zh_CN';
import MyIcon from "../../components/MyIcon";
import EquipmentFailure from "./tabs/EquipmentFailure";
import Videos from "./tabs/Videos";
import {connect} from 'dva';
import request from "../../utils/request";

class Overview extends Component{
  state={
    page: 0,
    all:0,
  };
  componentDidMount(){
    document.title = '可视化系统';
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'display: none; width: 0; height: 0;';
    iframe.src = 'http://desk.fd.zol-img.com.cn/t_s960x600c5/g5/M00/05/0F/ChMkJ1erCriIJ_opAAY8rSwt72wAAUU6gMmHKwABjzF444.jpg';
    const listener = () => {
      setTimeout(() => {
        iframe.removeEventListener('load', listener);
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 0);
      }, 0);
    };
    iframe.addEventListener('load', listener);
    document.body.appendChild(iframe);
    this.props.dispatch({type:'public/getCompany'});
    request({
      url:'/wcsVisualPlatform/dingtalk/alarmList',
      method:'GET',
    }).then(data=>{
      if(data.rc===0){
        this.setState({
          all:data.ret.total,
        });
        this.props.dispatch({type:'public/save',payload:{total:data.ret.total}});
      }
    });
  }
  onChange=(tab,index)=>{
    this.props.dispatch({type:'public/getCompany'});
    this.props.dispatch({type:'public/save',payload:{index:index}});
  };
  render(){
    const {all} = this.props;
    const {index,total} = this.props;
    const height = document.body.scrollHeight;
    const tabs = [
      {title:<span><MyIcon type={'icon-zixiangmukanban'}/>运营数据</span>,sub:'1'},
      {title:<Badge count={total||all}><span><MyIcon type={'icon-Group-'}/>设备故障</span></Badge>,sub:'2'},
      {title:<span><MyIcon type={'icon-video'}/>项目视频</span>,sub:'3'},
    ];
    return<div>
      <LocaleProvider locale={zhCN}>
        <div className={style.tabs} style={{height:height}}>
          <Tabs
            swipeable={false}
            tabs={tabs}
            tabBarPosition="bottom"
            page={index}
            onTabClick={this.onChange}
          >
            {index===0? <OperationalData />:''}
            {index===1? <EquipmentFailure/> :''}
            {index===2? <Videos/>:''}
            </Tabs>
        </div>
      </LocaleProvider>
    </div>

  }
}
function mapStateToProps(state) {
  return {
    index:state.public.index,
    total:state.public.total,
  };
}

export default connect(mapStateToProps)(Overview);
