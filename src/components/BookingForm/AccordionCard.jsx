import React from 'react';
import PropTypes from 'prop-types';

const AccordionCard = ({
  title, id, accordion, children, shown,
}) => (
  <div className="card">
    <div className="card-header" id={id}>
      <button type="button" className="btn btn-link" data-toggle="collapse" data-target={`#${id}-collapse`} aria-expanded="true" aria-controls={`${id}-collapse`}>
        {title}
      </button>
    </div>

    <div id={`${id}-collapse`} className={`collapse ${shown ? 'show' : ''}`} aria-labelledby={id} data-parent={`#${accordion}`}>
      <div className="card-body">
        <p>
          {children}
        </p>
      </div>
    </div>
  </div>
);

AccordionCard.defaultProps = {
  shown: false,
};

AccordionCard.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  accordion: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  shown: PropTypes.bool,
};


export default AccordionCard;
