import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import ScrollAnimation from 'react-animate-on-scroll';
import ImageList from '../ImageList';

import AmenitiesList from '../AmenitiesList';

const QuantityBadge = ({ quantity }) => {
  if (quantity === 0) {
    return (
      <React.Fragment>
        <i className="mdi mdi-close-octagon text-danger"/>
        {' '}
        <em>Sold out!</em>
      </React.Fragment>);
  }
  if (quantity < 3) {
    return (
      <React.Fragment>
        <i className="mdi mdi-alert-octagram text-warning"/>
        {' '}
        <em>
          Last
          {' '}
          {quantity}
          {' '}
          remaining!
        </em>
      </React.Fragment>);
  }
  if (quantity === undefined) {
    return (
      <React.Fragment>
        <i className="mdi mdi-alert-circle-outline text-muted"/>
        {' '}
        <em>Availability unknown</em>
      </React.Fragment>);
  }
  return null;
};

QuantityBadge.defaultProps = {
  quantity: undefined,
};

QuantityBadge.propTypes = {
  quantity: PropTypes.number,
};

// TODO use properties, totalQuantity and occupancy

class RoomType extends React.PureComponent {
  render() {
    const { roomType, estimate, index } = this.props;

    let availabilityClassNames = 'text--accent';
    if (estimate.quantity === undefined) {
      availabilityClassNames = 'text-muted';
    }
    if (estimate.quantity === 0) {
      availabilityClassNames = 'text-muted text--deleted';
    }

    const qrStyle = {
      display: 'block',
      visibility: 'visible',
    };

    function book() {
      const request = new XMLHttpRequest();

      const name = document.getElementById('firstName').value;
      const surname = document.getElementById('lastname').value;
      const email = document.getElementById('email').value;

      const data = {
        hotelId: '0xe92a8f9a7264695f4aed8d1f397dbc687ba40299',
        customer: {
          name,
          surname,
          address: {
            line1: '221B Baker Street',
            city: 'London',
            country: 'GB',
          },
          email,
        },
        pricing: {
          currency: 'GBP',
          total: 221,
          cancellationFees: [
            {
              from: '2018-12-01',
              to: '2019-01-01',
              amount: 50,
            },
          ],
        },
        booking: {
          arrival: '2019-02-09',
          departure: '2019-02-11',
          rooms: [
            {
              id: '244',
              guestInfoIds: ['1'],
            },
            {
              id: '245',
              guestInfoIds: ['2'],
            },
          ],
          guestInfo: [
            {
              id: '1',
              name: 'Sherlock',
              surname: 'Holmes',
            },
            {
              id: '2',
              name: 'John',
              surname: 'Watson',
            },
          ],
        },
      };
      const dataStr = JSON.stringify(data);

      request.open('POST', 'https://stage.siestasolution.com/Api/Api.aspx?Action=WTBooking', true);
      request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      console.log('POST:', data);
      request.send(dataStr);

      console.log('Testing QR Code');

      // https://chart.googleapis.com/chart?chs=300x300&cht=qr&choe=UTF-8&chl=0xdda8553c2704158e03b505641b9c7bd2fb31e81f
      const qr = '0x96C677A5480edC192559aa6D11D87e6Bff9A6f67';
      const qrContainer = document.getElementById('qr-container');
      const qrImage = document.getElementById('qr-image');
      qrImage.src = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&choe=UTF-8&chl=${qr}`;
      qrContainer.style.display = 'block';
      qrContainer.style.visibility = 'visible';
    }

    return (
      <React.Fragment>
        <div className="col-sm-12 col-md-6 col-lg-4 d-flex">
          <ScrollAnimation
            animateIn="fadeInUp"
            animateOnce
            delay={100 * index}
            className="w-100 d-flex"
          >
            <div className="card mb-2">
              <button
                className="card-img-top area-btn"
                type="button"
                data-toggle="modal"
                data-target={`#roomModal-${index + 1}`}
              >
                <div
                  className="img-crop"
                  style={{ backgroundImage: `URL(${roomType.images && roomType.images[0]})` }}
                >
                  <img
                    src={roomType.images && roomType.images[0]}
                    alt={roomType.images && roomType.images[0]}
                  />
                </div>

                <div className="area-btn__btn">
                  <i className="mdi mdi-18px text-white mdi-arrow-expand"/>
                  <span className="d-none">View Photos</span>
                </div>
              </button>

              <div className="card-body pt-1 text-muted" style={{ minHeight: 200 }}>
                <h5 className="card-title h6">{roomType.name}</h5>
                <ReactMarkdown
                  className="card-text text--weight-normal"
                  source={roomType.description}
                />
              </div>

              {estimate.price && (
                <div className="room-price card-footer bg-white pb-0">
                  <div className="animated fadeIn">
                    <div>
                      <i className="mdi mdi-calendar mdi-18px text-muted"/>
                      {' '}
                      <strong className={availabilityClassNames}>
                        Available from
                        {' '}
                        <span className="font--alt">{estimate.price.format()}</span>
                        {' '}
                        {estimate.currency}
                      </strong>
                      <br/>
                      <label htmlFor="firstName">First name:</label>
                      <input id="firstName" name="firstName" />
                      <br/>
                      <label htmlFor="lastname">Last name:</label>
                      <input id="lastname" name="lastname" />
                      <br/>
                      <label htmlFor="name">Email:</label>
                      <input id="email" name="email" />
                      <br/>
                      <button onClick={book}>Book!</button>
                      <br/>
                      <div id="qr-container">
                        <b>Please, pay to:</b>
                        <img style={qrStyle} id="qr-image"/>
                      </div>
                    </div>
                    {estimate.price && (<QuantityBadge quantity={estimate.quantity}/>)}
                  </div>
                </div>
              )}
              {roomType.amenities && (
                <div className="card-footer bg-white">
                  <AmenitiesList list={roomType.amenities}/>
                </div>
              )}
            </div>
          </ScrollAnimation>
        </div>

        {/* Modal */}
        <div
          className="modal modal--carousel"
          id={`roomModal-${index + 1}`}
          tabIndex={`-${index + 1}`}
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title animated fadeIn">{roomType.name}</h5>
                <button
                  type="button"
                  className="close animated fadeIn"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="mdi mdi-close"/>
                </button>
              </div>
              <div className="modal-body d-flex align-items-center animated fadeIn">
                <ImageList list={roomType.images} withIndicators/>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

RoomType.defaultProps = {
  estimate: {},
};

RoomType.propTypes = {
  roomType: PropTypes.instanceOf(Object).isRequired,
  estimate: PropTypes.instanceOf(Object),
  index: PropTypes.number.isRequired,
};

const RoomTypes = ({ map, estimates, availableRoomTypes }) => {
  const roomTypes = map && Object.values(map)
    .map((rt, index) => (
      <RoomType
        key={rt.id}
        roomType={rt}
        estimate={estimates.find(e => e.id === rt.id)}
        index={index}
        availableRoomTypes={availableRoomTypes}
      />
    ));
  return roomTypes && roomTypes;
};

RoomTypes.propTypes = {
  map: PropTypes.instanceOf(Object).isRequired,
  estimates: PropTypes.instanceOf(Array).isRequired,
};

export default RoomTypes;
