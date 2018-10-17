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
    $scope.messageState = '';
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
        $timeout(function() {
          $scope.$apply();
        });
      }
    };

    $scope.commonGetResult = function (object) {
      // cF.closeWaitingDialog();
      var result = object.data;
      if (object.codeStatus < 1) {
        cF.showDialogOneBt('ERROR', 'SYSTEM ERROR!', 'btn-danger', 'fa fa-exclamation-triangle', cF.goToLoginScreen);
      } else {

        switch (object.codeStatus) {
          //ADD_MESSAGE = 1;
          case 1:
            $scope.addMessageToList(result);
            break;
          //REFRESH_STATE = 2;
          case 2:
            $scope.messageState = result.info;
            // $scope.addMessageToList(result);
            break;
          // SESSION_START_FALSE = 3;
          case 3:
            $scope.addMessageToList(result);
            $scope.isStartSession = false;
            break;
          //SESSION_START_SUCCESS = 4;
          case 4:
            $scope.addMessageToList(result);
            $scope.isStartSession = true;
            break;
          //SESSION_STOP = 5;
          case 5:
            $scope.addMessageToList(result);
            $scope.isStartSession = false;
            break;
          // MESSAGE_SUBMIT_FALSE = 6;
          case 6:
            $scope.addMessageToList(result);
            break;
          default:
            $scope.addMessageToList(result);
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
          $scope.commonGetResult(data.data);
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
    $scope.listTlv = [
        { tagName: 'TAG_SOURCE_TELEMATICS_ID', tag: '0x0010' },
        { tagName: 'TAG_PAYLOAD_TYPE', tag: '0x0019' },
        { tagName: 'TAG_PRIVACY_INDICATOR', tag: '0x0201' },
        { tagName: 'TAG_USER_MESSAGE_REFERENCE', tag: '0x0204' },
        { tagName: 'TAG_USER_RESPONSE_CODE', tag: '0x0205' },
        { tagName: 'TAG_SOURCE_PORT', tag: '0x020A' },
        { tagName: 'TAG_DESTINATION_PORT', tag: '0x020B' },
        { tagName: 'TAG_SAR_MSG_REF_NUM', tag: '0x020C' },
        { tagName: 'TAG_LANGUAGE_INDICATOR', tag: '0x020D' },
        { tagName: 'TAG_SAR_TOTAL_SEGMENTS', tag: '0x020E' },
        { tagName: 'TAG_SAR_SEGMENT_SEQNUM', tag: '0x020F' },
        { tagName: 'TAG_SOURCE_SUBADDRESS', tag: '0x0202' },
        { tagName: 'TAG_DEST_SUBADDRESS', tag: '0x0203' },
        { tagName: 'TAG_CALLBACK_NUM', tag: '0x0381' },
        { tagName: 'TAG_MESSAGE_PAYLOAD', tag: '0x0424' },
        { tagName: 'TAG_SC_INTERFACE_VERSION', tag: '0x0210' },
        { tagName: 'TAG_DISPLAY_TIME', tag: '0x1201' },
        { tagName: 'TAG_MS_VALIDITY', tag: '0x1204' },
        { tagName: 'TAG_DPF_RESULT', tag: '0x0420' },
        { tagName: 'TAG_SET_DPF', tag: '0x0421' },
        { tagName: 'TAG_MS_AVAIL_STATUS', tag: '0x0422' },
        { tagName: 'TAG_NETWORK_ERROR_CODE', tag: '0x0423' },
        { tagName: 'TAG_DELIVERY_FAILURE_REASON', tag: '0x0425' },
        { tagName: 'TAG_MORE_MSGS_TO_FOLLOW', tag: '0x0426' },
        { tagName: 'TAG_MSG_STATE', tag: '0x0427' },
        { tagName: 'TAG_CONGESTION_STATE', tag: '0x0428' },
        { tagName: 'TAG_CALLBACK_NUM_PRES_IND', tag: '0x0302' },
        { tagName: 'TAG_CALLBACK_NUM_ATAG', tag: '0x0303' },
        { tagName: 'TAG_NUM_MSGS', tag: '0x0304' },
        { tagName: 'TAG_SMS_SIGNAL', tag: '0x1203' },
        { tagName: 'TAG_ALERT_ON_MSG_DELIVERY', tag: '0x130C' },
        { tagName: 'TAG_ITS_REPLY_TYPE', tag: '0x1380' },
        { tagName: 'TAG_ITS_SESSION_INFO', tag: '0x1383' },
        { tagName: 'TAG_USSD_SERVICE_OP', tag: '0x0501' },
        { tagName: 'TAG_BROADCAST_CHANNEL_INDICATOR', tag: '0x0600' },
        { tagName: 'TAG_BROADCAST_CONTENT_TYPE', tag: '0x0601' },
        { tagName: 'TAG_BROADCAST_CONTENT_TYPE_INFO', tag: '0x0602' },
        { tagName: 'TAG_BROADCAST_MESSAGE_CLASS', tag: '0x0603' },
        { tagName: 'TAG_BROADCAST_REP_NUM', tag: '0x0604' },
        { tagName: 'TAG_BROADCAST_FREQUENCY_INTERVAL', tag: '0x0605' },
        { tagName: 'TAG_BROADCAST_AREA_IDENTIFIER', tag: '0x0606' },
        { tagName: 'TAG_BROADCAST_ERROR_STATUS', tag: '0x0607' },
        { tagName: 'TAG_BROADCAST_AREA_SUCCESS', tag: '0x0608' },
        { tagName: 'TAG_BROADCAST_END_TIME', tag: '0x0609' },
        { tagName: 'TAG_BROADCAST_SERVICE_GROUP', tag: '0x060A' },
        { tagName: 'TAG_SOURCE_NETWORK_ID', tag: '0x060D' },
        { tagName: 'TAG_DEST_NETWORK_ID', tag: '0x060E' },
        { tagName: 'TAG_SOURCE_NODE_ID', tag: '0x060F' },
        { tagName: 'TAG_DEST_NODE_ID', tag: '0x0610' },
        { tagName: 'TAG_BILLING_IDENTIFICATION', tag: '0x060B' },
        { tagName: 'TAG_ORIG_MSC_ADDR', tag: '0x8081' },
        { tagName: 'TAG_DEST_MSC_ADDR', tag: '0x8082' },
        { tagName: 'TAG_DEST_ADDR_SUBUNIT', tag: '0x0005' },
        { tagName: 'TAG_DEST_NETWORK_TYPE', tag: '0x0006' },
        { tagName: 'TAG_DEST_BEAR_TYPE', tag: '0x0007' },
        { tagName: 'TAG_DEST_TELE_ID', tag: '0x0008' },
        { tagName: 'TAG_SOURCE_ADDR_SUBUNIT', tag: '0x000D' },
        { tagName: 'TAG_SOURCE_NETWORK_TYPE', tag: '0x000E' },
        { tagName: 'TAG_SOURCE_BEAR_TYPE', tag: '0x000F' },
        { tagName: 'TAG_SOURCE_TELE_ID', tag: '0x0010' },
        { tagName: 'TAG_QOS_TIME_TO_LIVE', tag: '0x0017' },
        { tagName: 'TAG_ADD_STATUS_INFO', tag: '0x001D' },
        { tagName: 'TAG_RECEIPTED_MSG_ID', tag: '0x001E' },
        { tagName: 'TAG_MS_MSG_WAIT_FACILITIES', tag: '0x0030' }
    ];
    $scope.addTlv = function(){
        if (!$scope.smppCof.tlvList) {
            $scope.smppCof.tlvList = [];
        }
        $scope.smppCof.tlvList.push({ tag: '', value: '' });
    };

    $scope.removeTlv = function(tlv){
        $scope.smppCof.tlvList = $scope.smppCof.tlvList.filter(function(i){ return i !== tlv; });
    };

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
    if(CONFIG.SERVICE_BASE === '/rs/'){
      connect();
    }

  });
