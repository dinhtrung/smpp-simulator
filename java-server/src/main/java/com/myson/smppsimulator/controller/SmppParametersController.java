/**
 * 
 */
package com.myson.smppsimulator.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.myson.smppsimulator.model.SmppSimulatorParameters;
import com.myson.smppsimulator.service.SmppParametersService;
import com.myson.smppsimulator.util.Constants;

/**
 * @author GiangDD
 *
 */
@Controller
@RequestMapping(Constants.MAPPING_REQUEST_RS + "/smpp-paramaters")
public class SmppParametersController {

	@Autowired
	private SmppParametersService smppParametersService;

	@RequestMapping(value = "/get-config", method = { RequestMethod.GET }, produces = "application/json;charset=UTF-8")
	@ResponseBody
	public SmppSimulatorParameters getConfig() {

		return smppParametersService.getCofGeneralParameters();
	}

	@RequestMapping(value = "/save-config", method = {
			RequestMethod.POST }, produces = "application/json;charset=UTF-8")
	@ResponseBody
	public void createOrUpdateSmppSession(@RequestBody SmppSimulatorParameters smppParameters) {
		smppParametersService.saveConfSmmppParameters(smppParameters);
	}
}
