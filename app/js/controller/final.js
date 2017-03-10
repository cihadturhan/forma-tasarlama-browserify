module.exports = function ($scope){
    $scope.startChat = function(){
        $zopim && $zopim.livechat.say('Merhaba');
    }

};