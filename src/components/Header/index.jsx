import React from 'react';
import { Link } from 'react-router-dom';

import logoWTmd from '../../../node_modules/windingtree-media-web/logo-variants/full-logo/svg/logo--white_white-text--md.svg';

export default () => (
  <header id="app-header" className="app-header--themed">
    <h1>
      <Link to="/">
        <img className="img-fluid" src={logoWTmd} alt="WindingTree" />
      </Link>
    </h1>
  </header>
);
