import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import AlertMessages from '../util/AlertMessages';


const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
const uuidv1 = require('uuid/v1');
const INCREMENT_COMMAND_WORK = "/api/tips/";
const HTML_TAGS_TO_REPLACE = [{ '>': '&gt;' }, { '<': '&lt;' }];

const ListCommand = ({ content }) => {

    const doReplaceString = value => {
        HTML_TAGS_TO_REPLACE.map(k => {
            Object.keys(k).forEach(e => {
                value = value.replace(e, k[e]);
            });
        });
        return value;
    }

    const doIncrementWork = commandId => {
        fetch(INCREMENT_COMMAND_WORK + commandId, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ attribute: 'works', increment: true })
        }).then(result => result.json()).then((data) => {
            if (data) {
                setWorksCount(data.command.works);
            }
        }, (error) => {
            setIsLoaded(false);
            console.error(error);
        });
    }


    const doIncrementDoesNotWork = commandId => {
        fetch(INCREMENT_COMMAND_WORK + commandId, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ attribute: 'doesnt_work', increment: true })
        }).then(result => result.json()).then((data) => {
            if (data) {
                setDoesNotWorksCount(data.command.doesnt_work);
            }
        }).catch(error => {
            setIsLoaded(false);
            console.error(error);
        });
    }

    const [copied, setCopied] = useState('Copy');
    const [worksCount, setWorksCount] = useState(content.works);
    const [doesNotWorksCount, setDoesNotWorksCount] = useState(content.doesnt_work);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const v = content;
    const command = doReplaceString(v.command);

    return (
        <div>
            <div className="row wow fadeIn customRow">
                <div className="col-lg-12 col-xl-7 mb-4">
                    <h3 className="mb-3 font-weight-bold dark-grey-text site-font">
                        <strong className="site-font">{v.title}</strong>
                    </h3>
                    <p className="grey-text">{v.full_description}</p>
                    {entities.decode(command).split("<br>").map(t =>
                        <p key={uuidv1()}>
                            <strong className="site-font">$&nbsp;</strong>
                            <strong className="site-font">{t}</strong>
                        </p>
                    )}
                    <CopyToClipboard text={entities.decode(command)}
                        onCopy={() => setCopied('Copied')}>
                        <a target="#" className="btn btn-dark btn-sm waves-effect waves-light">{copied}
                            <i className="fas fa-play ml-2"></i>
                        </a>
                    </CopyToClipboard>
                </div>
            </div>
            <div className="row wow fadeIn customRow col-lg-12 mb-4">
                {v.tags && v.tags.split(" ").map(t => <span key={uuidv1()}
                    className="ml-3 badge badge-warning">{t}</span>)}
            </div>
            <div className="row wow fadeIn col-xl-7 customRow col-lg-12 mb-4">
                <button type="button" className="btn btn-dark btn-sm"
                    onClick={() => doIncrementWork(v._id)}>
                    It works :) <span className="badge badge-dark ml-2">{worksCount}</span>
                </button>
                <button type="button" className="btn btn-dark btn-sm"
                    onClick={() => doIncrementDoesNotWork(v._id)}>
                    Does not works :( <span className="badge badge-dark ml-2">{doesNotWorksCount}</span>
                </button>
            </div>
            {showErrorMessage && <AlertMessages />}
            <hr className="mb-5" />
        </div>
    );
}

export default ListCommand;