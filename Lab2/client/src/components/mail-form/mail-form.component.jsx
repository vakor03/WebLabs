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
            recipient: '',
            msg: '',
        };
    }

    handleSubmit = event => {
        event.preventDefault();
        const { name, email, message } = this.state;
        this.setState({ isRequest: true });
        this.setState({ isPopupOnScreen: true });
        axios
            .post('/api', {
                name,
                recipient,
                msg,
            })
            .then(res => {
                this.setState({
                    errorMessages: res.data.errorMessages,
                    isRequest: false,
                    isSuccess: true,
                    name: '',
                    recipient: '',
                    msg: '',
                });
            })
            .catch(error => {
                this.setState({
                    isRequest: false,
                    isSuccess: false,
                });

                if (!error?.response?.data) {
                    this.setState({
                        errorMessages: ['Something went wrong...'],
                    });
                    return;
                }
                this.setState({
                    errorMessages: error.response.data.errorMessages ?? [
                        'Something went wrong...',
                    ],
                });
            });
    };

    onOkClicked = () => {
        this.setState({ isPopupOnScreen: false });
    };

    render() {
        const { name, recipient, msg } = this.state;

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
                            this.setState({ recipient: newEmail })
                        }
                        required
                    />

                    <label htmlFor={'name'}>Name</label>
                    <input
                        type={'text'}
                        id={'name'}
                        name={'name'}
                        placeholder={'Your name..'}
                        onChange={newName => this.setState({ name: newName })}
                        required
                    />

                    <label htmlFor={'message'}>Subject</label>
                    <textarea
                        id={'message'}
                        name={'message'}
                        placeholder={'Write something..'}
                        onChange={newMsg => this.setState({ msg: newMsg })}
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
