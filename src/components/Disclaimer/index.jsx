import React from 'react';

export default () => (
  <div className="row animated fadeIn">
    <div className="col">
      <div className="alert alert-light border border-info p-1 mb-1" role="alert">

        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <i className="mdi mdi-close" />
        </button>

        <p>
This is a demo application showing possibilities of the Winding Tree platform.
If you would like more information about Winding Tree check
          {' '}
          <a href="https://windingtree.com/">here</a>
. If you are an IT developer interested in creating your own application
using the Winding Tree platform, you can go directly to the
          {' '}
          <a href="https://github.com/windingtree/wiki/blob/master/developer-resources.md">Beginners guide</a>
.

If you are a hospitality provider, an OTA or a startup dealing with travel
and interested in an integration with us, please send us an email to
          {' '}
          <a href="mailto:info@windingtree.com">info@windingtree.com</a>
.
        </p>

      </div>
    </div>
  </div>
);
