import * as Actions from './fileActions';
import axios from 'axios';

export function upload(spotId, files){
  return (dispatch) => {
    dispatch({
      type: Actions.UPLOAD_START
    });

    return new Promise((resolve) => {
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
        .then((uploadedFiles) => {

          dispatch({
            type: Actions.UPLOAD_COMPLETE
          });
          resolve(uploadedFiles);
        });
    });
  };
}
