/**
 * Created by ducgiang8888 on 10/2/2015.
 */
'use strict';
angular.module('jsClientApp').factory("cF", function ($location, $rootScope, $http, $log, CONFIG) {

  var obj = {};

  obj.isNotNull = function isNotNull(str) {
    return str !== undefined && str !== null;
  };
  obj.isNull = function isNull(str) {
    return str === undefined || str === null;
  };

  obj.isNotEmpty = function isNotEmpty(str) {
    return obj.isNotNull(str) && str.length > 0;
  };

  obj.isEmpty = function isEmpty(str) {
    return obj.isNull(str) || str.length === 0;
  };

  obj.isInteger = function isInteger(value) {
    return ($.isNumeric(value) && (value % 1) === 0);
  };

  obj.isEmail = function isEmail(sEmail) {
    var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return filter.test(sEmail);
  };

  obj.isAccount = function isAccount(str) {
    var filter = /^[a-zA-Z0-9_.]+$/;
    return filter.test(str);
  };

  obj.isNormalCharacter = function isNormalCharacter(str) {
    var filter = /^[a-zA-Z0-9 _.-]+$/;
    return filter.test(str);
  };

  //DD-MM-YYYY
  obj.isFormatDateDd_MM_yyyy = function isFormatDateDd_MM_yyyy(str) {
    var filter = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;
    return filter.test(str);
  };

  //match date in format DD/MM/YYYY
  obj.isFormatDateDdMMyyyy = function isFormatDateDdMMyyyy(str) {
    var filter = /^(((0[1-9]|[12][0-9]|3[01])([/])(0[13578]|10|12)([/])(\d{4}))|(([0][1-9]|[12][0-9]|30)([/])(0[469]|11)([/])(\d{4}))|((0[1-9]|1[0-9]|2[0-8])([/])(02)([/])(\d{4}))|((29)(\.|-|\/)(02)([/])([02468][048]00))|((29)([/])(02)([/])([13579][26]00))|((29)([/])(02)([/])([0-9][0-9][0][48]))|((29)([/])(02)([/])([0-9][0-9][2468][048]))|((29)([/])(02)([/])([0-9][0-9][13579][26])))$/;
    return filter.test(str);
  };

  obj.notColonAndComma = function notColonAndComma(str) {
    var filter = /^[^:,]*$/;
    return filter.test(str);
  };

  obj.isUrl = function isUrl(str) {
    var filter = /^(http(?:s)?\:\/\/[a-zA-Z0-9]+(?:(?:\.|\-)[a-zA-Z0-9]+)+(?:\:\d+)?(?:\/[\w\-]+)*(?:\/?|\/\w+\.[a-zA-Z]{2,4}(?:\?[\w]+\=[\w\-]+)?)?(?:\&[\w]+\=[\w\-]+)*)$/;
    return filter.test(str);
  };

  obj.setMarginHieghtOfFootterForm = function setMarginHieghtOfFootterForm(addMoreHeight) {
    var elementFooter = $('#footer-form');
    var height = $('#form').height() - elementFooter.outerHeight() + addMoreHeight;
    //$('#footer-form').css('cssText', 'margin-top: '+(height) + 'px !important');
    $('#body-form').css('min-height', (height) + 'px');
  };

//function to validate master list Module before clicking save button
  obj.removeLabelError = function removeLabelError() {
    $(".pError").remove();
  };

  obj.removeLabelErrorOfParent = function removeLabelErrorOfParent(parent) {
    $(parent + " .pError").remove();
  };

  obj.addLabelError = function addLabelError(element, message) {
    var elementNext = $(element).next();
    if (obj.isNotEmpty(elementNext) && elementNext[0].tagName === 'SPAN') {
      $(element).parent().after('<p class="pError\">' + message + '</p>');
    } else {
      $(element).after('<p class="pError\">' + message + '</p>');
    }
  };

  obj.sethighlight = function sethighlight(element) {
    $(element).effect("highlight", {color: "red"}, 3500);
  };

  obj.getValueOfElement = function getValueOfElement(element) {
    if (element.tagName === 'INPUT') {
      return $(element).val();
    }
    if (element.tagName === 'SELECT') {
      return $(element).find(":selected").text();
    }
    return $(element).val();
  };

  obj.validateAllOfFrom = function validateAllOfFrom(formId) {
    obj.removeLabelError();
    var input = $(formId + " .required");
    var flag = false;
    var result = false;
    input.each(function () {
      var value = obj.getValueOfElement(this);
      if (!obj.isNotEmpty(value)) {
        if (!flag) {
          flag = true;
          $(this).focus();
        }
        $(this).effect("highlight", {color: "red"}, 3500);
        obj.addLabelError(this, 'This field is required.');
        result = true;
      } else {
        var minLength = this.minLength;
        if (obj.isNotNull(minLength) && minLength > value.length) {
          if (!flag) {
            flag = true;
            $(this).focus();
          }
          $(this).effect("highlight", {color: "red"}, 3500);
          obj.addLabelError(this, 'Please enter at least ' + minLength + ' characters.');
          result = true;
        }
      }
    });
    input = $(".account");
    input.each(function () {
      var value = obj.getValueOfElement(this);
      if (obj.isNotEmpty(value) && !obj.isAccount(value)) {
        if (!flag) {
          flag = true;
          $(this).focus();
        }
        $(this).effect("highlight", {color: "red"}, 3500);
        obj.addLabelError(this, 'Please input numbers and alphabet characters only.');
        result = true;
      }
    });

    input = $(".normalCharacter");
    input.each(function () {
      var value = obj.getValueOfElement(this);
      if (obj.isNotEmpty(value) && !obj.isNormalCharacter(value)) {
        if (!flag) {
          flag = true;
          $(this).focus();
        }
        $(this).effect("highlight", {color: "red"}, 3500);
        obj.addLabelError(this, 'Please input numbers and alphabet characters only. Spaces are allowed.');
        result = true;
      }
    });

    input = $(".email");
    input.each(function () {
      var value = obj.getValueOfElement(this);
      if (obj.isNotEmpty(value) && !obj.isEmail(value)) {
        if (!flag) {
          flag = true;
          $(this).focus();
        }
        $(this).effect("highlight", {color: "red"}, 3500);
        obj.addLabelError(this, 'Please enter a valid email address.');
        result = true;
      }
    });

    input = $(".integer");
    input.each(function () {
      var value = obj.getValueOfElement(this);
      if (obj.isNotEmpty(value)) {
        if (!obj.isInteger(value)) {
          if (!flag) {
            flag = true;
            $(this).focus();
          }
          $(this).effect("highlight", {color: "red"}, 3500);
          obj.addLabelError(this, 'Please enter a integer.');
          result = true;
        } else {
          var min = $(this).attr("min-value");
          var max = $(this).attr("max-value");
          if (obj.isNotNull(min) && min > value) {
            if (!flag) {
              flag = true;
              $(this).focus();
            }
            $(this).effect("highlight", {color: "red"}, 3500);
            obj.addLabelError(this, 'Please enter a integer greater than ' + min);
            result = true;
          } else if (obj.isNotNull(max) && max < value) {
            if (!flag) {
              flag = true;
              $(this).focus();
            }
            $(this).effect("highlight", {color: "red"}, 3500);
            obj.addLabelError(this, 'Please enter a integer less than ' + max);
            result = true;
          }
        }
      }
    });

    input = $(".number");
    input.each(function () {
      var value = obj.getValueOfElement(this);
      if (obj.isNotEmpty(value)) {
        if (!$.isNumeric(value)) {
          if (!flag) {
            flag = true;
            $(this).focus();
          }
          $(this).effect("highlight", {color: "red"}, 3500);
          obj.addLabelError(this, 'Please enter a number.');
          result = true;
        } else {
          var min = $(this).attr("min-value");
          var max = $(this).attr("max-value");
          if (obj.isNotNull(min) && min > value) {
            if (!flag) {
              flag = true;
              $(this).focus();
            }
            $(this).effect("highlight", {color: "red"}, 3500);
            obj.addLabelError(this, 'Please enter a number greater than ' + min);
            result = true;
          } else if (obj.isNotNull(max) && max < value) {
            if (!flag) {
              flag = true;
              $(this).focus();
            }
            $(this).effect("highlight", {color: "red"}, 3500);
            obj.addLabelError(this, 'Please enter a number less than ' + min);
            result = true;
          }
        }
      }
    });
    input = $(".ddMMyyyy");
    input.each(function () {
      var value = obj.getValueOfElement(this);
      if (obj.isNotEmpty(value) && !obj.isFormatDateDd_MM_yyyy(value)) {
        if (!flag) {
          flag = true;
          $(this).focus();
        }
        $(this).effect("highlight", {color: "red"}, 3500);
        obj.addLabelError(this, 'Please enter valid date with format dd-MM-yyyy.');
        result = true;
      }
    });

    input = $(".dd_MM_yyyy");
    input.each(function () {
      var value = obj.getValueOfElement(this);
      if (obj.isNotEmpty(value) && !obj.isFormatDateDdMMyyyy(value)) {
        if (!flag) {
          flag = true;
          $(this).focus();
        }
        $(this).effect("highlight", {color: "red"}, 3500);
        obj.addLabelError(this, 'Please enter valid date with format dd/MM/yyyy.');
        result = true;
      }
    });

    input = $(".timepickerHours");
    input.each(function () {

      var value = obj.getValueOfElement(this);
      if (obj.isEmpty(value) || !obj.isInteger(value) || parseInt(value) < 0 || parseInt(value) > 24) {
        if (!flag) {
          flag = true;
          $(this).focus();
        }
        $(this).effect("highlight", {color: "red"}, 3500);
        var parrent = $(this).parent().parent().parent().parent();
        obj.addLabelError(parrent, 'Please input hour from 0 to 24.');
        result = true;
      }
    });
    input = $(".timepickerMinutes");
    input.each(function () {

      var value = obj.getValueOfElement(this);
      if (obj.isEmpty(value) || !obj.isInteger(value) || parseInt(value) < 0 || parseInt(value) > 59) {
        if (!flag) {
          flag = true;
          $(this).focus();
        }
        $(this).effect("highlight", {color: "red"}, 3500);
        var parrent = $(this).parent().parent().parent().parent();
        obj.addLabelError(parrent, 'Please input minute from 0 to 59.');
        result = true;
      }
    });

    input = $(".duplicate");
    if (input.length > 1) {
      var arrayIndexDuplicate = [];
      for (var i = 0; i < input.length - 1; i++) {
        var valueA = obj.getValueOfElement(input[i]);
        if (obj.isEmpty(valueA)) {
          continue;
        }
        for (var j = i + 1; j < input.length; j++) {
          var valueB = obj.getValueOfElement(input[j]);
          if (obj.isEmpty(valueB)) {
            continue;
          }
          if (valueA === valueB) {
            if (arrayIndexDuplicate.indexOf(i) < 0) {
              obj.addLabelError(input[i], 'Duplicate value.');
              $(input[i]).effect("highlight", {color: "red"}, 3500);
              arrayIndexDuplicate.push(i);
            }
            if (arrayIndexDuplicate.indexOf(j) < 0) {
              obj.addLabelError(input[j], 'Duplicate value.');
              $(input[j]).effect("highlight", {color: "red"}, 3500);
              arrayIndexDuplicate.push(j);
            }

            if (!flag) {
              flag = true;
              $(input[i]).focus();
            }
            result = true;
          }
        }
      }
    }

    input = $(".notColonAndComma");
    input.each(function () {
      var value = obj.getValueOfElement(this);
      if (obj.isNotEmpty(value) && !obj.notColonAndComma(value)) {
        if (!flag) {
          flag = true;
          $(this).focus();
        }
        $(this).effect("highlight", {color: "red"}, 3500);
        obj.addLabelError(this, 'Do not contain commas and colons.');
        result = true;
      }
    });

    input = $(".sameValue");
    if (input.length > 1) {
      var valueSame = obj.getValueOfElement(input[0]);
      for (var k = 1; k < input.length; k++) {
        var valueSameB = obj.getValueOfElement(input[k]);
        if (valueSame !== valueSameB) {
          for(var l=0; l< input.length; l++) {
            obj.addLabelError(input[l], 'Not same value.');
            $(input[l]).effect("highlight", {color: "red"}, 3500);
            if (!flag) {
              flag = true;
              $(input[l]).focus();
            }
          }
          result = true;
          break;
        }
      }
    }

    return result;

  };

  obj.validateAll = function validateAll() {
    return obj.validateAllOfFrom('body');
  };

  obj.metisMenu = function () {
    $('#side-menu').metisMenu();
  };

  obj.removeLabelError = function removeLabelError() {
    $(".pError").remove();
  };

  obj.removeLabelErrorOfParent = function removeLabelErrorOfParent(parent) {
    $(parent + " .pError").remove();
  };

  obj.setMinHeightPageBody = function () {
    var topOffset = 50;
    var width = ($(window).innerWidth > 0) ? $(window).innerWidth : $(window).width;
    if (width < 768) {
      topOffset = 100; // 2-row-menu
    }
    var height = (($(window).innerHeight() > 0) ? $(window).innerHeight() : $(screen).height) - 1;
    //var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
    height = height - topOffset;
    if (height < 1) {
      height = 1;
    }
    if (height > topOffset) {
      var heightPageBody = height - $("#page-header").outerHeight(true) - 80;
      $(".page-body").css("min-height", (heightPageBody) + "px");

    }
  };

  //show Dialog
  obj.showWaitingDialog = function showWaitingDialog() {
    $(".modalCircularGPr").show();
  };

//function to close dialog
  obj.closeWaitingDialog = function closeWaitingDialog() {
    $(".modalCircularGPr").hide();
  };

  obj.showDialogOneBt = function (title, message, confirmButtonClass, iconClass, functionConfirm) {
    obj.closeWaitingDialog();
    $.confirm({
      icon: iconClass,
      title: false,
      buttons: {
        confirmButton: {
          text: 'OK',
          btnClass: confirmButtonClass,
          keys: ['enter', 'shift'],
          action: functionConfirm
        }
      },
      content: message,
      backgroundDismiss: false,
      columnClass: 'col-md-4 col-md-offset-4'
    });
  };

  obj.goToLoginScreen = function () {
    $location.url('/');
    $rootScope.$apply();
  };
  obj.showDialogSystemError = function () {

    obj.showDialogOneBt('ERROR','SYSTEM ERROR!', 'btn-danger', 'fa fa-exclamation-triangle', obj.goToLoginScreen);

  };

  obj.showDialogError = function (message) {
    obj.showDialogOneBt('ERROR',message, 'btn-danger', 'fa fa-exclamation-triangle', obj.goToLoginScreen);

  };

  obj.showDialogSuccess = function (message) {
    obj.showDialogOneBt('SUCCESS',message, 'btn-success', 'fa fa-check-square', function () {
    });

  };

  obj.haveErrorResult = function (result) {
    return obj.isNotNull(result) && obj.isNotNull(result.codeStatus) && (result.codeStatus <= 0);
  };

  obj.isShowDialogErrorResult = function (result) {
    return obj.haveErrorResult(result);
  };

  obj.showDialogErrorResult = function (result) {
    if (obj.isShowDialogErrorResult(result)) {
      obj.showDialogOneBt('ERROR',result.messageStatus, 'btn-success', 'fa fa-check-square', obj.goToLoginScreen);
      return true;
    }
    return false;
  };

  //function for get key to check session
  obj.getKey = function (keyName) {
    var keyValue = localStorage.getItem(keyName);
    return keyValue;
  };

  //function for set key after login
  obj.setKey = function (keyName, keyValue) {
    localStorage.removeItem(keyName);
    localStorage.setItem(keyName, keyValue);
  };

  //function for remove key after login
  obj.removeKey = function (keyName) {
    localStorage.removeItem(keyName);
  };

  obj.saveInfoLogin = function(infLogin){
    obj.setKey('id', infLogin.id);
    obj.setKey('account', infLogin.account);
    obj.setKey('role', infLogin.role);
    obj.setKey('authorization', infLogin.authorization);
  };

  obj.removeInfoLogin = function(){
    obj.removeKey('id');
    obj.removeKey('account');
    obj.removeKey('role');
    obj.removeKey('authorization');
  };

  obj.getInfoLogin = function(){
    $rootScope.userLogin = obj.getKey('account');
    $rootScope.roleLogin = obj.getKey('role');
    $rootScope.userLoginId = obj.getKey('id');
    $rootScope.roleAdmin = CONFIG.USER_ROLE_ADMIN;
    $rootScope.roleUser = CONFIG.USER_ROLE_USER;
  };

  obj.loadDefault =function(){
    obj.getInfoLogin();

    $rootScope.logout = function(){
      obj.showWaitingDialog();
      $http.post(CONFIG.SERVICE_BASE + 'logout', {}, obj.setHeaderAuthorization()).then(
        function (data) {
          obj.closeWaitingDialog();
          var result = data.data;
          if (obj.showDialogErrorResult(result)) {
            return;
          }
          obj.removeInfoLogin();
          $location.url('/');
        }, function (error) {
          $log.error(error);
          obj.showDialogSystemError();
        });
    };
  };

  obj.verifyAuthorization = function(role){
    obj.showWaitingDialog();
    var url = CONFIG.SERVICE_BASE + 'verify-authorization';
    if(obj.isNotNull(role)){
      url += '?role='+role;
    }
    $http.get(url, obj.setHeaderAuthorization()).then(
      function (data) {
        obj.closeWaitingDialog();
        var result = data.data;
        if (obj.showDialogErrorResult(result)) {
          return;
        }
      }, function (error) {
        $log.error(error);
        obj.showDialogSystemError();
      });
  };
  obj.setHeaderAuthorization =function(){
    return {headers:
    {
      'Authorization': obj.getKey('authorization')
    }};
  };

  obj.addZeroToNumberHaveTowCharter =function(num) {
    num = num.length > 1 ? num : '0' + num;
    return num;
  };

  obj.convertDateToStringWithFormat = function(date, sFormat) {
    if(!(date instanceof Date)){
      return '';
    }
    var s;
    if (sFormat === 'HH:mm:ss dd-MMM-yyyy') {
      s = '';
      s += obj.addZeroToNumberHaveTowCharter(date.getHours().toString());
      s += ':' + obj.addZeroToNumberHaveTowCharter(date.getMinutes().toString());
      s += ':' + obj.addZeroToNumberHaveTowCharter(date.getSeconds().toString());

      s += ' ' + obj.addZeroToNumberHaveTowCharter(date.getDate().toString());
      s += '-' + obj.addZeroToNumberHaveTowCharter((date.getMonth() + 1).toString());
      s += '-' + date.getFullYear();

      return s;
    }

    if (sFormat === CONFIG.FORMAT_DATE_YYYY_MM_DD_HH_MM_SS) {
      s = '';
      s += date.getFullYear();
      s += '-' + obj.addZeroToNumberHaveTowCharter((date.getMonth() + 1).toString());
      s += '-' + obj.addZeroToNumberHaveTowCharter(date.getDate().toString());

      s += ' '+ obj.addZeroToNumberHaveTowCharter(date.getHours().toString());
      s += ':' + obj.addZeroToNumberHaveTowCharter(date.getMinutes().toString());
      s += ':' + obj.addZeroToNumberHaveTowCharter(date.getSeconds().toString());

      return s;
    }

    if (sFormat === 'dd-MMM-yyyy') {
      s = '';
      s += obj.addZeroToNumberHaveTowCharter(date.getDate().toString());
      s += '-' + obj.addZeroToNumberHaveTowCharter((date.getMonth() + 1).toString());
      s += '-' + date.getFullYear();

      return s;
    }
    return '';
  };

  obj.convertStingToDateWithFormat = function(sDate, sFormat) {
    if (obj.isNotEmty(sDate)) {
      var monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
      var sSplit ;
      var date;
      var month;
      var day;
      var year;
      var sTimeSl;
      var house;
      var minutes;
      var second;
      //ex: Fri Mar 20 09:05:55 UTC 2015
      if (sFormat === 'EEE MMM dd HH:mm:ss UTC yyyy') {
         sSplit = sDate.split(' ');
        if (sSplit.length === 6) {
           date = new Date();

           month = monthNamesShort.indexOf(sSplit[1]);
           day = parseInt(sSplit[2]);
           year = parseInt(sSplit[5]);

           sTimeSl = sSplit[3].split(':');
           house = parseInt(sTimeSl[0]);
           minutes = parseInt(sTimeSl[1]);
           second = parseInt(sTimeSl[2]);

          date.setYear(year);
          date.setMonth(month);
          date.setDate(day);
          date.setHours(house);
          date.setMinutes(minutes);
          date.setSeconds(second);

          return date;
        }
      }

      if (sFormat === 'dd-MMM-yyyy' || sFormat === 'dd-mm-yyyy') {
         sSplit = sDate.split('-');
        if (sSplit.length === 3) {
           date = new Date();

           month = parseInt(sSplit[1]) - 1;
           day = parseInt(sSplit[0]);
           year = parseInt(sSplit[2]);

          date.setYear(year);
          date.setMonth(month);
          date.setDate(day);
          date.setHours(0);
          date.setMinutes(0);
          date.setSeconds(0);
          date.setMilliseconds(0);
          return date;
        }
      }

      if (sFormat === 'dd/mm/yyyy') {
         sSplit = sDate.split('/');
        if (sSplit.length === 3) {
           date = new Date();

           month = parseInt(sSplit[1]) - 1;
           day = parseInt(sSplit[0]);
           year = parseInt(sSplit[2]);

          date.setYear(year);
          date.setMonth(month);
          date.setDate(day);
          date.setHours(0);
          date.setMinutes(0);
          date.setSeconds(0);
          date.setMilliseconds(0);
          return date;
        }
      }

      if (sFormat === 'HH:mm:ss dd-MMM-yyyy') {
         date = new Date();
         sSplit = sDate.split(' ');

        var sSplitTime = sSplit[0].split(':');
         house = parseInt(sSplitTime[0]);
         minutes = parseInt(sSplitTime[1]);
         second = parseInt(sSplitTime[2]);

        var sSplitDate = sSplit[1].split('-');
         month = parseInt(sSplitDate[1]) - 1;
         day = parseInt(sSplitDate[0]);
         year = parseInt(sSplitDate[2]);

        date.setYear(year);
        date.setMonth(month);
        date.setDate(day);
        date.setHours(house);
        date.setMinutes(minutes);
        date.setSeconds(second);

        return date;
      }
    }
    return null;

  };

  obj.setStartDay = function(date){
    if(!(date instanceof Date)){
      return;
    }
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);

  };

  obj.setEndDay = function(date){
    if(!(date instanceof Date)){
      return;
    }
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);

  };

  obj.grenarateDataTable =function(idDivTable, idTable, arrColumn, arrHeader, listData){
    var html = '';
    html += '<table class="table table-striped table-bordered table-hover" id="'+idTable+'" >';
    html += '<thead><tr>';
    for (var i = 0; i < arrHeader.length; i++) {
      html += '<th>'+arrHeader[i]+'</th>';
    }
    html += '</tr></thead>';
    html += '</table>';
    $('#'+idDivTable).html(html);
    $('#'+idTable).dataTable({
      data: listData,
      columns: arrColumn,
      aoColumnDefs: [{ "bSortable": false, }],
      lengthMenu: [[10, 50, 100, -1], [10, 50, 100,  "All"]]
    });
  };
  return obj;
});
