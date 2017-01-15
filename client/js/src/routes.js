export default {
  path: '/',
  component: require('./App').default,
  indexRoute: { onEnter: (nextState, replace) => replace('/map') },
  childRoutes: [
    {
      path: '/map', component: require('./containers/SpotMapContainer').default
    },
    {
      path: '/spots', component: require('./containers/SpotListContainer').default
    },
    {
      path: '/spots/:spotId', component: require('./containers/SpotDetailContainer').default
    },
    {
      path: '/spots/:spotId/edit', component: require('./containers/SpotFormContainer').default
    },
    {
      path: '/*', component: require('./containers/errors/NotFoundContainer').default
    }
  ]
};
