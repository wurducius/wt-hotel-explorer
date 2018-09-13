import React from 'react';

export default () => (
  <div className="row animated fadeIn">
    <div className="col">
      <div className="alert alert-light border border-info p-1 mb-1" role="alert">

        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <i className="mdi mdi-close" />
        </button>

        <p>
          <strong>Demo application</strong>
          {' '}
showing possibilities of
          {' '}<a href="https://windingtree.com">Winding Tree platform</a>
.
          If you want to know more look
          {' '}
          <a href="https://windingtree.com">here</a>
. If you are an IT developer
          interested in creating your own application using WT platform,
          read
          {' '}
          <a href="https://windingtree.com">Beginners guide</a>
          {' '}
or jump directly to
          {' '}
          <a href="https://windingtree.com">technical documentation</a>
.
          If you want your hotel to appear here or any innovation
          created on top of Winding Tree platform, please, read
          {' '}
          <a href="https://windingtree.com">
How to join
          Winding Tree
          </a>
. Or are you OTA and want to increase your
          portfolio, look on document
          {' '}
          <a href="https://windingtree.com">Winding Tree platform overview for OTA</a>
.
        </p>

      </div>
    </div>
  </div>
);
