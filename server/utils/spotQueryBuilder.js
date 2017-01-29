export default {
  DEFAULT_LIMIT: 10,
  getSkipCount(page, limitParam) {
    const limit = limitParam || this.DEFAULT_LIMIT;
    const page = page || 1;
    const skip = ( page - 1 ) * limit;

    return {
      skip,
      limit
    };
  },
  build(query){
    if (query.spotName) {
      query.spotName = new RegExp(query.spotName, 'i');
    }
  }
}
