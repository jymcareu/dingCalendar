import request from '../../utils/request';

export default {

  /**
   * 获取所有项目信息
   */
  projectCompanyId:()=>{
    return request({url: '/wcsVisualPlatform/dingtalk/getAllProjectCompany', method: 'GET'});
  },

}
