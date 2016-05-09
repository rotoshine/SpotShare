import React, {PropTypes} from 'react';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
export default class App extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired
  };

  render() {
    return (
      <section>
        <Navbar inverse>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">Board Spot!</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} href="#">Spot List</NavItem>
            </Nav>
            <Nav pullRight>
              <NavItem eventKey={1} href="#">Login</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {this.props.children}
      </section>
    );
  }
}
