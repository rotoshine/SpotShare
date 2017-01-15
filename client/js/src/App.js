import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

/**
 * App Component
 */
class App extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    providers: PropTypes.array.isRequired,
    defaultTitle: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array])
  };

  componentDidMount() {
    window & window.$ && window.$.material.init();
  }

  renderLoginProviders() {
    const {user} = this.props;
    if (user.isLogin) {
      return (
        <li eventKey={1} key={1}>
          <div className="bs-components" style={{marginTop: 10}}>
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

  render() {
    const {user} = this.props;

    let userComponent = null;

    if (user.isLogin) {
      userComponent = (
        <NavItem>
          <span className="label label-info">Hello <i className={`fa fa-${user.provider}`}/>{user.name}!</span>
        </NavItem>
      );
    }

    return (
      <section style={{width: '100%', height: '100%'}}>
        <Navbar style={{marginBottom: 0}} inverse>
          <Navbar.Header>
            <Navbar.Brand>
              <LinkContainer to="/">
                <a href="/">{this.props.defaultTitle}</a>
              </LinkContainer>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to="/map">
                <NavItem eventKey={1}>Spot Map</NavItem>
              </LinkContainer>
              <LinkContainer to="/spots" onClick={this.handleSpotListMenuClick}>
                <NavItem eventKey={2}>Spot List</NavItem>
              </LinkContainer>
            </Nav>
            <Nav pullRight>
              {userComponent}
              {this.renderLoginProviders()}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {this.props.children}
      </section>
    );
  }

  handleSpotListMenuClick = (e) => {
    const {dispatch, location} = this.props;
    if(location.pathname !== '/spots'){
      dispatch({
        type: 'RESET_LOADED_SPOTS'
      });
    }else{
      e.preventDefault();
    }
  };
}

export default connect(
  (state) => {
    return {
      user: state.app.user,
      providers: state.app.providers,
      defaultTitle: state.app.defaultTitle
    };
  })
(App);
