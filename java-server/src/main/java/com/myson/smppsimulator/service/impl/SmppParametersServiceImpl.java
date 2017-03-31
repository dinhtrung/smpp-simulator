package com.myson.smppsimulator.service.impl;

import javax.annotation.PostConstruct;

import org.springframework.stereotype.Service;

import com.myson.smppsimulator.model.SmppSimulatorParameters;
import com.myson.smppsimulator.service.SmppParametersService;

@Service("SmppParametersService")
public class SmppParametersServiceImpl implements SmppParametersService {

	private static SmppSimulatorParameters data;
	private static SmppParametersServiceImpl smppParametersService;

	public static SmppParametersServiceImpl getInstance() {
		return smppParametersService;
	}
	private SmppParametersServiceImpl() {
	}
	
	@PostConstruct
	private void load() {
		data = new SmppSimulatorParameters();
		smppParametersService = this;
	}

	@Override
	public SmppSimulatorParameters getCofGeneralParameters() {
		return data;
	}

	@Override
	public void saveConfSmmppParameters(SmppSimulatorParameters smppParameters) {
		data = smppParameters;
		
	}

}
