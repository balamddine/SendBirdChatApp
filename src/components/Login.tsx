import React from "react";
import { Form, Input, Button, Header, Segment } from 'semantic-ui-react';
import { Redirect } from "react-router";
import Messages from "../Helpers/Messages";
import userStore from "../Store/UsersStore";
import "../css/styles.css"
class Login extends React.Component<any, any> {

    state = {
        data: {
            Username: "",
            Password: ""
        },
        verrors: {}
    };
  
    handleSubmit = (event: any) => {
        event.preventDefault();
        const verrors = this.validate(this.state.data);
        this.setState({ verrors }); //if there are errors, display them
        if (Object.keys(verrors).length === 0) { // no errors
            this.props.userStore.login(this.state.data)         
        }

    }
    validate = (data: any) => {
        const errors: any = {};
        if (!data.Username)
            errors.Username = "Username is required";
        if (!data.Password)
            errors.Password = "Password is required";
        return errors;
    };
    onChange = (e: any) => this.setState({
        data: { ...this.state.data, [e.target.name]: e.target.value }
    });
    render() {
        const { data, verrors }: any = this.state;
        const { isFormLoading, usersData, error }: any = this.props.userStore;
        if (usersData) {
            return <Redirect to={{ pathname: "/Chat" }} />
        }
        return (
            <>

                <div className="loginContainer">
                    <Header as='h2'>
                       
                        <Header.Content>Log-in to your account</Header.Content>
                    </Header>
                    <Form onSubmit={this.handleSubmit} loading={isFormLoading}>
                        <Segment>
                            <Form.Input
                                name="Username"
                                label='Username'
                                placeholder='Username'
                                control={Input}
                                icon='user'
                                iconPosition='left'
                                onChange={this.onChange}
                                value={data.Username}
                                error={verrors.Username}
                            >
                            </Form.Input>
                            <Form.Input
                                name="Password"
                                label='Password'
                                type="password"
                                control={Input}
                                placeholder='Password'
                                icon='lock'
                                iconPosition='left'
                                onChange={this.onChange}
                                value={data.Password}
                                error={verrors.Password}
                            >
                            </Form.Input>
                            <Button type='submit' primary>Submit</Button>
                        </Segment>
                    </Form>
                    {
                        error && (
                            <Messages
                                isError={true}
                                headerText={undefined}
                                bodyText='This user does not exists.'
                            />
                        )
                    }
                </div>
            </>
        )
    }
}

const withStore = (BaseComponent:any) => (props:any) => {
    const store = userStore();
    return <BaseComponent {...props} userStore={store} />;
  };


export default withStore(Login);


