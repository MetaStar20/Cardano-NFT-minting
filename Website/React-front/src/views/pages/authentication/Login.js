import React from "react";
import {
  Button,
  Card,
  CardBody,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import { connect } from "react-redux";
import { User, Lock, Check } from "react-feather";
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy";

import loginImg from "../../../assets/img/pages/car_login.png";
import "../../../assets/scss/pages/authentication.scss";
import { loginUser } from "../../../redux/actions/api";

class Login extends React.Component {
  state = {
    username: "",
    password: "",
    formerror: "",
  };

  onLogin = () => {
    const { username, password } = this.state;
    if (!username) {
      this.setState({ formerror: "Username is required" });
      return;
    }
    if (password.length < 6) {
      this.setState({ formerror: "Password should be more than 6 in length" });
      return;
    }
    this.setState({ formerror: ""})
    this.props.loginUser({ username, password });
  };

  render() {
    const { formerror } = this.state
    return (
      <Row className="m-0 justify-content-center">
        <Col
          sm="6"
          xl="6"
          lg="8"
          md="6"
          className="d-flex justify-content-center"
        >
          <Card className="bg-authentication login-card rounded-0 mb-0 w-100">
            <Row className="mt-0 login-background">
              <Col
                lg="6"
                className="d-lg-block d-none text-center align-self-center px-0 py-0"
              >
                <img src={loginImg} alt="loginImg"/>
              </Col>
              <Col lg="6" md="12" className="p-0">
                <Card className="rounded-0 mb-0 px-2 pt-2 pb-2">
                  <CardBody>
                    <h4>Login</h4>
                    <p>Welcome back, please login to your account.</p>
                    <Form onSubmit={(e) => e.preventDefault()} className="mt-4">
                      <FormGroup className="form-label-group position-relative has-icon-left">
                        <Input
                          type="text"
                          placeholder="Username"
                          value={this.state.username}
                          onChange={(e) =>
                            this.setState({ username: e.target.value })
                          }
                        />
                        <div className="form-control-position">
                          <User size={15} />
                        </div>
                        <Label>Username</Label>
                      </FormGroup>
                      <FormGroup className="form-label-group position-relative has-icon-left">
                        <Input
                          type="password"
                          placeholder="Password"
                          value={this.state.password}
                          onChange={(e) =>
                            this.setState({ password: e.target.value })
                          }
                        />
                        <div className="form-control-position">
                          <Lock size={15} />
                        </div>
                        <Label>Password</Label>
                      </FormGroup>
                      <FormGroup className="d-flex justify-content-between align-items-center">
                        <Checkbox
                          color="primary"
                          icon={<Check className="vx-icon" size={16} />}
                          label="Remember me"
                        />
                        <Button.Ripple
                          color="primary"
                          type="submit"
                          onClick={this.onLogin}
                        >
                          Login
                        </Button.Ripple>
                      </FormGroup>
                      <div className="form-error">{formerror}</div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}

export default connect(mapStateToProps, {
  loginUser,
})(Login);
