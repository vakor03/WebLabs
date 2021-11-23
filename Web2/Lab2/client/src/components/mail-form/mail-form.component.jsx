import React from 'react';
import './mail-form.styles.css';

export const MailForm = () => (
    <div className="container">
        <form>
            <label htmlFor={'email'}>Your email</label>
            <input
                type={'email'}
                id={'email'}
                name={'email'}
                placeholder={'Your email address..'}
            />

            <label htmlFor={'topic'}>Topic</label>
            <input
                type={'text'}
                id={'topic'}
                name={'topic'}
                placeholder={'Message topic..'}
            />

            <label htmlFor={'subject'}>Subject</label>
            <textarea
                id={'subject'}
                name={'subject'}
                placeholder={'Write something..'}
            />

            <input type={'submit'} value={'Submit'} />
        </form>
    </div>
);
