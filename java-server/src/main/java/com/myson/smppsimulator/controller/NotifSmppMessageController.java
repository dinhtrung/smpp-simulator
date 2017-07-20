/**
 * 
 */
package com.myson.smppsimulator.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.myson.smppsimulator.model.ResReturnDTO;
import com.myson.smppsimulator.util.Constants;

/**
 * @author GiangDD
 *
 */

@Controller
public class NotifSmppMessageController {
	
	@MessageMapping("/"+Constants.STOMPENDPOINT)
    @SendTo(Constants.SIMPLEBROKER+"/notifsmpp")
	public ResReturnDTO sendNotifSmppMessage(ResReturnDTO sms) {
		return sms;
	}
}
