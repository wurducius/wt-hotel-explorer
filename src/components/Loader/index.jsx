import React from 'react';

export default class Loader extends React.Component {

  render() {

    const {block, label} = this.props;

    return (

      block ?
        label ?
        <div className="loader" style={{height: block, opacity: 0}}>
          <div>
            <i className="mdi mdi-loading mdi-36px"/>
            <p>{label}</p>
          </div>
        </div>
        :
        <div className="loader" style={{height: block, opacity: 0}}>
          <i className="mdi mdi-loading mdi-36px"/>
        </div>
      :
      label ?
        <span><i className="mdi mdi-loading mdi-36px mdi-spin text-primary"/> {label}</span>
        :
        <i className="mdi mdi-loading mdi-36px mdi-spin text-primary"/>
    )
  }
}

