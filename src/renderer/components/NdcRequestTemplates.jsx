import React, { useState } from 'react';

export const NDC_TEMPLATES = {
  airShopping: {
    AirShoppingRQ: {
      Document: {
        Name: 'NDC AirShopping transaction',
        ReferenceVersion: '1.0',
      },
      Party: {
        Sender: {
          TravelAgencySender: {
            Name: 'TravelAgency',
            IATA_Number: '12345678',
          },
        },
      },
      CoreQuery: {
        OriginDestinations: {
          OriginDestination: [
            {
              Departure: {
                AirportCode: 'JFK',
                Date: '2024-12-01',
              },
              Arrival: {
                AirportCode: 'LAX',
              },
            },
          ],
        },
        Travelers: {
          Traveler: [
            {
              AnonymousTraveler: {
                PTC: 'ADT',
              },
            },
          ],
        },
      },
    },
  },
  flightPrice: {
    FlightPriceRQ: {
      Document: {
        Name: 'NDC FlightPrice transaction',
        ReferenceVersion: '1.0',
      },
      Party: {
        Sender: {
          TravelAgencySender: {
            Name: 'TravelAgency',
            IATA_Number: '12345678',
          },
        },
      },
      Query: {
        Offer: {
          OfferID: 'OFFER_ID_HERE',
          Owner: 'AIRLINE_CODE',
        },
      },
    },
  },
  seatAvailability: {
    SeatAvailabilityRQ: {
      Document: {
        Name: 'NDC SeatAvailability transaction',
        ReferenceVersion: '1.0',
      },
      Party: {
        Sender: {
          TravelAgencySender: {
            Name: 'TravelAgency',
            IATA_Number: '12345678',
          },
        },
      },
      Query: {
        FlightSegment: {
          Departure: {
            AirportCode: 'JFK',
            Date: '2024-12-01',
          },
          Arrival: {
            AirportCode: 'LAX',
          },
          MarketingCarrier: {
            AirlineID: 'AA',
            FlightNumber: '100',
          },
        },
      },
    },
  },
  orderCreate: {
    OrderCreateRQ: {
      Document: {
        Name: 'NDC OrderCreate transaction',
        ReferenceVersion: '1.0',
      },
      Party: {
        Sender: {
          TravelAgencySender: {
            Name: 'TravelAgency',
            IATA_Number: '12345678',
          },
        },
      },
      Query: {
        OrderItems: {
          ShoppingResponse: {
            Owner: 'AIRLINE_CODE',
            ResponseID: 'RESPONSE_ID_HERE',
          },
          OfferItem: {
            OfferItemID: 'OFFER_ITEM_ID_HERE',
            Quantity: 1,
          },
        },
        Travelers: {
          Traveler: [
            {
              GivenName: 'John',
              Surname: 'Doe',
              PTC: 'ADT',
            },
          ],
        },
      },
    },
  },
  orderRetrieve: {
    OrderRetrieveRQ: {
      Document: {
        Name: 'NDC OrderRetrieve transaction',
        ReferenceVersion: '1.0',
      },
      Party: {
        Sender: {
          TravelAgencySender: {
            Name: 'TravelAgency',
            IATA_Number: '12345678',
          },
        },
      },
      Query: {
        Filters: {
          OrderID: 'ORDER_ID_HERE',
        },
      },
    },
  },
};

export function NdcRequestTypeSelector({ onSelect }) {
  const [selected, setSelected] = useState(null);
  const requestTypes = [
    { key: 'airShopping', label: 'Air Shopping Request' },
    { key: 'flightPrice', label: 'Flight Price Request' },
    { key: 'seatAvailability', label: 'Seat Availability Request' },
    { key: 'orderCreate', label: 'Order Create Request' },
    { key: 'orderRetrieve', label: 'Order Retrieve Request' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 220 }}>
        {requestTypes.map(rt => (
          <button
            key={rt.key}
            onClick={() => {
              setSelected(rt.key);
              onSelect(rt.key, NDC_TEMPLATES[rt.key]);
            }}
            style={{
              padding: '12px 18px',
              borderRadius: 8,
              border: selected === rt.key ? '2px solid #6c63ff' : '1.5px solid #bfc8e6',
              background: selected === rt.key
                ? 'linear-gradient(90deg, #6c63ff 0%, #3a4663 100%)'
                : 'linear-gradient(90deg, #f9fafe 0%, #f1f4fa 100%)',
              color: selected === rt.key ? '#fff' : '#3a4663',
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(60,80,120,0.07)',
              marginBottom: 8,
              marginRight: 0,
              textAlign: 'left',
            }}
          >
            {rt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
