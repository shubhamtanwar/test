angular.module('myApp.retryHttpInterceptor', [])
.factory('retryInterceptor', ['$q', '$injector','$location','$timeout',function($q, $injector,$location,$timeout) {
  return {
    request: function(config) {
        config.timeout = 15000;
        return config;
    },
    response : function(res) {
      return res;
    },
    responseError: function(err) {
      try{
      console.log("Interceptd Error: "+JSON.stringify(err));
      if (err.status == 0) {
        return $timeout(function() {
          if(navigator.connection.type == "none"){
            $.unblockUI();
            $location.path("/noNetwork/"+window.location.href.split('#')[1].split('/')[2]);
          }else{
            return $injector.get('$http')(err.config);
          }
        }, 5000);
      }
      return $q.reject(err);
    }catch(e){alert(e)}
    }
  }
}])
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('retryInterceptor');
}]);
