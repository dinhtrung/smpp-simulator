'use strict';

/**
 * @ngdoc function
 * @name jsClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jsClientApp
 */
angular.module('jsClientApp')
  .controller('MainCtrl', function ($scope, $rootScope, $timeout, $log, smppParametersService, smppTestingService, cF, Upload, CONFIG) {
    $scope.smppCof = {};
    $scope.isStartSession = false;
    $scope.listMessage = [];
    $scope.isRandomBulkMessages = true;
    $scope.portForPcapParsing = 2775;
    $scope.file = null;

    // for (var i = 0; i < 200; i++){
    //   var item = {};
    //   item.timeStamp = '207-04-02 03:42:'+i;
    //   item.msg = 'msg '+i;
    //   item.info = 'info'+ i;
    //   $scope.listMessage.push(item);
    // }
    $scope.addMessageToList = function (message) {
      if(cF.isNotNull(message)){
        $scope.listMessage.push(message);
        $scope.$apply();
      }

    };

    $scope.commonGetResult = function (object) {
      // cF.closeWaitingDialog();
      var result = object.data;
      if (object.codeStatus < 1) {
        cF.showDialogOneBt('ERROR', 'SYSTEM ERROR!', 'btn-danger', 'fa fa-exclamation-triangle', cF.goToLoginScreen);
      } else {
        $scope.addMessageToList(result);
        switch (result.codeStatus) {
          //ADD_MESSAGE = 1;
          case 1:
            break;
          //REFRESH_STATE = 2;
          case 2:
            break;
          // SESSION_START_FALSE = 3;
          case 3:
            $scope.isStartSession = false;
            break;
          //SESSION_START_SUCCESS = 4;
          case 4:
            $scope.isStartSession = true;
            break;
          //SESSION_STOP = 5;
          case 5:
            $scope.isStartSession = false;
            break;
          // MESSAGE_SUBMIT_FALSE = 6;
          case 6:
            break;
          default:
            break;
        }
      }
    };

    $scope.clickBtStartASession = function () {
      cF.showWaitingDialog();
      smppTestingService.startASession().then(
        function (data) {
          cF.closeWaitingDialog();
          //TODO ....
        }, function (error) {
          $log.error(error);
          cF.showDialogSystemError();
        });

    };

    $scope.clickBtStopSession = function () {
      cF.showWaitingDialog();
      smppTestingService.stopASession().then(
        function (data) {
          cF.closeWaitingDialog();
          //TODO ....
        }, function (error) {
          $log.error(error);
          cF.showDialogSystemError();
        });

    };

    $scope.clickBtRefreshState = function () {
      cF.showWaitingDialog();
      smppTestingService.refreshState().then(
        function (data) {
          cF.closeWaitingDialog();
          //TODO ....
        }, function (error) {
          $log.error(error);
          cF.showDialogSystemError();
        });

    };

    $scope.clickBtSendBadPacket = function () {
      cF.showWaitingDialog();
      smppTestingService.sendBadPacket().then(
        function (data) {
          cF.closeWaitingDialog();
          //TODO ....
        }, function (error) {
          $log.error(error);
          cF.showDialogSystemError();
        });

    };

    $scope.clickBtSubmitMessage = function () {
      cF.showWaitingDialog();
      smppTestingService.submitMessage().then(
        function (data) {
          cF.closeWaitingDialog();
          //TODO ....
        }, function (error) {
          $log.error(error);
          cF.showDialogSystemError();
        });

    };

    $scope.clickBtStopBulkSending = function () {
      cF.showWaitingDialog();
      smppTestingService.stopBulkSending().then(
        function (data) {
          cF.closeWaitingDialog();
          //TODO ....
        }, function (error) {
          $log.error(error);
          cF.showDialogSystemError();
        });

    };

    $scope.bulkSendingRandom = function () {
      cF.showWaitingDialog();
      smppTestingService.bulkSendingRandom().then(
        function (data) {
          cF.closeWaitingDialog();
          //TODO ....
        }, function (error) {
          $log.error(error);
          cF.showDialogSystemError();
        });

    };



    $scope.bulkSendingFromPcapFile = function () {
      var message = '';
      if(cF.isNull($scope.portForPcapParsing)){
        message = '<p class=\"pError\">Please input number for TCP Port for pcap parsing</p>';
      } else if (!cF.isInteger($scope.portForPcapParsing)) {
        message = '<p class=\"pError\">Please input number for TCP Port for pcap parsing</p>';
      }

      if(cF.isNull($scope.file)){
        if(cF.isNotEmpty(message)){
          message = message +'<br /><p class=\"pError\"> And please input number for TCP Port for pcap parsing</p>';
        } else {
          message = '<p class=\"pError\">Please chose pcap file.</p>';
        }
      }
      if(cF.isNotEmpty(message)){
        $.alert({
          title: 'Alert!',
          content: message,
        });
        return;
      }
      cF.showWaitingDialog();
      Upload.upload({
        url: CONFIG.SERVICE_BASE + 'smpp-test/bulk-sending-from-pcap-file',
        data: {file: $scope.file, 'port': $scope.portForPcapParsing}
      }).then(function (resp) {
        console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        cF.closeWaitingDialog();
      }, function (resp) {
        cF.closeWaitingDialog();
        cF.showDialogSystemError();
        console.log('Error status: ' + resp.status);
      }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      });
    };

    $scope.clickBtStartBulkSending = function () {
      if($scope.isRandomBulkMessages){
        $scope.bulkSendingRandom();
      } else {
        $scope.bulkSendingFromPcapFile();
      }

    };


    //======================================DIALOG SMMPP MESSAGE=====================================//
    $scope.nameDialogSmppMessage = '#dialogSmppMessage';
    $scope.smppMessage = {};
    $scope.showDialogSmmMessage = function (item) {
      $scope.smppMessage = item;
      $($scope.nameDialogSmppMessage).modal('show');

    };

    $($scope.nameDialogSmppMessage).on('hidden.bs.modal', function (e) {
      $scope.smppMessage = {};
    });

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
      cF.removeLabelErrorOfParent($scope.nameDialogSmppConfigure);
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
        $scope.showMessageSmppConfigure(1, 'Some field are invalid, please check again');
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

    $scope.stompClient = null;
    function connect() {
      //var socket = new SockJS('http://localhost:8080/gs-guide-websocket');
      $scope.socket = new SockJS('/myson-websocket');

      // $scope.socket.onmessage = function(e) {
      //   $log.info(e.data);
      // };

      $scope.stompClient = Stomp.over($scope.socket);
      $scope.stompClient.connect({}, function (frame) {
        $log.info('Connected: ' + frame);
        $scope.stompClient.subscribe('/socketget/notifsmpp', function (greeting) {
          //$log.info(greeting);
          var result = JSON.parse(greeting.body);
          $scope.commonGetResult(result);
        });
      });
    }
    if(CONFIG.SERVICE_BASE == '/rs/'){
      connect();
    }

  });
