/* eslint-disable */
import React, { Suspense, lazy } from "react";
import { Route, Switch, Redirect, Link, BrowserRouter as Router } from "react-router-dom";
import Spinner from "../Helpers/Spinner";
import userStore from "../Store/UsersStore";
import 'semantic-ui-css/semantic.min.css'
// const Administrators = lazy(() => import("./pages/Admin/Administrators"));
// const AddEditAdministrator = lazy(() => import("./pages/Admin/AddEditAdministrator.tsx--"));
// const changePassword = lazy(() => import("./pages/Admin/ChangePassword"));
const Chat = lazy(() => import("./Chat"));
const Login = lazy(() => import("./Login"));
interface IProps {
  userStore?: any
}

class App extends React.Component<any, IProps> {
  private ismounted = true;
  componentDidMount() {
    if (!this.ismounted) return;
    this.initApp();
  }

  componentWillUnmount() {
    this.ismounted = false
  }

  initApp = () => {
    
  }

  checkAuthentication = () => {
    const {userStore} =this.props;
    if(!userStore.usersData){
     return <Redirect to={{ pathname: "/" }} />
    }
  }


  render() {
    return (
      <>
        <Router>
          <Suspense fallback={
            <Spinner size="massive" />
          }>
            <Switch>
              {/* <Route path="/administrators/addeditadministrators/:id" component={AddEditAdministrator} />   
              <Route path="/administrators/changepassword/:id" component={changePassword} />     
              <Route path="/administrators" component={Administrators} />             */}
              <Route path="/chat" component={Chat} />
              <Route path="/login" component={Login} />
              <Route path="/" component={Login} />
            </Switch>

          </Suspense>     
          {this.checkAuthentication()}    
        </Router>
      
      </>
    )
  }
}
const withStore = (BaseComponent: any) => (props: any) => {
  const userS = userStore();

  return <BaseComponent {...props} userStore={userS} />;
};
export default withStore(App)
