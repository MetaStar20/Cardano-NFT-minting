import React from "react";
import { connect } from "react-redux";
import { Card, CardBody, Row, Col, Spinner, Button } from "reactstrap";
import { updateRunStatus,getAppConfig } from "../../redux/actions/api";

class RunStatus extends React.Component {
  state = {
    loading: false,
  };

  onRunScraping = async () => {
    this.setState({ loading: true });
    const status = this.props.setting.run_scrape ? 0 : 1;
    await this.props.updateRunStatus(status);
    this.setState({ loading: false });
  };

  componentDidMount = async () => {
    const { getAppConfig } = this.props;
    await getAppConfig();
    this.setState(this.props.setting);
  };


  render() {
    const { setting } = this.props;
    const { loading } = this.state;
    const status = setting.run_scrape;

    return (
      <Card className="mb-2">
        <CardBody>
          <Row>
            <Col className="run-status-block">
              {status === 1 && <span>Cardano node is running now</span>}
              {status !== 1 && <span>Cardano node is not running now</span>}
              <Button.Ripple color="danger" style={{ width: "180px" }} onClick={this.onRunScraping}>
                {loading && (
                  <Spinner
                    style={{ width: "1.2rem", height: "1.2rem" }}
                    color="light"
                  />
                )}
                {!loading && status === 1 && "Stop Running"}
                {!loading && status !== 1 && "Start Running"}
              </Button.Ripple>
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return {
    setting: state.setting.setting,
  };
}

export default connect(mapStateToProps, {
  updateRunStatus,getAppConfig
})(RunStatus);
