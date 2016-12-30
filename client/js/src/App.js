import React, {PropTypes} from 'react';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';

/**
 * App Component
 */
export default class App extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired
  };

  state = {
    user: JSON.parse(document.getElementById('user').innerHTML),
    providers: JSON.parse(document.getElementById('providers').innerHTML),
    title: $('title').html()
  };

  componentDidMount() {
    window.$.material.init();
  }

  renderLoginProviders() {
    const {user} = this.state;
    if(user.isLogin){
      return (
        <li eventKey={1} key={1}>
          <div className="bs-components" style={{marginTop:10}}>
            <a href="/logout" className="btn btn-raised btn-xs btn-danger">Logout</a>
          </div>
        </li>
      );
    }else{
      let authButtons = [];
      this.state.providers.forEach((provider, i) => {
        authButtons.push(
          <NavItem eventKey={i} key={i} href={`/auth/${provider}/login`} className={`btn-raised auth-button-${provider}`}>
            <i className={`fa fa-${provider}`} /> Login
          </NavItem>
        );
      });

      return authButtons;
    }

  }
  render() {
    const {user} = this.state;

    let userComponent = null;

    if (user.isLogin) {
      userComponent = (
        <NavItem>
          <span className="label label-info">Hello <i className={`fa fa-${user.provider}`} />{user.name}!</span>
        </NavItem>
      );
    }

    return (
      <section style={{width: '100%', height: '100%'}}>
        <Navbar style={{marginBottom:0}} inverse>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">{this.state.title}</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} href="#">Spot Map</NavItem>
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
}
