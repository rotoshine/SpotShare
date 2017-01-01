import * as Actions from './spotFileActions';
import * as SpotActions from './spotsActions';

import axios from 'axios';

export function upload(spotId, files){
  return (dispatch, getState) => {
    dispatch({
      type: Actions.UPLOAD_START
    });

    return new Promise((resolve, reject) => {
      let uploadAPIUrl = '/api/files/upload';

      if(spotId){
        uploadAPIUrl = `/api/spots/${spotId}/files`;
      }

      let form = new FormData();

      files.forEach(file => {
        form.append('files', file);
      });

      const options = {
        headers: {
          'Content-Type': files[0].type
        }
      };

      axios.post(uploadAPIUrl, form, options)
        .then((result) => {
          const uploadedFiles = result.data;

          dispatch({
            type: Actions.UPLOAD_COMPLETE
          });

          let {spotForm} = getState().spots;

          spotForm.files = spotForm.files.concat(uploadedFiles);

          dispatch({
            type: SpotActions.SET_SPOT_FORM,
            spotForm: spotForm
          });

          return resolve(uploadedFiles);
        })
        .catch(reject);
    });
  };
}
