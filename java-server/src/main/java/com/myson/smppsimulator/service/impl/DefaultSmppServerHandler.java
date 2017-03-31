package com.myson.smppsimulator.service.impl;

import com.cloudhopper.smpp.SmppConstants;
import com.cloudhopper.smpp.SmppServerHandler;
import com.cloudhopper.smpp.SmppServerSession;
import com.cloudhopper.smpp.SmppSessionConfiguration;
import com.cloudhopper.smpp.pdu.BaseBind;
import com.cloudhopper.smpp.pdu.BaseBindResp;

import com.cloudhopper.smpp.type.SmppProcessingException;

/**
 * 
 * @author sergey vetyutnev
 * 
 */
public class DefaultSmppServerHandler implements SmppServerHandler {

	private SmppTestingServiceImpl testingForm;

	public DefaultSmppServerHandler() {
        this.testingForm = SmppTestingServiceImpl.getInstance();
    }

    @Override
    public void sessionBindRequested(Long sessionId, SmppSessionConfiguration sessionConfiguration, final BaseBind bindRequest) throws SmppProcessingException {
        if (this.testingForm.getSmppSession() != null) {
            throw new SmppProcessingException(SmppConstants.STATUS_INVBNDSTS);
        }

//        sessionConfiguration.setAddressRange(bindRequestAddressRange);
//
//        sessionConfiguration.setCountersEnabled(esme.isCountersEnabled());

        sessionConfiguration.setName("Test SMPP session");
    }

    @Override
    public void sessionCreated(Long sessionId, SmppServerSession session, BaseBindResp preparedBindResponse) throws SmppProcessingException {
        if (this.testingForm.getSmppSession() != null) {
            throw new SmppProcessingException(SmppConstants.STATUS_INVBNDSTS);
        }

        this.testingForm.addMessage("Session created", session.getConfiguration().getSystemId());
        this.testingForm.setSmppSession(session);
        session.serverReady(new ClientSmppSessionHandler());
    }

    @Override
    public void sessionDestroyed(Long sessionId, SmppServerSession session) {
        this.testingForm.addMessage("Session destroyed", session.getConfiguration().getSystemId());
        this.testingForm.setSmppSession(null);

        session.destroy();
    }

}
