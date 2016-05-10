exports.findAll = (req, res) => {
  return res.json({
    spots: [
      {
        spotName: '천호동 스팟',
        address: '서울 강동구 천호동 481-5',
        geo: [37.54251441506003, 127.11770256831429],
        createdDate: new Date(),
        updatedDate: new Date(),
        description: '어쩌구 저저구 시불시불~~'
      }
    ]
  });
};

exports.findById = (req, res) => {

};

exports.save = (req, res) => {

};

exports.update = (req, res) => {

};

exports.remove = (req, res) => {

};
