function getData(ele) {
  return new Promise(function(resolve, reject) {
    ele.generateRequest().completes.then(function (req, res) {
        resolve(req.response);
    }, function (rejected) {
            // failed request, argument is an object
            let req = rejected.request;
            let error = rejected.error;
    });
  });
}