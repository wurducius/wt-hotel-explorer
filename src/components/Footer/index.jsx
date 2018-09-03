import React from 'react';

export default () => (
  <footer className="footer bg--purple text-white">
    <div className="container">

      <div className="pt-2 pb-1">

        <div className="row">

          <div className="col-md-4">
            <img src="https://windingtree.com/assets/img/logo/sm-white.svg" alt="Winding Tree" className="d-md-none mb-2" />
            <img src="https://windingtree.com/assets/img/logo/md-white.svg" height="60" alt="Winding Tree" className="d-none d-md-inline" />
          </div>

          <div className="col-md-8">
            <div className="row">

              <div className="col-6 col-md-3">
                <dl className="mb-1">
                  <dt className="mb-1">Solutions</dt>
                  <dd>
                    <nav className="nav flex-column small">
                      <a href="/suppliers.html" className="nav-link px-0 text-white text--alpha-inverse">For travel suppliers</a>
                      <a href="/sellers.html" className="nav-link px-0 text-white text--alpha-inverse">For sellers of travel</a>
                      <a href="/software-vendors.html" className="nav-link px-0 text-white text--alpha-inverse">For software vendors</a>
                      <a href="https://github.com/windingtree/" className="nav-link px-0 text-white text--alpha-inverse">API</a>
                    </nav>
                  </dd>
                </dl>
              </div>

              <div className="col-6 col-md-3">
                <dl className="mb-1">
                  <dt className="mb-1">Lif Token</dt>
                  <dd>
                    <nav className="nav flex-column small">
                      <a href="/lif-token.html" className="nav-link px-0 text-white text--alpha-inverse">About token</a>
                      <a href="/lif-token.html" className="nav-link px-0 text-white text--alpha-inverse">Buy Lifs</a>
                      <a href="/lif-token.html" className="nav-link px-0 text-white text--alpha-inverse">Smart contract</a>
                    </nav>
                  </dd>
                </dl>
              </div>

              <div className="col-6 col-md-3">
                <dl className="mb-1">
                  <dt className="mb-1">About</dt>
                  <dd>
                    <nav className="nav flex-column small">
                      <a href="/foundation.html" className="nav-link px-0 text-white text--alpha-inverse">Foundation</a>
                      <a href="https://blog.windingtree.com/" className="nav-link px-0 text-white text--alpha-inverse">Blog</a>
                      <a href="/foundation.html#roadmap" className="nav-link px-0 text-white text--alpha-inverse">Roadmap</a>
                      <a href="/foundation.html#team" className="nav-link px-0 text-white text--alpha-inverse">Team</a>
                      <a href="/assets/files/White_Paper_EN.pdf" className="nav-link px-0 text-white text--alpha-inverse">Read the White paper</a>
                    </nav>
                  </dd>
                </dl>
              </div>

              <div className="col-6 col-md-3">
                <dl className="mb-1">
                  <dt className="mb-1">Contacts</dt>
                  <dd>
                    <nav className="nav flex-column small">
                      <span className="nav-link px-0">
                            Gubelstrasse 11, 6300 Zug, Switzerland
                      </span>
                      <a href="mailto:info@windingtree.com" className="nav-link px-0 text-white text--alpha-inverse text-truncate">info@windingtree.com</a>
                    </nav>
                  </dd>
                </dl>
              </div>

              <div className="col-6 col-md-3">
                <dl className="mb-1">
                  <dt className="mb-1">Community</dt>
                  <dd>
                    <nav className="nav flex-column small">
                      <a href="/startups-and-developers.html" className="nav-link px-0 text-white text--alpha-inverse">For developers &amp;&nbsp;startups</a>
                    </nav>
                  </dd>
                </dl>
              </div>

            </div>
          </div>

        </div>
      </div>

      <hr className="text--alpha" />

      <div className="py-1">
        <div className="d-flex flex-column-reverse flex-md-row align-items-center">
          <div className="d-flex flex-column flex-md-row align-items-center align-items-md-baseline">
            <small>
©&nbsp;2017–
              <script>document.write(new Date().getFullYear());</script>
2018, Winding Tree
            </small>
            <a href="https://windingtree.com/" target="_blank" rel="noopener noreferrer" className="ml-md-2 small text-white text--alpha-inverse border-bottom">powered by Winding Tree</a>
          </div>

          <div className="mb-1 mb-md-0 ml-md-auto">
            <ul className="social list-inline text-center text-md-right">

              <li className="list-inline-item">
                <a href="https://github.com/windingtree" title="GitHub" className="text-white text--alpha">
                  <i className="mdi mdi-24px mdi-github-circle" />
                </a>
              </li>

              <li className="list-inline-item">
                <a href="https://twitter.com/windingtree" title="Twitter" className="text-white text--alpha">
                  <i className="mdi mdi-24px mdi-twitter" />
                </a>
              </li>

              <li className="list-inline-item">
                <a href="http://blog.windingtree.com/" title="Medium" className="text-white text--alpha">
                  <i className="mdi mdi-24px mdi-medium" />
                </a>
              </li>

              <li className="list-inline-item">
                <a href="https://www.youtube.com/channel/UCFuemEOhCfenYMoNdjD0Aew" title="YouTube" className="text-white text--alpha">
                  <i className="mdi mdi-24px mdi-youtube" />
                </a>
              </li>

              <li className="list-inline-item">
                <a href="https://t.me/windingtree" title="Telegram" className="text-white text--alpha">
                  <i className="mdi mdi-24px mdi-telegram" />
                </a>
              </li>

              <li className="list-inline-item">
                <a href="https://reddit.com/r/windingtree" title="Reddit" className="text-white text--alpha">
                  <i className="mdi mdi-24px mdi-reddit" />
                </a>
              </li>

              <li className="list-inline-item">
                <a href="https://bitcointalk.org/index.php?topic=1946065" title="BitcoinTalk" className="text-white text--alpha">
                  <i className="mdi mdi-24px mdi-bitcoin" />
                </a>
              </li>

            </ul>


          </div>

        </div>
      </div>
    </div>
  </footer>
);
