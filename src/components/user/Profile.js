import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import { withRouter } from "react-router-dom";
import {Button, ButtonSecondary} from "../../views/design/Button";
import { handleError } from "../../helpers/handleError";
import {catchError} from "../../helpers/catchError";
import {CustomDatePicker} from "../../views/design/DatePicker";
import "react-datepicker/dist/react-datepicker.css";

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: fit-content;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  height: fit-content;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  padding-top: 37px;
  padding-bottom: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

/**
 * Classes in React allow you to have an internal state within the class and to have the React life-cycle for your component.
 * You should have a class (instead of a functional component) when:
 * - You need an internal state that cannot be achieved via props from other parent components
 * - You fetch data from the server (e.g., in componentDidMount())
 * - You want to access the DOM via Refs
 * https://reactjs.org/docs/react-component.html
 * @Class
 */
class Profile extends React.Component {
  /**
   * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
   * The constructor for a React component is called before it is mounted (rendered).
   * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: username and password
   * These fields are then handled in the onChange() methods in the resp. InputFields
   */
  constructor(props) {
    super(props);
    this.state = {
      id : null,
      username : null,
      name : null,
      password : null,
      password_confirm: null,
      createdOn : null,
      status : null,
      birthday : null
    };
  }
  /**
   * HTTP POST request is sent to the backend.
   * If the request is successful, a new user is returned to the front-end and its token is stored in the localStorage.
   */
  update() {

    fetch(`${getDomain()}/users/${this.state.id}`, {
      method: "PUT",
      headers: new Headers({
        'Authorization': localStorage.getItem("token"),
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        name: this.state.name,
        username: this.state.username,
        password: this.state.password,
        birthday: this.state.birthday
      })
    }) .catch(catchError);
  }
  /**
   *  Every time the user enters something in the input field, the state gets updated.
   * @param key (the key of the state for identifying the field that needs to be updated)
   * @param value (the value that gets assigned to the identified state key)
   */
  handleInputChange(key, value) {
    // Example: if the key is password, this statement is the equivalent to the following one:
    // this.setState({'password': value});
    this.setState({ [key]: value });
  }

  isLoggedInUser() {
    return parseInt(this.state.id, 10) === parseInt(localStorage.getItem("user_id"), 10);
  }

  /**
   * componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
   * Initialization that requires DOM nodes should go here.
   * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
   * You may call setState() immediately in componentDidMount().
   * It will trigger an extra rendering, but it will happen before the browser updates the screen.
   */
  componentDidMount() {

    // we get the user Id from the url params
    var userId = this.props.match.params.userId;

    // fetch user details for specific user
    fetch(`${getDomain()}/users/${userId}`, {
      method: "GET",
      headers: new Headers({
        'Authorization': localStorage.getItem("token"),
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
    })
        .then(handleError)
        .then(response => response.json())
        .then(returnedUser => {

          // Check if
          // set all key, value paris in state
          for (var key in returnedUser) {
            this.handleInputChange(key, returnedUser[key]);
          }
        })
        .catch(catchError);
  }


  render() {
    return (
      <BaseContainer>
        <FormContainer>
          {}
          <Form>
            <Label>ID</Label>
            <InputField
                id="id"
                disabled
                value={this.state.id}
            />
            <Label>Name *</Label>
            <InputField
                id="name"
                disabled={!this.isLoggedInUser()}
                value={this.state.name}
                onChange={e => {
                this.handleInputChange("name", e.target.value);
              }}
            />
            <Label>Username *</Label>
            <InputField
                id="username"
                disabled={!this.isLoggedInUser()}
                value={this.state.username}
                onChange={e => {
                  this.handleInputChange("username", e.target.value);
                }}
            />
            <Label>Date of Birth</Label>
            <CustomDatePicker
                id="birthday"
                disabled={!this.isLoggedInUser()}
                selected={this.state.birthday}
                dateFormat="dd.MM.yyyy"
                onChange={e => {
                  this.handleInputChange("birthday", e)
                }}
            />
            <Label>Created</Label>
            <CustomDatePicker
                id="createdOn"
                selected={this.state.createdOn}
                dateFormat="d. MMMM yyyy  hh:mm"
                disabled
            />
            <Label>Status</Label>
            <InputField
                id="status"
                value={this.state.status}
                disabled
            />

              {this.isLoggedInUser() ? (
               <div>
                    <Label>New Password</Label><br/>
                    <InputField
                        id="password"
                        value={this.state.password}
                        onChange={e => {
                          this.handleInputChange("password", e.target.value);
                        }}
                    /><br/>

                 <Label>Confirm new Password</Label><br/>

                 <InputField
                        id="password_confirm"
                        value={this.state.password_confirm}
                        onChange={e => {
                          this.handleInputChange("password_confirm", e.target.value);
                        }}
                    /><br/>
                 <ButtonContainer>
                   <Button
                       disabled={!this.state.username || !this.state.name || !(this.state.password === this.state.password_confirm)}
                       width="50%"
                       onClick={() => {
                         this.update();
                       }}
                   >
                     Save
                   </Button>
                 </ButtonContainer>
               </div>

              ) : (
                  <div></div>
              )}

            <ButtonContainer>
              <ButtonSecondary
                  width="50%"
                  onClick={() => {
                    this.props.history.push("/game");

                  }}
              >
                Back
              </ButtonSecondary>
            </ButtonContainer>
          </Form>
        </FormContainer>
      </BaseContainer>
    );
  }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Profile);
