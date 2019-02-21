import React,{Component} from 'react';
import {connect} from 'dva';
import tab2 from "./tabStyle.less";
import request from "../../../utils/request";

class ProjectPicker extends Component{
  state={
    projectList:this.props.companies,
  };

  componentDidMount(){
    request({
      url:'/wcsVisualPlatform/dingtalk/getAllProjectCompany',
      method:'GET'
    }).then(data=>{
      if(data.rc===0){
        this.setState({
          projectList: data.ret
        });
      }
      });
  }
  //改变时间
  changeProject=(name,id)=>{
    this.props.changeProject(name,id);
  };
  render(){
    const {projectList} = this.state;
    const {projectName} = this.props;
    return <div className={tab2.date} style={{zIndex:1002}}>
      <p>项目公司</p>
      <ul className={tab2.ul}>
        {
          projectList.map((val,index)=>{
            return <li key={index} className={projectName===val.name?tab2.active:''} onClick={this.changeProject.bind(this,val.name,val.code)}>
              {val.name}
            </li>
          })
        }
      </ul>
    </div>
  }
}
function mapStateToProps(state) {
  return {
    companies:state.public.companies,
  };
}

export default connect(mapStateToProps)(ProjectPicker);
