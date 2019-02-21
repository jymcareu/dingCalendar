import CompanyNameService from '../../services/companyName/CompanyNameService';
export default {

  namespace: 'public',

  state: {
    companies:'', // 项目公司id
    keyWord:'', // 关键字
    type:'', // 表示年月日，1为年，2为月，3为日
  },

  effects: {

  },
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload};
    }
  },
};
