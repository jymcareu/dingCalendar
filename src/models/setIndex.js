import CompanyNameService from "../services/companyName/CompanyNameService";

export default {
  namespace: 'public',
  state: {
    index:0,
    page:0,
    time:1,
    companies: [],
    total:0,
  },
  effects: {
    *getCompany({payload}, {put,call}) {
      let result = yield call(CompanyNameService.projectCompanyId);
      if(result.rc===0 && result.ret&&result.ret.length){
        const list = result.ret;
        yield put({type: 'save', payload:{companies:list}})
      }
    },
  },

  reducers: {
    save(state, {payload}) {
      return {...state, ...payload};
    }
  },
};
