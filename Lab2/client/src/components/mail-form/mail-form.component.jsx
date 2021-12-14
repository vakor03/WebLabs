import React from 'react';
import './mail-form.styles.css';
import Popup from '../pop-up/pop-up.component';
import Message from '../message/message.conponent';
import Spinner from '../spinner/spinner.component';
import axios from 'axios';

export class MailForm extends React.Component {
    constructor() {
        super();

        this.state = {
            isRequest: false,
            errorMsg: [],
            isSuccess: false,
            isPopupVisible: false,
            isRateLimit: false,
            name: '',
            email: '',
            message: '',
        };
    }

    handleSubmit = event => {

        event.preventDefault();
        const { name, email, message } = this.state;
        console.log(name)
        console.log(email)
        console.log(message)
        this.setState({ isRequest: true });
        this.setState({ isPopupOnScreen: true });
        axios
            .post('/api', {
                name,
                email,
                message,
            })
            .then(res => {
                this.setState({
                    popupMessages: res?.data?.data,
                    isRequest: false,
                    isSuccess: true,
                    name: '',
                    email: '',
                    message: '',
                });
            })
            .catch(error => {
                this.setState({
                    isRequest: false,
                    isSuccess: false,
                });
                this.setState({
                    popupMessages: error?.response?.data?.errors ?? [
                        { message: 'Something went wrong...' },
                    ],
                });
            });
    };

    onOkClicked = () => {
        this.setState({ isPopupOnScreen: false });
    };

    render() {
        const { name, email, message } = this.state;

        return (
            <div className="container">
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor={'email'}>Your email</label>
                    <input
                        type={'email'}
                        id={'email'}
                        name={'email'}
                        placeholder={'Your email address..'}
                        onChange={newEmail =>
                            this.setState({ email: newEmail.target.value })
                        }
                        required
                    />

                    <label htmlFor={'name'}>Name</label>
                    <input
                        type={'text'}
                        id={'name'}
                        name={'name'}
                        placeholder={'Your name..'}
                        onChange={newName => this.setState({ name: newName.target.value })}
                        required
                    />

                    <label htmlFor={'message'}>Subject</label>
                    <textarea
                        id={'message'}
                        name={'message'}
                        placeholder={'Write something..'}
                        onChange={newMsg => this.setState({ message: newMsg.target.value })}
                        required
                    />

                    <input
                        type={'submit'}
                        value={'Submit'}
                        disabled={this.state.isRequest}
                    />
                </form>

                {this.state.isPopupVisible ? (
                    <Popup>
                        {this.state.isRequest ? (
                            <Spinner />
                        ) : (
                            <Message
                                className={this.state.isSuccess}
                                onClose={this.onOkClicked}>
                                {this.state.errorMessages.map(element => (
                                    <div>{element}</div>
                                ))}
                            </Message>
                        )}
                    </Popup>
                ) : null}
            </div>
        );
    }
}
