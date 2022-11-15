import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";
import {
  Button,
  Col,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import styled from "styled-components";
import Icon from "../../components/Icon";
import Loading from "../../components/Loading";
import Pagination from "../../components/PaginationComp";
import * as Form from "../sharedStyles/formStyles";
import * as Table from "../sharedStyles/tableStyles";

const Styled = {
  Button: styled(Button)`
    background: white;
    border: none;
  `,
  Container: styled.div`
    width: 100%;
    height: 100%;
    margin: auto;
  `,
  ul: styled.ul`
    list-style-type: none;
  `,
  List: styled.li`
    padding-bottom: 120px;
  `,
};

class UserTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userSelectedForEdit: null,
      first_name: "",
      last_name: "",
      phone_number: 0,
      date_of_birth: 0,
      zip_code: 0,
      address: "",
      city: "",
      state: "",
      notes: "",
      currentPage: 0,
      pageSize: 10,
      pageCount: 1,
    };
  }

  onDisplayEditUserModal = (userToEdit) => {
    this.setState({
      userSelectedForEdit: userToEdit,
    });
  };

  deleteUser = (id) => {
    // deleteUser(id);
    this.props.deleteUserCallback(id);
  };

  onModalClose = () => {
    this.setState({
      userSelectedForEdit: null,
    });
  };

  updatePage = (pageNum) => {
    this.setState({
      currentPage: pageNum,
    });
  };

  getPageCount = () => {
    this.setState({
      pageCount: Math.ceil(this.props.users.length / this.pageSize),
    });
  };

  componentDidMount = () => {
    console.log(this.props.users.length);
    this.setState({
      pageCount: this.getPageCount(),
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let newUser = {
      _id: this.state.userSelectedForEdit._id,
      name:
        (this.state.userSelectedForEdit && this.state.first_name
          ? this.state.first_name
          : this.state.userSelectedForEdit.first_name) +
        " " +
        (this.state.userSelectedForEdit && this.state.last_name
          ? this.state.last_name
          : this.state.userSelectedForEdit.last_name),
      email: this.state.userSelectedForEdit.email,
      first_name:
        this.state.userSelectedForEdit && this.state.first_name
          ? this.state.first_name
          : this.state.userSelectedForEdit.first_name,
      last_name:
        this.state.userSelectedForEdit && this.state.last_name
          ? this.state.last_name
          : this.state.userSelectedForEdit.last_name,
      phone_number:
        this.state.userSelectedForEdit && this.state.phone_number
          ? this.state.phone_number
          : this.state.userSelectedForEdit.phone_number,
      date_of_birth:
        this.state.userSelectedForEdit && this.state.date_of_birth
          ? this.state.date_of_birth
          : this.state.userSelectedForEdit.date_of_birth,
      zip_code:
        this.state.userSelectedForEdit && this.state.zip_code
          ? this.state.zip_code
          : this.state.userSelectedForEdit.zip_code,
      address:
        this.state.userSelectedForEdit && this.state.address
          ? this.state.address
          : this.state.userSelectedForEdit.address,
      city:
        this.state.userSelectedForEdit && this.state.city
          ? this.state.city
          : this.state.userSelectedForEdit.city,
      state:
        this.state.userSelectedForEdit && this.state.state
          ? this.state.state
          : this.state.userSelectedForEdit.state,
      notes:
        this.state.userSelectedForEdit && this.state.notes
          ? this.state.notes
          : this.state.userSelectedForEdit.notes,
    };
    this.onModalClose();
    this.props.editUserCallback(newUser);
  };

  render() {
    const { users, loading } = this.props;
    return (
      <Table.Container style={{ width: "100%", maxWidth: "none" }}>
        <Table.Table>
          <tbody>
            <tr>
              <th style={{ color: "#960034" }}>Volunteer Name</th>
              <th style={{ color: "#960034" }}>Email Address</th>
              <th style={{ color: "#960034" }}>Phone Number</th>
            </tr>
            {users
              .slice(
                this.state.currentPage * this.state.pageSize,
                (this.state.currentPage + 1) * this.state.pageSize
              )
              .map((user, index) => (
                <Table.Row key={index} evenIndex={index % 2 === 0}>
                  <td>{user.name}</td>
                  <td>
                    {user.email}
                    <Styled.Button
                      onClick={() => {
                        navigator.clipboard.writeText(user.email);
                      }}
                    >
                      <Icon color="grey3" name="copy" />
                    </Styled.Button>
                  </td>
                  <td>
                    {user.phone_number
                      ? user.phone_number.substr(0, 3) +
                        "-" +
                        user.phone_number.substr(3, 3) +
                        "-" +
                        user.phone_number.substr(6, 4)
                      : ""}
                  </td>
                  <td>
                    <Styled.Button
                      onClick={() => this.onDisplayEditUserModal(user)}
                    >
                      <Icon color="grey3" name="create" />
                    </Styled.Button>
                    {/*<Styled.Button onClick={() => this.deleteUser(user._id)}>*/}
                    {/*  <Icon color="grey3" name="delete" />*/}
                    {/*</Styled.Button>*/}
                    <Link href={`stats/${user._id}`}>
                      <Styled.Button>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_2204_28336)">
                            <path
                              d="M5.04892 17.99L10.2446 12.7856L13.7084 16.2494L21.0689 7.97098L19.848 6.75L13.7084 13.6516L10.2446 10.1878L3.75 16.6911L5.04892 17.99Z"
                              fill="#960034"
                            />
                            <line
                              x1="0.975"
                              y1="1"
                              x2="0.975"
                              y2="22.5"
                              stroke="#960034"
                              strokeWidth="1.7"
                            />
                            <line
                              x1="0.25"
                              y1="21.65"
                              x2="22.75"
                              y2="21.65"
                              stroke="#960034"
                              strokeWidth="1.7"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_2204_28336">
                              <rect width="24" height="24" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </Styled.Button>
                    </Link>
                  </td>
                </Table.Row>
              ))}
          </tbody>
        </Table.Table>
        {loading && <Loading />}
        <Modal
          style={{ "max-width": "750px" }}
          isOpen={this.state.userSelectedForEdit}
          onClose={null}
        >
          <ModalHeader color="#ef4e79">
            {this.state.userSelectedForEdit
              ? this.state.userSelectedForEdit.name
              : ""}
          </ModalHeader>
          <Container>
            <ModalBody>
              <form>
                <Form.FormGroup>
                  <Row>
                    <Col>
                      <Form.Label>First Name</Form.Label>
                      <Form.Input
                        defaultValue={
                          this.state.userSelectedForEdit
                            ? this.state.userSelectedForEdit.first_name
                            : ""
                        }
                        type="text"
                        name="Name"
                        onChange={(evt) =>
                          this.setState({ first_name: evt.target.value })
                        }
                      />
                    </Col>
                    <Col>
                      <Form.Label>Last Name</Form.Label>
                      <Form.Input
                        defaultValue={
                          this.state.userSelectedForEdit
                            ? this.state.userSelectedForEdit.last_name
                            : ""
                        }
                        type="text"
                        name="Name"
                        onChange={(evt) =>
                          this.setState({ last_name: evt.target.value })
                        }
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Label>Email</Form.Label>
                      <Form.Input
                        disabled="disabled"
                        defaultValue={
                          this.state.userSelectedForEdit
                            ? this.state.userSelectedForEdit.email
                            : ""
                        }
                        type="text"
                        name="Email"
                      />
                    </Col>
                    <Col>
                      <Form.Label>Phone</Form.Label>
                      <Form.Input
                        defaultValue={
                          this.state.userSelectedForEdit
                            ? this.state.userSelectedForEdit.phone_number
                            : ""
                        }
                        type="text"
                        name="Phone"
                        onChange={(evt) =>
                          this.setState({ phone_number: evt.target.value })
                        }
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Form.Label>Date of Birth</Form.Label>
                      <Form.Input
                        defaultValue={
                          this.state.userSelectedForEdit
                            ? this.state.userSelectedForEdit.date_of_birth
                            : ""
                        }
                        type="text"
                        name="Date of Birth"
                        onChange={(evt) =>
                          this.setState({ date_of_birth: evt.target.value })
                        }
                      />
                    </Col>
                    <Col>
                      <Form.Label>Zip Code</Form.Label>
                      <Form.Input
                        defaultValue={
                          this.state.userSelectedForEdit
                            ? this.state.userSelectedForEdit.zip_code
                            : ""
                        }
                        type="text"
                        name="Zip Code"
                        onChange={(evt) =>
                          this.setState({ zip_code: evt.target.value })
                        }
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Label>Address</Form.Label>
                      <Form.Input
                        defaultValue={
                          this.state.userSelectedForEdit
                            ? this.state.userSelectedForEdit.address
                            : ""
                        }
                        type="text"
                        name="Address"
                        onChange={(evt) =>
                          this.setState({ address: evt.target.value })
                        }
                      />
                    </Col>
                    <Col>
                      <Form.Label>City</Form.Label>
                      <Form.Input
                        defaultValue={
                          this.state.userSelectedForEdit
                            ? this.state.userSelectedForEdit.city
                            : ""
                        }
                        type="text"
                        name="City"
                        onChange={(evt) =>
                          this.setState({ city: evt.target.value })
                        }
                      />
                    </Col>
                    <Col>
                      <Form.Label>State</Form.Label>
                      <Form.Input
                        defaultValue={
                          this.state.userSelectedForEdit
                            ? this.state.userSelectedForEdit.state
                            : ""
                        }
                        type="text"
                        name="State"
                        onChange={(evt) =>
                          this.setState({ state: evt.target.value })
                        }
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Label>Notes</Form.Label>
                      <Form.Input
                        defaultValue={
                          this.state.userSelectedForEdit
                            ? this.state.userSelectedForEdit.notes
                            : ""
                        }
                        type="textarea"
                        onChange={(evt) =>
                          this.setState({ notes: evt.target.value })
                        }
                      />
                    </Col>
                  </Row>
                </Form.FormGroup>
              </form>
            </ModalBody>
          </Container>
          <ModalFooter>
            <Button color="secondary" onClick={this.onModalClose}>
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: "#ef4e79" }}
              onClick={this.handleSubmit}
            >
              Update
            </Button>
          </ModalFooter>
        </Modal>

        <Pagination
          users={users}
          pageSize={this.state.pageSize}
          loading={this.props.loading}
          currentPage={this.state.currentPage}
          updatePage={this.updatePage}
        />
      </Table.Container>
    );
  }
}

export default UserTable;

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  editUserCallback: PropTypes.func.isRequired,
  deleteUserCallback: PropTypes.func.isRequired,
};
