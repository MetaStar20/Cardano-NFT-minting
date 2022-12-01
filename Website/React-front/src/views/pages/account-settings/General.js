import React from "react";
import { Button, Form, FormGroup, Input, Label, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import { getAppConfig, updateAppConfig } from "../../../redux/actions/api";

class General extends React.Component {
  state = {
    formerror: "",
    address_server: "",
    address_ipfs: "",
  };

  componentDidMount = async () => {
    const { getAppConfig } = this.props;
    await getAppConfig();
    this.setState(this.props.setting);
  };

  updateConfig = (e) => {
    e.preventDefault();
    const { address_server, address_ipfs } = this.state;
    if (!address_server) {
      this.setState({ formerror: "Interval is required" });
      return;
    }
    if (!address_ipfs) {
      this.setState({ formerror: "Discount is required" });
      return;
    }
    this.setState({ formerror: "" });
    this.props.updateAppConfig({
      address_server: address_server,
      address_ipfs: address_ipfs,
    });
  };

  render() {
    const { address_server, address_ipfs, formerror } = this.state;
    return (
      <Form className="mt-2" onSubmit={this.updateConfig}>
        <Row>
          <Col sm="12">
            <FormGroup>
              <Label for="address-wallet" className="mb-1">Wallet address that will receive NFT.</Label>
              <Input
                id="address-server"
                type="text"
                value={address_server}
                onChange={(e) => this.setState({ address_server: e.target.value })}
              />
            </FormGroup>
          </Col>
          <Col sm="12">
            <FormGroup>
              <Label for="address-ipfs" className="mb-1">Address of IPFS ( InterPlanetary File System )</Label>
              <Input
                id="address-ipfs"
                type="text"
                disabled = "disabled" 
                value={address_ipfs}
                onChange={(e) => this.setState({ address_ipfs: e.target.value })}
              />
            </FormGroup>
          </Col>
          <Col sm="12">
            <div className="form-error">{formerror}</div>
          </Col>
          <Col className="d-flex justify-content-start flex-wrap" sm="12">
            <Button.Ripple className="mr-50" type="submit" color="primary">
              Save Changes
            </Button.Ripple>
          </Col>
        </Row>
      </Form>
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
})(General);
