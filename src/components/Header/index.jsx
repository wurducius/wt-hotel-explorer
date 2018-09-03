import React from 'react';
import logoWTmd from '../../../node_modules/windingtree-media-web/logo-variants/full-logo/svg/logo--white_white-text--md.svg';

export default () => (
  <header id="app-header" className="app-header--themed">
    <h1>
      <a href="/">
        <img className="img-fluid" src={logoWTmd} alt="WindingTree" />
      </a>
    </h1>
  </header>
);
