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
        <NavItem eventKey={1} key={1} href="/auth/facebook/login" className="btn-raised" style={{backgroundColor: '#3b5998'}}>
          <i className="fa fa-facebook"/> Login
        </NavItem>
      ),
      (
        <NavItem eventKey={2} key={2} href="/auth/twitter/login" className="btn-raised" style={{backgroundColor:'#1DA1F2'}}>
          <i className="fa fa-twitter" /> Login
        </NavItem>
      ),
      (
        <NavItem eventKey={3} key={3} href="/auth/kakao/login" className="btn-raised" style={{backgroundColor:'#FFEA0A', color: '#000000'}}>
          <i className="fa fa-kakao" /> Login
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
