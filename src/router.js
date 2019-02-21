import React from 'react';
import {Router, Route} from 'dva/router';
import Overview from "./routes/overview/Overview";
import Detail from "./routes/overview/Detail";



function RouterConfig ({history}) {
  return (
    <Router history={history}>
      <Route path="/" component={Overview} />
      <Route path="detail" component={Detail}/>
    </Router>
  );
}

export default RouterConfig;
