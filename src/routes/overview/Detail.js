import React,{Component} from 'react';
import style from './view.less';
import VideoPlayer from "../../components/VideoPlayer";
import request from "../../utils/request";
import {message} from 'antd';
import moment from 'moment';

class Detail extends Component{
  state={
    detail:[],
    url:''
  };
  componentDidMount(){
    document.title = '详情';
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
    const {state} = this.props.location;
    if(state.record){
      request({
        url:'/wcsVisualPlatform/dingtalk/alarmDetail',
        method:'GET',
        params:{
          projectCode:state.record.projectCode,
          showCode:state.record.showCode,
        }
      }).then(data=>{
        if(data.rc===0){
          if(data.ret.cameraCode&&data.ret.cameraCode.length){
            this.getUrl(data.ret.cameraCode[0]);
          }
          this.setState({
            detail:data.ret.data
          });
        }else{
          message.error(data.err);
        }
      });
    }
  };
  getUrl=(value)=>{
    request({
      url:'/wcsVisualPlatform/dingtalk/startVideo',
      method:'GET',
      params:{
        streamCode:value
      }
    }).then(data=>{
      if(data.rc===0){
        this.setState({
          url:data.ret
        });
      }
    });
  };
  render(){
    const {projectList,detail,url} = this.state;
    const {record} = this.props.location.state;
    console.log(url);
    return <div className={style.details}>
      <div>
        <h1>{record.projectName}<span>{record.alarmTime?moment(record.alarmTime).format('YYYY-MM-DD HH:mm:ss'):''}</span></h1>
        <p>报警设备：{record.deviceName}</p>
        <p>报警测点：{record.pointName}</p>
        <p>报警类型：{record.status}</p>
      </div>
      <div>
        <h1>可能原因</h1>
        {
          detail.map((val,index)=>{
            return <p key={index}><span style={{paddingRight:5}}>{`${index+1}.`}</span>{val.wrongDoctor}</p>
          })
        }
      </div>
      <div>
        <h1>设备视频</h1>
        {
          url?
            <VideoPlayer
              width={'100%'}
              height={'200px'}
              webkit-playsinline={true}
              notSupportedMessage={'您的浏览器没有安装或开启Flash,请检查！'}
              playsinline={true}
              preload={true}
              autoplay={true}
              controls={true}
              techOrder={["html5", "flash"]}
              sources={[{src: url, type: 'application/x-mpegURL'}]}
          />:''
        }

      </div>
    </div>
  }
}
export default Detail;
