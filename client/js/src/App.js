import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav, NavItem} from 'react-bootstrap';
import { Switch, Route, Link, withRouter } from 'react-router-dom';
import RouteNavItem from './components/RouterNavItem';
import SpotMapContainer from './containers/SpotMapContainer';
import SpotListContainer from './containers/SpotListContainer';
import SpotDetailContainer from './containers/SpotDetailContainer';
import SpotFormContainer from './containers/SpotFormContainer';
import NotFoundContainer from './containers/errors/NotFoundContainer';

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

  componentDidMount () {
    window && window.$ && window.$.material.init();
  }

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
          <NavItem eventKey={i} key={i} href={`/auth/${provider}/login`}
                   className={`btn-raised auth-button-${provider}`}>
            <i className={`fa fa-${provider}`}/> Login
          </NavItem>
        );
      });

      return authButtons;
    }

  }

  render () {
    const { user } = this.props;

    let userComponent = null;

    if ( user.isLogin ) {
      userComponent = (
        <NavItem>
          <span className="label label-info">Hello <i className={`fa fa-${user.provider}`}/>{user.name}!</span>
        </NavItem>
      );
    }

    return (
      <section style={{ width: '100%', height: '100%' }}>
        <Navbar style={{ marginBottom: 0 }} inverse>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">{this.props.defaultTitle}</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
                <RouteNavItem eventKey={1} to="/map">Spot Map</RouteNavItem>
                <RouteNavItem eventKey={2} to="/spots" onClick={this.handleSpotListMenuClick}>Spot List</RouteNavItem>
            </Nav>
            <Nav pullRight>
              {userComponent}
              {this.renderLoginProviders()}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Switch>
          <Route path="/" exact component={SpotMapContainer}/>
          <Route path="/map" exact component={SpotMapContainer}/>
          <Route path="/spots" exact component={SpotListContainer}/>
          <Route path="/spots/:spotId" exact componen={SpotDetailContainer}/>
          <Route path="/spots/:spotId/form" exact component={SpotFormContainer}/>
          <Route path="/*" component={NotFoundContainer}/>
        </Switch>
      </section>
    );
  }

  handleSpotListMenuClick = (e) => {
    console.log(this.props);
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
