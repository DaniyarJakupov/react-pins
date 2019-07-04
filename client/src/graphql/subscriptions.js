import gql from "graphql-tag";

export const PIN_ADDED_SUB = gql`
  subscription {
    pinAdded {
      _id
      createdAt
      title
      image
      latitude
      longitude
      author {
        _id
        name
        email
        picture
      }
      comments {
        text
        createdAt
        author {
          name
          picture
        }
      }
    }
  }
`;

export const PIN_DELETED_SUB = gql`
   subscription {
      pinDeleted: {
         _id
      }
   }
`;

export const PIN_UPDATED_SUB = gql`
  subscription {
    pinUpdated {
      _id
      createdAt
      title
      image
      latitude
      longitude
      author {
        _id
        name
      }
      comments {
        text
        createdAt
        author {
          name
          picture
        }
      }
    }
  }
`;
