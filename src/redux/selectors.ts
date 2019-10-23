import { createSelector } from 'redux-starter-kit';
import _ from 'lodash';

export const userSelector = createSelector({ user: 'login.id' });
export const usernameSelector = createSelector({ username: 'login.username' });

export const createCollectionSelector = (collectionName: string) => {
  return createSelector({ [collectionName]: `collections.${collectionName}` });
};

export const createDocSelector = ({
  collection,
  id,
  prop,
}: {
  collection: string;
  id: string;
  prop: string;
}) => {
  return createSelector(
    [
      createCollectionSelector(collection),
      (state: any, props: any) => props[id],
    ],
    (collections, docId) => ({
      [prop]: _.get(collections[collection], docId),
    }),
  );
};

export const createDocListSelector = ({
  collection,
  filter,
  prop,
}: {
  collection: string;
  filter: string;
  prop: string;
}): any => {
  return createSelector(
    [
      createCollectionSelector(collection),
      (state: any, props: any) => props[filter],
    ],
    (collections, filterObj) => {
      const collectionDict = collections[collection];
      const docList = filterObj ? _.filter(collectionDict, filterObj) : null;

      return { [prop]: docList };
    },
  );
};

export const createTreeChildSelector = () => {
  return createSelector(
    [
      (state: any, props: any) => props,
      (state: any, props: any) => {
        const { question, comment } = props;
        const parent = comment || question;

        return _.get(state, `commentTree.${question}.${parent}.children`);
      },
      createCollectionSelector('comments'),
    ],
    (props, children, collections) => {
      const childrenComments = _.map(
        children,
        cid => collections.comments[cid],
      );
      const type = props.type;
      return { childrenComments: _.filter(childrenComments, { type }) };
    },
  );
};

export const createTreeCountSelector = () => {
  return createSelector(
    [
      (state: any, props: any) => {
        const { question, comment } = props;
        return _.get(state, `commentTree.${question}.${comment}.subTreeCount`);
      },
    ],
    subTreeCount => ({ subTreeCount }),
  );
};
