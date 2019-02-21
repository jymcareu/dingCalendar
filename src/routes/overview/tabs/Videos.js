import React,{Component} from 'react';
import {Icon} from 'antd-mobile';
import {DatePicker,} from 'antd';
import 'antd/dist/antd.css';
import tab3 from './tabStyle.less';
import moment from 'moment';
import ProjectPicker from "./ProjectPicker";
import VideoPlayer from "../../../components/VideoPlayer";
import request from "../../../utils/request";
import {connect} from 'dva';


const RangePicker = DatePicker.RangePicker;
class Videos extends Component{
  state={
    date:false,
    time:[moment()],
    timeStr:`${moment().format('YYYY.MM.DD')}`,
    dataSource:[{}],
    open:false,
    projectName:this.props.companies.length?this.props.companies[1].name:'',
    projectCode: this.props.companies.length?this.props.companies[1].code:'',
    dots:[],
    dot:'',
    allData:[],
    url:'',
    fresh:false,
  };

  componentDidMount(){
    const {projectName} = this.state;
    const {companies} = this.props;
    request({
      url:'/wcsVisualPlatform/dingtalk/getCameraListWithTime',
      method:'GET',
    }).then(data=>{
      if(data.rc===0){
        const dots = [];
        const projectId = companies.filter(val=>val.name===projectName)[0].id;
        const companyData = data.ret.filter(val=>val.ownId===projectId);
        if(companyData.length){
          companyData[0].cameraList.map(file=>{
            dots.push({
              text:file.name,
              value:file.indexCode,
            })
          });
        }
        this.setState({
          allData:data.ret,
          dots,
          dot:dots.length?dots[0].text:''
        });
      }
    });
  }

  //选择项目
  selectProject=()=>{
    const {open} = this.state;
    this.setState({
      open:!open,
    });
  };
  changeProject=(name,code)=>{
    const {allData} = this.state;
    const {companies} = this.props;
    const dots = [];
    const projectId = companies.filter(val=>val.code===code)[0].id;
    const companyData = allData.filter(val=>val.ownId===projectId);
    if(companyData.length){
      companyData[0].cameraList.map(file=>{
        dots.push({
          text:file.name,
          value:file.indexCode,
        })
      });
    }
    this.setState({
      projectName:name,
      dots,
      dot:dots.length?dots[0].text:'',
      open:false
    },()=>{
      this.changeDot(dots.length?dots[0].text:'',dots.length?dots[0].value:'');
    });
  };
  changeDot=(text,value)=>{
    this.setState({
      fresh: false,
    });
    request({
      url:'/wcsVisualPlatform/dingtalk/startVideo',
      method:'GET',
      params:{
        streamCode:value
      }
    }).then(data=>{
      if(data.rc===0){
        this.setState({
          url:data.ret,
          fresh:true,
        });
      }
    });
    this.setState({
      dot:text,
    });
  };
  render(){
    const {date,name,time,timeStr,dataSource,open,projectName,dots,dot,url,fresh} = this.state;
    const width = document.body.clientWidth;
    return <div style={{width:'100%',position:'relative',minHeight:'100%',background:'#fff'}}>
      {
        open?
          <div style={{position:'absolute',width:'100%',height:'100%',zIndex:1001,background:'#fff'}}/> :''
      }
      <div className={tab3.header}>
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
        open?
          <ProjectPicker projectName={projectName} changeProject={this.changeProject}/>:''
      }
      <div className={tab3.date} style={{position:'relative',top:0}}>
        <p>选择视频点位</p>
        <ul className={tab3.ul}>
          {
            dots.length?
            dots.map((val,index)=>{
              return <li key={index} className={dot===val.text?tab3.active:''} onClick={this.changeDot.bind(this,val.text,val.value)} >
                {val.text}
              </li>
            }): <span className={tab3.tip}>暂无点位</span>
          }
        </ul>
        <p>{`${projectName}-${dot}`}</p>
        {
          url&&fresh ? <VideoPlayer
            width={'100%'}
            height={'200px'}
            webkit-playsinline={false}
            notSupportedMessage={'您的浏览器没有安装或开启Flash,请检查！'}
            playsinline={false}
            preload={false}
            autoplay={true  }
            controls={true}
            techOrder={["html5", "flash"]}
            sources={[{src: url, type: 'application/x-mpegURL'}]}
          />:''
        }

      </div>

    </div>
  }
}
function mapStateToProps(state) {
  return {
    companies:state.public.companies,
  };
}

export default connect(mapStateToProps)(Videos);
