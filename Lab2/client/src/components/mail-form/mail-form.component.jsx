import React from 'react';
import './mail-form.styles.css';
import Popup from '../pop-up/pop-up.component';
import Spinner from '../spinner/spinner.component';
import axios from 'axios';

export class MailForm extends React.Component {
    constructor() {
        super();

        this.state = {
            isRequest: false,
            popupMessages: [],
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
        const {name, email, message} = this.state;
        this.setState({isRequest: true});
        this.setState({isPopupVisible: true});
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
                        {message: 'Something went wrong...'},
                    ],
                });
            });
    };


    render() {
        const {name, email, message, popupMessages} = this.state;

        return (
            <>
                {this.state.isRequest ? (<Spinner></Spinner>) : null}
                <Popup active={(this.state.isPopupVisible && !this.state.isRequest)} setActive={(newValue) =>
                    this.setState({isPopupVisible: newValue})
                }>
                    {popupMessages.map((msg) => (<p>{msg}</p>))}

                </Popup>

                <div className={(!this.state.isPopupVisible && !this.state.isRequest)? "container active":"container" }>

                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor={'email'}>Your email</label>
                        <input
                            type={'email'}
                            id={'email'}
                            name={'email'}
                            placeholder={'Your email address..'}
                            onChange={newEmail =>
                                this.setState({email: newEmail.target.value})
                            }
                            required
                        />

                        <label htmlFor={'name'}>Name</label>
                        <input
                            type={'text'}
                            id={'name'}
                            name={'name'}
                            placeholder={'Your name..'}
                            onChange={newName => this.setState({name: newName.target.value})}
                            required
                        />

                        <label htmlFor={'message'}>Subject</label>
                        <textarea
                            id={'message'}
                            name={'message'}
                            placeholder={'Write something..'}
                            onChange={newMsg => this.setState({message: newMsg.target.value})}
                            required
                        />

                        <input
                            type={'submit'}
                            value={'Submit'}
                            disabled={this.state.isRequest}
                        />
                    </form>
                </div>
            </>
        );
    }
}
