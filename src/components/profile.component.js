import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import CheckButton from "react-validation/build/button";
import Form from "react-validation/build/form";


const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};


const vusername = value => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vpassword = value => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};


export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);

    this.state = {
      username: "",
      password: "",
      email: "",
      successful: false,
      message: ""
    };
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }


  handleUpdate(e) {
    e.preventDefault();
  
    this.setState({
      message: "",
      successful: false
    });

    this.form.validateAll();
  
    if (this.checkBtn.context._errors.length === 0) {
      UserService.updateUser(
        this.state.username,
        this.state.password,
      ).then(
        response => {
          this.setState({
            successful: true
          });

          AuthService.logout();

          window.location.href = "/login?changedCredentials=true";

        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
  
          this.setState({
            successful: false,
            message: resMessage,
          });
        }
      );
    }
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

  if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })
  }

  handleEditClick = () => {
    this.setState({ isEditing: true });
  };

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }
    

    const { currentUser, isEditing } = this.state;

    return (
      <div className="container">
        {this.state.userReady ? (
          <div>
            <header className="jumbotron">
              <h3>
                <strong>{currentUser.username}</strong> Profile
              </h3>
            </header>
            <p>
              <strong>Token:</strong>{" "}
              {currentUser.accessToken.substring(0, 20)} ...{" "}
              {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
            </p>
            <p>
              <strong>Id:</strong> {currentUser.id}
            </p>
            <p>
              <strong>Email:</strong> {currentUser.email}
            </p>
            <strong>Authorities:</strong>
            <ul>
              {currentUser.roles &&
                currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
            </ul>
            {isEditing ? (
                <div>
                <Form onSubmit={this.handleUpdate} ref={c => {
                  this.form = c;
                }}>
                  {!this.state.successful && (
                    <div>
                      <div className="form-group">
                        <label htmlFor="newUsername">Nuevo Nombre de Usuario</label>
                        <input 
                        type="text"
                        className="form-control"
                        name="username"
                        value={this.state.username}
                        onChange={this.onChangeUsername}
                        validations={[vusername]} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="newPassword">Nueva Contraseña</label>
                        <input 
                        type="password" 
                        className="form-control"
                        id="newPassword"
                        value={this.state.password}
                        onChange={this.onChangePassword}
                        validations={[required, vpassword]} 
                        />
                      </div>
                      <div className="form-group">
                        <button className="btn btn-primary btn-block">Actualizar</button>
                      </div>
                    </div>
                  )}

                  {this.state.message && (
                    <div className="form-group">
                      <div
                        className={
                          this.state.successful
                            ? "alert alert-success"
                            : "alert alert-danger"
                        }
                        role="alert"
                      >
                        {this.state.message}
                      </div>
                    </div>
                  )}
                  <CheckButton style={{ display: "none" }} ref={(c) => (this.checkBtn = c)} />
                </Form>
              </div>
            ) : (
              <button onClick={this.handleEditClick}>Editar Información</button>
            )}
          </div>
        ) : null}
      </div>
    );
  }
} 