import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { createNotification } from "../../redux/actions/api/api";
import ImageUpload from "../../components/@vuexy/upload/ImageUpload";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Input,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Button,
  Spinner,
} from "reactstrap";
import { AgGridReact } from "ag-grid-react";
import * as Icon from "react-feather";
import { Link } from "react-router-dom";
import { listNFT, createNFT } from "../../redux/actions/api";
import { history } from "../../history";
import "../../assets/scss/plugins/tables/_agGridStyleOverride.scss";

class Search extends React.Component {
  state = {
    newTitle: "",
    newDescription: "",
    newAuthor: "",
    newWebUrl: "",
    loading_mint: false,
    loading: false,
    pageSize: 10,
    isVisible: true,
    reload: false,
    defaultColDef: {
      sortable: true,
    },
    searchVal: "",
    columnDefs: [
      {
        headerName: "ID",
        field: "index",
        width: 100,
        suppressSizeToFit: true,
      },
      {
        headerName: "Image",
        field: "web_url",
        filter: true,
        width: 100,
        minWidth: 120,
        cellRendererFramework: params => {
          return (
            <div>
              <img
              src={params.data.ipfs_url}
              className="round"
              height="40"
              width="40"
              alt="avatar"
            /></div>
          )
        }
      },
      {
        headerName: "Title",
        field: "title",
        filter: true,
        width: 100,
        minWidth: 180,
        cellRendererFramework: params => {
          return (
            <div className="title" title={params.data.title}>{params.data.title}</div>
          )
        }
      },
      {
        headerName: "Description",
        field: "description",
        filter: true,
        width: 300,
        minWidth: 120,
        cellRendererFramework: params => {
          return (
            <div className="description" title={params.data.description}>{params.data.description}</div>
          )
        }
      },
      {
        headerName: "Minted Time",
        field: "minted_time",
        filter: true,
        width: 150,
        minWidth: 120,
        cellRendererFramework: params => {
          return (
            <span className="minted_time">{params.data.minted_time &&
              moment(params.data.minted_time).format("YYYY-MM-DD HH:mm:ss")}</span>
          )
        }
      },
      {
        headerName: "Token",
        field: "token_url",
        filter: true,
        width: 350,
        minWidth: 250,
        cellRendererFramework: params => {
          return (
            <div className="token-url" title={params.data.token_url}>{params.data.token_url}</div>
          )
        }
      },
    ],
    uploadFiles: [],
  };

  componentDidMount = () => {
    this.listNFTs();
  };

  componentWillUnmount() {
    // Make sure to revoke the data uris to avoid memory leaks
   
  }

  /**
   * Image Upload....
   * */
   addFile = file => {
    this.setState({
      uploadFiles: file.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      )
    });

    this.setState({ newTitle : file[0].name.substring(0, file[0].name.lastIndexOf("."))})
    console.log(this.state.uploadFiles);
  };


  listNFTs = async () => {
    this.setState({ loading: true });
    await this.props.listNFT();
    this.setState({ loading: false });
  };

  onChangeTitle = (e) => {
    this.setState({ newTitle: e.target.value });
  };

  onChangeDescription = (e) => {
    this.setState({ newDescription: e.target.value });
  };


  onChangeAuthor = (e) => {
    this.setState({ newAuthor: e.target.value });
  };

  onChangeWebUrl = (e) => {
    this.setState({ newWebUrl: e.target.value });
  };


  onAddNewLink = async () => {
    const { newTitle, newDescription, newAuthor, newWebUrl, uploadFiles } = this.state;
    if (!newTitle){
      createNotification("info", "Please input the NFT name !");
      return;
    } 
    this.setState({ loading_mint: true });
    await this.props.createNFT(newTitle, newDescription, newAuthor, newWebUrl, uploadFiles[0]);
    this.setState({ loading_mint: false });
    this.props.listNFT();
    this.setState({ newTitle: "" });
    this.setState({ newDescription: "" });
    this.setState({ newWebUrl: "" });
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

  gotoSearchDetail = (id) => {
    history.push(`/search/${id}`);
  };

  onSelectRow = () => {
    var selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows.length === 0) return
    history.push(`/search/${selectedRows[0].id}`);
  }

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
    const { searches } = this.props;
    const {
      loading,
      loading_mint,
      newTitle,
      newAuthor,
      newDescription,
      newWebUrl,
      columnDefs,
      defaultColDef,
      pageSize,
      uploadFiles,
    } = this.state;
    return (
      <React.Fragment>
        <Card>
          <CardHeader>
            <CardTitle>NFT Details
            {loading_mint && (
              <Button.Ripple color="primary"  className="ml-3">
                  <Spinner
                    style={{ width: "1.2rem", height: "1.2rem" }}
                    color="light"
                  /></Button.Ripple>
                )}
                {!loading_mint && <Button.Ripple color="primary" onClick={this.onAddNewLink} className="ml-3">
                  Mint NFT</Button.Ripple>}
            </CardTitle>
          </CardHeader>
          <CardBody>
          <Row>
              <Col md="2" sm="12" className="mt-1">
                <ImageUpload addFile={this.addFile} files={uploadFiles} />
              </Col>
              <Col md="8" sm="12" className="minted_content">
                <Row>
                  <Col md="6" sm="12" className="mt-1">
                    <Input 
                          onChange={this.onChangeTitle}
                          value={newTitle}
                          placeholder="Title(Don't use special character)"
                    />
                  </Col>  
                  <Col md="6" sm="12" className="mt-1">
                    <Input 
                      onChange={this.onChangeDescription}
                      value={newDescription}
                      placeholder="Description"
                    />
                  </Col>
                </Row>
                <Row>
                <Col md="6" sm="12" className="mt-1">
                  <Input 
                    onChange={this.onChangeAuthor}
                    value={newAuthor}
                    placeholder="Author"/>
                  </Col>
                  <Col md="6" className="mt-1">
                    <Input 
                        onChange={this.onChangeWebUrl}
                        value={newWebUrl}
                        placeholder="Web link"/>
                  </Col>
                </Row>
              </Col>
            </Row>

          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              NFT Lists{" "}
              {!loading && (
                <Link to="#" onClick={this.listNFTs} title="refresh">
                  <Icon.RotateCw size={16} className="fonticon-wrap" />
                </Link>
              )}
              {loading && (
                <Spinner
                  style={{ width: "1.2rem", height: "1.2rem" }}
                  color="primary"
                />
              )}
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="ag-theme-material ag-grid-table">
              <div className="ag-grid-actions d-flex justify-content-between flex-wrap mb-1">
                <div className="sort-dropdown">
                  <UncontrolledDropdown className="ag-dropdown p-1">
                    <DropdownToggle tag="div">
                      1 - {pageSize} of {searches.length}
                      <Icon.ChevronDown className="ml-50" size={15} />
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem
                        tag="div"
                        onClick={() => this.filterSize(5)}
                      >
                        5
                      </DropdownItem>
                      <DropdownItem
                        tag="div"
                        onClick={() => this.filterSize(10)}
                      >
                        10
                      </DropdownItem>
                      <DropdownItem
                        tag="div"
                        onClick={() => this.filterSize(20)}
                      >
                        20
                      </DropdownItem>
                      <DropdownItem
                        tag="div"
                        onClick={() => this.filterSize(50)}
                      >
                        50
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              </div>
              <AgGridReact
                gridOptions={{}}
                rowSelection="single"
                defaultColDef={defaultColDef}
                columnDefs={columnDefs}
                rowData={searches}
                onGridReady={this.onGridReady}
                colResizeDefault={"shift"}
                animateRows={true}
                pagination={true}
                pivotPanelShow="always"
                paginationPageSize={pageSize}
                resizable={true}
                onSelectionChanged={this.onSelectRow}
              />
            </div>
          </CardBody>
        </Card>

      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    searches: state.search.searches,
  };
}

export default connect(mapStateToProps, {
  listNFT,
  createNFT,
})(Search);
