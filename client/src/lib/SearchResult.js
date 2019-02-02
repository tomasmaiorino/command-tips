import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

const uuidv1 = require('uuid/v1');
const INCREMENT_COMMAND_WORK = "/api/tips/";
const HTML_TAGS_TO_REPLACE = [{'>':'&gt;'},{'<':'&lt;'}];

class SearchResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            copied: 'Copy',
            worksCount: props.content.works,
            doesNotWorksCount: props.content.doesnt_work
        };
        this.doReplaceString = this.doReplaceString.bind(this);
    }

    doReplaceString = value => {
        HTML_TAGS_TO_REPLACE.map(k => {
            Object.keys(k).forEach(e => {
                value = value.replace(e, k[e]);
            });
        });
        return value;
    }

    doIncrementWork = commandId => {
        fetch(INCREMENT_COMMAND_WORK + commandId,
            {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ attribute: 'works', increment: true })
            }).then(result => result.json()).then((data) => {
                if (data) {
                    this.setState(
                        { worksCount: data.command.works }
                    )
                }
            }, (error) => {
                this.setState({ isLoaded: false, error: error });
                console.error(error);
            });
    }

    render() {
        const v = this.props.content;
        const command = this.doReplaceString(v.command);

        return (
            <div>
                <div className="row wow fadeIn customRow">
                    <div className="col-lg-12 col-xl-7 mb-4">
                        <h3 className="mb-3 font-weight-bold dark-grey-text site-font">
                            <strong className="site-font">{v.title}</strong>
                        </h3>
                        <p className="grey-text">{v.full_description}</p>
                        <p>                            
                        <strong className="site-font">$&nbsp;</strong>
                        <strong className="site-font">{entities.decode(command)}</strong>
                        </p>
                        <CopyToClipboard text={entities.decode(command)}
                            onCopy={() => this.setState({ copied: 'Copied' })}>
                            <a target="#" className="btn btn-dark btn-sm waves-effect waves-light">{this.state.copied}
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
                        onClick={() => this.doIncrementWork(v._id)}>
                        It works :) <span className="badge badge-dark ml-2">{this.state.worksCount}</span>
                    </button>
                    <button type="button" className="btn btn-dark btn-sm">
                        Does not works :( <span className="badge badge-dark ml-2">{v.doesnt_work}</span>
                    </button>
                </div>
                <hr className="mb-5" />
            </div>
        );
    }
}
//
export default SearchResult;
