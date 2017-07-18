import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Layout, Menu } from 'antd';
import { Switch, Route, withRouter } from 'react-router-dom';
import SpotMapContainer from './containers/SpotMapContainer';
import SpotListContainer from './containers/SpotListContainer';
import SpotDetailContainer from './containers/SpotDetailContainer';
import SpotFormContainer from './containers/SpotFormContainer';
import NotFoundContainer from './containers/errors/NotFoundContainer';
const { Header, Content } = Layout;
/**
 * App Component
 */
class App extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    providers: PropTypes.array.isRequired,
    defaultTitle: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([ PropTypes.element, PropTypes.array ])
  };

  state = {
    selectedMenu: null
  };

  renderLoginProviders () {
    const { user } = this.props;
    if ( user.isLogin ) {
      return (
        <li eventKey={1} key={1}>
          <div className="bs-components" style={{ marginTop: 10 }}>
            <a href="/logout" className="btn btn-raised btn-xs btn-danger">Logout</a>
          </div>
        </li>
      );
    } else {
      let authButtons = [];
      this.props.providers.forEach((provider, i) => {
        authButtons.push(
          <Link eventKey={i} key={i} href={`/auth/${provider}/login`}
                className={`btn-raised auth-button-${provider}`}>
            <i className={`fa fa-${provider}`}/> Login
          </Link>
        );
      });

      return authButtons;
    }

  }

  handleMenuClick = (e) => {
    const { dispatch, location } = this.props;
    if ( location.pathname !== '/spots' ) {
      dispatch({
        type: 'RESET_LOADED_SPOTS'
      });
    } else {
      e.preventDefault();
    }

    this.setState({
      selectedMenu: e.key
    }, () => {
      this.props.history.push(`/${e.key}`);
    });
  };

  render () {
    const { user } = this.props;

    let userComponent = null;

    if ( user.isLogin ) {
      userComponent = (
        <span className="label label-info">Hello <i className={`fa fa-${user.provider}`}/>{user.name}!</span>
      );
    }

    return (
      <Layout style={{ width: '100%', height: '100%' }}>
        <Header>
          <Menu selectedKeys={[ this.state.selectedMenu ]} mode="horizontal" onClick={this.handleMenuClick}>
            <Menu.Item key="map">Map</Menu.Item>
            <Menu.Item key="spots">List</Menu.Item>
            {userComponent}
          </Menu>
        </Header>
        <Content>
          <Switch>
            <Route path="/" exact component={SpotMapContainer}/>
            <Route path="/map" exact component={SpotMapContainer}/>
            <Route path="/spots" exact strict component={SpotListContainer}/>
            <Route path="/spots/:spotId" exact strict component={SpotDetailContainer}/>
            <Route path="/spots/:spotId/form" exact strict component={SpotFormContainer}/>
            <Route component={NotFoundContainer}/>
          </Switch>
        </Content>
      </Layout>
    );
  }

  handleSpotListMenuClick = (e) => {
    const { dispatch, location } = this.props;
    if ( location.pathname !== '/spots' ) {
      dispatch({
        type: 'RESET_LOADED_SPOTS'
      });
    } else {
      e.preventDefault();
    }
  };
}

const ConnectedApp = connect(
  (state) => {
    return {
      user: state.app.user,
      providers: state.app.providers,
      defaultTitle: state.app.defaultTitle
    };
  })
(App);

export default withRouter(ConnectedApp);
