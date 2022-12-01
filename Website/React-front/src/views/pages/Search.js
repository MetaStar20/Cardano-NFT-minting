import React from "react";
import { connect } from "react-redux";
import {
  getNFT,
  listProduct,
  updateSearch,
  deleteSearch,
} from "../../redux/actions/api";
import moment from "moment";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  Media,
  Button,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import * as Icon from "react-feather";
import "../../assets/scss/plugins/tables/_agGridStyleOverride.scss";

class Search extends React.Component {

  state = {
    search: {},
  };

  componentDidMount = async () => {
    const id = this.props.match.params.searchId;
    const res = await this.props.getNFT(id);
    this.setState({ search: res });
  };


  showStatus = (status) => {
    switch (status) {
      case 0:
        return "disable";
      case 1:
        return "active";
      case 2:
        return "searching";
      default:
        return "";
    }
  };

  toggleModal = () => {
    this.setState({ showDeleteModal: !this.state.showDeleteModal });
  };



  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit()
  };

  filterData = (column, val) => {
    var filter = this.gridApi.getFilterInstance(column);
    var modelObj = null;
    if (val !== "all") {
      modelObj = {
        type: "equals",
        filter: val,
      };
    }
    filter.setModel(modelObj);
    this.gridApi.onFilterChanged();
  };

  filterSize = (val) => {
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(Number(val));
      this.setState({
        pageSize: val,
      });
    }
  };
  updateSearchQuery = (val) => {
    this.gridApi.setQuickFilter(val);
    this.setState({
      searchVal: val,
    });
  };

  render() {
    const { search } = this.state;
    return (
      <React.Fragment>
        <Card>
          <CardHeader>
            <CardTitle>
             <div className="token_url"><a href={search.token_url}>Token detail</a></div>
            </CardTitle>
          </CardHeader>
          <CardBody>
            <Media body>
              <Row className="nft-detail">
                <Col sm="9" md="5">
                  <div className="d-flex user-info p-4">
                      <img
                        src={search.ipfs_url}
                        className="round image-detail"
                        alt="avatar"
                      />
                  </div>
                </Col>
                <Col sm="9" md="7">
                  <Row className="center-block">
                    <span className="title">{search.title}</span>
                  </Row>
                  <Row>
                    <div className="minted_time mr-3">created on {search.minted_time &&
                                moment(search.minted_time).format(
                                  "YYYY-MM-DD HH:mm:ss"
                                )}</div>
                  </Row>
                  <Row>
                    <div className="description ml-2 mr-3 mt-3 mb-2">{search.description}</div>
                  </Row>
                  <Row>
                    <div className="author ml-2">By {search.author}</div>
                  </Row>
                  <Row>
                  </Row>
                </Col>
              </Row>
              <Row>
                  <div className="ipfs_address ml-5 mb-2 mt-2" style={{ wordBreak: "break-all" }}><b>IPFS Address : </b><a href={search.ipfs_url}>{search.ipfs_url}</a></div>
              </Row>
              <Row>
                 <div className="sent_address ml-5" style={{ wordBreak: "break-all" }}><b>Sent Wallet Address :</b> {search.sent_address}</div>
              </Row>
            </Media>
          </CardBody>
        </Card>
       
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    
  };
}

export default connect( mapStateToProps, {
  getNFT,
  listProduct,
  updateSearch,
  deleteSearch,
})(Search);
