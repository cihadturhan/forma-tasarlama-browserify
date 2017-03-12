angular.module('main').controller('finalCtrl', function ($scope){
    $scope.startChat = function(){
        $zopim && $zopim.livechat.say('Merhaba');
    }

});