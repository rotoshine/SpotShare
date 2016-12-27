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
    title: $('title').html()
  };

  componentDidMount() {
    window.$.material.init();
  }

  render() {
    const {user} = this.state;

    let userComponent = null;
    let authButtons = [
      (
        <NavItem eventKey={1} key={1} href="/auth/facebook/login" className="btn-raised">
          <i className="fa fa-facebook"/> Login
        </NavItem>),
      (
        <NavItem eventKey={2} key={2} href="/auth/kakao/login" className="btn-raised">
          Kakao Login
        </NavItem>
      )
    ];

    if (user.isLogin) {
      userComponent = (
        <NavItem>
          <span className="label label-info">Hello {user.name}!</span>
        </NavItem>
      );
      authButtons = [(
        <li eventKey={1} key={1}>
          <div className="bs-components" style={{marginTop:10}}>
            <a href="/logout" className="btn btn-raised btn-xs btn-danger">Logout</a>
          </div>
        </li>
      )];
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
              {authButtons}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {this.props.children}
      </section>
    );
  }
}
