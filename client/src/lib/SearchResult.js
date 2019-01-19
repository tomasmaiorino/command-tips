import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
const uuidv1 = require('uuid/v1');

class SearchResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            copied: 'Copy'
        };
    }

    render() {
        const v = this.props.content;
        return (
            <div key={this.props.uuid}>
                <div className="row wow fadeIn customRow">
                    <div className="col-lg-12 col-xl-7 mb-4">
                        <h3 className="mb-3 font-weight-bold dark-grey-text">
                            <strong>{v.title}</strong>
                        </h3>
                        <p className="grey-text">{v.full_description}</p>
                        <p>
                            <strong>$ {v.command}</strong>
                        </p>
                        <CopyToClipboard text={v.command}
                            onCopy={() => this.setState({ copied: 'Copied' })}>
                            <a target="#" className="btn btn-primary btn-md waves-effect waves-light">{this.state.copied}
                                <i className="fas fa-play ml-2"></i>
                            </a>
                        </CopyToClipboard>
                    </div>
                </div>
                <div className="row wow fadeIn customRow col-lg-12 mb-4">
                    {v.tags && v.tags.split(" ").map(t => <span key={uuidv1()}
                        className="ml-3 badge badge-pill badge-default">{t}</span>)}
                </div>
                <hr className="mb-5" />
            </div>
        );
    }
}
//
export default SearchResult;
