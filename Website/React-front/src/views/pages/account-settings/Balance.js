import React from "react";
import { Button, Form, FormGroup, Input, Label, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import { getAppConfig, updateAppConfig } from "../../../redux/actions/api";

class Balance extends React.Component {
  state = {
    formerror: "",
    balance_coin: "",
    amount_minted_token: "",
    address_node: "",
  };

  componentDidMount = async () => {
    const { getAppConfig } = this.props;
    await getAppConfig();
    this.setState(this.props.setting);
  };


  render() {
    const { balance_coin, amount_minted_token, address_node, formerror } = this.state;
    return (

        <Row>
          <Col sm="12">
            <FormGroup>
              <Label for="balance_coin" className="mb-1">Balance in the Current Cardano-node running</Label>
              <Input
                id="balance_coin"
                type="text"
                value={balance_coin}
                onChange={(e) => this.setState({ balance_coin: e.target.value })}
                disabled = "disabled" 
              />
            </FormGroup>
          </Col>
          <Col sm="12">
            <FormGroup>
              <Label for="amount_minted_token" className="mb-1">Total numbers of tokens minted</Label>
              <Input
                className="disable"
                id="amount_minted_token"
                type="number"
                value={amount_minted_token}
                onChange={(e) => this.setState({ amount_minted_token: e.target.value })}
                disabled = "disabled" 
              />
            </FormGroup>
          </Col>
          <Col sm="12">
            <FormGroup>
              <Label for="address_node" className="mb-1">Address of the Cardno node running</Label>
              <Input
                id="address_node"
                type="text"
                value={address_node}
                onChange={(e) => this.setState({ address_node: e.target.value })}
                disabled = "disabled" 
              />
            </FormGroup>
          </Col>
          <Col sm="12">
            <div className="form-error">{formerror}</div>
          </Col>
        </Row>
     
    );
  }
}

function mapStateToProps(state) {
  return {
    setting: state.setting.setting,
  };
}

export default connect(mapStateToProps, {
  getAppConfig,
  updateAppConfig,
})(Balance);
