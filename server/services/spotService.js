import mongoose from 'mongoose';

const Spot = mongoose.model('Spot');

export default {
  find(query, hasPaging){
    let findQuery = {};

    if(!query.hasOwnProperty('isDisplay')){
      findQuery.isDisplay = true;
    }else{
      findQuery.isDisplay = query.isDisplay;
    }

    let sort = {
      _id: -1
    };

    if(query.sortKey){
      sort[query.sortKey] = query.hasOwnProperty('asc') ? 1 : -1
    }

    const limit = parseInt(query.limit, 10) || 5;
    const page = parseInt(query.page, 10) || 1;

    const skip = ( page - 1 ) * limit;

    if(query.spotName && query.spotName.length > 0){
      findQuery.spotName = new RegExp(query.spotName, 'i');
    }

    if(query.geo){
      findQuery.geo = query.geo;
    }

    let result = {
      spots: [],
      totalCount: 0,
      page,
      limit,
      query: {
        spotName: query.spotName,
        isDisplay: findQuery.isDisplay,
        geo: findQuery.geo || {}
      }
    };



    return new Promise((resolve, reject) => {
      const queryRunner = Spot
        .find(findQuery)
        .sort(sort)
        .populate('files', '_id')
        .populate('createdBy', 'name provider');

      if(hasPaging){
        queryRunner
          .skip(skip)
          .limit(limit)
      }

      queryRunner.exec()
        .then((spots) => {
          result.spots = spots;

          Spot.count(findQuery).then((totalCount) => {
            result.totalCount = totalCount;
            resolve(result);
          }).catch(reject);
        })
        .catch(reject);
    });
  }

}
