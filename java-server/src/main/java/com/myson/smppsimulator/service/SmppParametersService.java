/**
 * 
 */
package com.myson.smppsimulator.service;

import com.myson.smppsimulator.model.SmppSimulatorParameters;

/**
 * @author GiangDD
 *
 */
public interface SmppParametersService {

	SmppSimulatorParameters getCofGeneralParameters();
	
	void saveConfSmmppParameters(SmppSimulatorParameters smppParameters);
}
