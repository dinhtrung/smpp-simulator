'use strict';

/**
 * @ngdoc function
 * @name jsClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jsClientApp
 */
angular.module('jsClientApp')
  .controller('MainCtrl', function ($scope, $rootScope, $timeout, $log, smppParametersService, smppTestingService, cF) {
    $scope.smppCof = {};
    $scope.isStartSession = false;




    //======================================DIALOG SMMPP CONFIGURE=====================================//
    $scope.listSNpi = ['Unknown', 'ISDN', 'Data', 'Telex', 'Land_Mobile', 'National', 'Private', 'ERMES', 'Internet_IP', 'WAP_Client_Id'];
    $scope.listTON = ['Unknown', 'International', 'National', 'Network_Specific', 'Subscriber_Number', 'Alfanumeric', 'Abbreviated'];
    $scope.listValidityType = ['NoSpecial', 'ValidityPeriod_5min', 'ValidityPeriod_2hours', 'ScheduleDeliveryTime_5min'];
    $scope.listSendingMessageType = ['SubmitSm', 'DataSm', 'DeliverSm', 'SubmitMulti'];
    $scope.listMCDeliveryReceipt = ['No', 'onSuccessOrFailure', 'onFailure', 'onSuccess', 'onSuccessTempOrPermanentFailure'];
    $scope.listMessagingMode = ['defaultSmscMode', 'datagramm', 'transaction', 'storeAndForward'];
    $scope.nameTabActive = 'Configure';

    $scope.changeTabName = function (nameTab) {
      $scope.nameTabActive = nameTab;
    };

    $scope.nameDialogSmppConfigure = '#dialogSmppConfigure';
    $scope.showDialogSmppConfigure = function () {
      cF.showWaitingDialog();
      smppParametersService.getConfigSmpp().then(
        function (data) {
          cF.closeWaitingDialog();
          $scope.smppCof = data.data;
          $($scope.nameDialogSmppConfigure).modal('show');

        }, function (error) {
          $log.error(error);
          cF.showDialogSystemError();
        });

    };

    $scope.saveSmppConfigure = function () {
      $scope.hiddenMessageStatus();
      if (cF.validateAllOfFrom($scope.nameDialogSmppConfigure)) {
        $scope.showMessageSmppConfigure(1,'Some field are invalid, please check again');
        // $('#divShowMessageSmppConfigure').focus();
        return;
      }
      cF.showWaitingDialog();
      smppParametersService.saveConfigSmpp($scope.smppCof).then(
        function (data) {
          cF.closeWaitingDialog();
          $($scope.nameDialogSmppConfigure).modal('hide');

        }, function (error) {
          $log.error(error);
          cF.showDialogSystemError();
        });

    };

    /** =======================MESSAGE SMPP CONGIF ===================*/
    $scope.hiddenMessageStatus = function () {
      cF.closeWaitingDialog();
      $scope.messageFormSmppConfigure = '';
      $scope.isShowMessageSmppConfigure = false;
      $scope.typeAlertClassSmppConfigure = '';
    };

    $scope.showMessageSmppConfigure = function (codeStatus, messageStatus) {
      $scope.messageFormSmppConfigure = messageStatus;
      $scope.isShowMessageSmppConfigure = cF.isNotNull(codeStatus);
      if ($scope.isShowMessageSmppConfigure) {
        $scope.typeAlertClassSmppConfigure = (codeStatus >= 0) ? 'alert-danger' : 'alert-success';
      }
    };

    $scope.hiddenMessageStatus();

    // $scope.stompClient = null;
    // function connect() {
    //   //var socket = new SockJS('http://localhost:8080/gs-guide-websocket');
    //   $scope.socket = new SockJS('http://localhost:8080/gs-guide-websocket');
    //
    //   // $scope.socket.onmessage = function(e) {
    //   //   $log.info(e.data);
    //   // };
    //
    //   $scope.stompClient = Stomp.over($scope.socket);
    //   $scope.stompClient.connect({}, function (frame) {
    //     $log.info('Connected: ' + frame);
    //     $scope.stompClient.subscribe('http://localhost:8080/socketget/notifsmpp', function (greeting) {
    //       $log.info(greeting);
    //     });
    //   });
    // }
    // connect();
  });
