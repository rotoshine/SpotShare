export default {
  path: '/',
  component: require('./App').default,
  indexRoute: { onEnter: (nextState, replace) => replace('/map') },
  childRoutes: [
    {
      path: '/map', component: require('./containers/SpotMapContainer').default
    },
    {
      path: '/spots',
      component: require('./containers/SpotListContainer').default,
      onLeave: () => {

      }
    },
    {
      path: '/spots/:spotId', component: require('./containers/SpotDetailContainer').default
    },
    {
      path: '/spots/:spotId/form', component: require('./containers/SpotFormContainer').default
    },
    {
      path: '/*', component: require('./containers/errors/NotFoundContainer').default
    }
  ]
};
