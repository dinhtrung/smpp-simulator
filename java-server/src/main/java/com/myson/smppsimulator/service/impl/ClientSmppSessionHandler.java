/*
 * TeleStax, Open Source Cloud Communications  Copyright 2012. 
 * TeleStax and individual contributors
 * by the @authors tag. See the copyright.txt in the distribution for a
 * full listing of individual contributors.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 */

package com.myson.smppsimulator.service.impl;

import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.channels.ClosedChannelException;
import java.nio.charset.CharacterCodingException;
import java.nio.charset.Charset;
import java.util.Date;
import java.util.concurrent.TimeUnit;

import org.apache.log4j.Logger;
import org.mobicents.protocols.ss7.map.api.smstpdu.DataCodingScheme;
import org.mobicents.protocols.ss7.map.datacoding.GSMCharset;
import org.mobicents.protocols.ss7.map.datacoding.GSMCharsetDecoder;
import org.mobicents.protocols.ss7.map.datacoding.GSMCharsetDecodingData;
import org.mobicents.protocols.ss7.map.datacoding.Gsm7EncodingStyle;
import org.mobicents.protocols.ss7.map.smstpdu.DataCodingSchemeImpl;
import org.mobicents.smsc.library.ErrorCode;
import org.mobicents.smsc.library.MessageUtil;

import com.myson.smppsimulator.model.SmppSimulatorParameters;
import com.myson.smppsimulator.model.SmppSimulatorParameters.DeliveryResponseGenerating;
import com.myson.smppsimulator.util.CodeStatusUtil;
import com.cloudhopper.commons.util.windowing.WindowFuture;
import com.cloudhopper.smpp.PduAsyncResponse;
import com.cloudhopper.smpp.SmppConstants;
import com.cloudhopper.smpp.impl.DefaultSmppSessionHandler;
import com.cloudhopper.smpp.pdu.BaseSm;
import com.cloudhopper.smpp.pdu.BaseSmResp;
import com.cloudhopper.smpp.pdu.DeliverSm;
import com.cloudhopper.smpp.pdu.PduRequest;
import com.cloudhopper.smpp.pdu.PduResponse;
import com.cloudhopper.smpp.tlv.Tlv;
import com.cloudhopper.smpp.type.Address;
import com.cloudhopper.smpp.type.RecoverablePduException;
import com.cloudhopper.smpp.type.UnrecoverablePduException;

/**
 * 
 * @author sergey vetyutnev
 * 
 */
public class ClientSmppSessionHandler extends DefaultSmppSessionHandler {

	private static Logger logger = Logger.getLogger(ClientSmppSessionHandler.class);
	private SmppTestingServiceImpl testingForm;
	private SmppParametersServiceImpl smppParametersService;

	private static Charset utf8Charset = Charset.forName("UTF-8");
	private static Charset ucs2Charset = Charset.forName("UTF-16BE");
	private static Charset isoCharset = Charset.forName("ISO-8859-1");
	private static Charset gsm7Charset = new GSMCharset("GSM", new String[] {});

	public ClientSmppSessionHandler() {
		this.testingForm = SmppTestingServiceImpl.getInstance();
		this.smppParametersService = SmppParametersServiceImpl.getInstance();
	}

	@Override
	public void fireChannelUnexpectedlyClosed() {
		testingForm.addMessage("ChannelUnexpectedlyClosed",
				"SMPP channel unexpectedly closed by a peer or by TCP connection dropped");

		testingForm.doStop();
	}

	// private int incMsgCnt = 0;

	@SuppressWarnings("rawtypes")
	@Override
	public PduResponse firePduRequestReceived(PduRequest pduRequest) {

		// incMsgCnt++;
		// if (incMsgCnt > 150) {
		// incMsgCnt = 0;
		// try {
		// Thread.sleep(60000);
		// } catch (InterruptedException e) {
		// // TODO Auto-generated catch block
		// e.printStackTrace();
		// }
		// }

		testingForm.addMessage("PduRequestReceived: " + pduRequest.getName(), pduRequest.toString());
		this.testingForm.messagesRcvd.incrementAndGet();

		PduResponse resp = pduRequest.createResponse();

		// here we can insert responses
		if (pduRequest.getCommandId() == SmppConstants.CMD_ID_DELIVER_SM
				|| pduRequest.getCommandId() == SmppConstants.CMD_ID_DATA_SM
				|| pduRequest.getCommandId() == SmppConstants.CMD_ID_SUBMIT_SM) {

			if (pduRequest instanceof BaseSm) {
				BaseSm dev = (BaseSm) pduRequest;

				byte[] data = dev.getShortMessage();
				if (dev.getShortMessageLength() == 0) {
					// Probably the message_payload Optional Parameter is being
					// used
					Tlv messagePaylod = dev.getOptionalParameter(SmppConstants.TAG_MESSAGE_PAYLOAD);
					if (messagePaylod != null) {
						data = messagePaylod.getValue();
					}
				}

				DataCodingScheme dcs = new DataCodingSchemeImpl(dev.getDataCoding());

				boolean udhPresent = (dev.getEsmClass() & SmppConstants.ESM_CLASS_UDHI_MASK) != 0;
				byte[] textPart = data;
				byte[] udhData = null;
				if (udhPresent && data.length > 2) {
					// UDH exists
					int udhLen = (data[0] & 0xFF) + 1;
					if (udhLen <= data.length) {
						textPart = new byte[textPart.length - udhLen];
						udhData = new byte[udhLen];
						System.arraycopy(data, udhLen, textPart, 0, textPart.length);
						System.arraycopy(data, 0, udhData, 0, udhLen);
					}
				}

				String s = null;
				switch (dcs.getCharacterSet()) {
				case GSM7:
				case UCS2:
					if (this.smppParametersService.getCofGeneralParameters().getSmppEncoding() == 0) {
						s = new String(textPart, utf8Charset);
					} else if (this.smppParametersService.getCofGeneralParameters().getSmppEncoding() == 1) {
						s = new String(textPart, ucs2Charset);
					} else {
						GSMCharsetDecoder decoder = (GSMCharsetDecoder) gsm7Charset.newDecoder();
						decoder.setGSMCharsetDecodingData(
								new GSMCharsetDecodingData(Gsm7EncodingStyle.bit8_smpp_style, Integer.MAX_VALUE, 0));
						ByteBuffer bb = ByteBuffer.wrap(textPart);
						CharBuffer bf = null;
						try {
							bf = decoder.decode(bb);
						} catch (CharacterCodingException e) {
							logger.error("ClientSmppSessionHandler", e);
							this.testingForm.addMessage(CodeStatusUtil.ADD_MESSAGE, "Have Exception. Can't doStop", e.getMessage());
						}
						s = bf.toString();
					}
					break;
				case GSM8:
					s = new String(textPart, isoCharset);
					break;
				default:
					break;
				}

				String s2 = "";
				if (udhData != null) {
					StringBuilder sb = new StringBuilder();
					sb.append("[");
					int i2 = 0;
					for (byte b : udhData) {
						int i1 = (b & 0xFF);
						if (i2 == 0)
							i2 = 1;
						else
							sb.append(", ");
						sb.append(i1);
					}
					sb.append("] ");
					s2 = sb.toString();
				}

				testingForm.addMessage("TextReceived: ", s2 + s);

				// try {
				// Thread.sleep(1000);
				// } catch (InterruptedException e) {
				// // TODO Auto-generated catch block
				// e.printStackTrace();
				// }
			}

			if (this.smppParametersService.getCofGeneralParameters().isRejectIncomingDeliveryMessage()) {
				resp.setCommandStatus(1);
			}

			long mId = this.testingForm.getMsgIdGenerator().incrementAndGet();

			String msgId;
			String msgId2;
			String msgId3;
			if (this.smppParametersService.getCofGeneralParameters().isIdResponseTlv()) {
				msgId = String.format("%08X", mId);
				msgId2 = MessageUtil.createMessageIdString(mId);
				msgId3 = msgId;
				if (this.smppParametersService.getCofGeneralParameters().isWrongMessageIdInDlr())
					msgId3 = msgId3 + "XYZ";
			} else {
				msgId = MessageUtil.createMessageIdString(mId);
				msgId2 = MessageUtil.createMessageIdString(mId);
				if (this.smppParametersService.getCofGeneralParameters().isWrongMessageIdInDlr())
					msgId2 = msgId2 + "XYZ";
				msgId3 = null;
			}

			((BaseSmResp) resp).setMessageId(msgId);

			// scheduling of delivery receipt if needed
			if (this.smppParametersService.getCofGeneralParameters()
					.getDeliveryResponseGenerating() != DeliveryResponseGenerating.No) {
				int delay = 100;
				if (this.smppParametersService.getCofGeneralParameters().isDeliveryResponseAfter2Min())
					delay = 2 * 60 * 1000;
				this.testingForm.getExecutor()
						.schedule(
								new DeliveryReceiptSender(this.smppParametersService.getCofGeneralParameters()
										.getDeliveryResponseGenerating(), new Date(), msgId2, msgId3),
								delay, TimeUnit.MILLISECONDS);
			}

			testingForm.addMessage("PduResponseSent: " + resp.getName(), resp.toString());
		}

		return resp;
	}

	@SuppressWarnings("rawtypes")
	@Override
	public void firePduRequestExpired(PduRequest pduRequest) {
		testingForm.addMessage("PduRequestExpired: " + pduRequest.getName(), pduRequest.toString());
	}

	@Override
	public void fireExpectedPduResponseReceived(PduAsyncResponse pduAsyncResponse) {
		this.testingForm.responsesRcvd.incrementAndGet();
		if (this.testingForm.timer == null) {
			testingForm.addMessage("Response=" + pduAsyncResponse.getResponse().getName(),
					"Req: " + pduAsyncResponse.getRequest().toString() + "\nResp: "
							+ pduAsyncResponse.getResponse().toString());
		}
	}

	@Override
	public void fireUnexpectedPduResponseReceived(PduResponse pduResponse) {
		testingForm.addMessage("UnexpectedPduResponseReceived: " + pduResponse.getName(), pduResponse.toString());
	}

	@Override
	public void fireUnrecoverablePduException(UnrecoverablePduException e) {
		testingForm.addMessage("UnrecoverablePduException", e.toString());

		testingForm.doStop();
	}

	@Override
	public void fireRecoverablePduException(RecoverablePduException e) {
		testingForm.addMessage("RecoverablePduException", e.toString());
	}

	@Override
	public void fireUnknownThrowable(Throwable t) {
		if (t instanceof ClosedChannelException) {
			testingForm.addMessage("UnknownThrowable",
					"Unknown throwable received, but it was a ClosedChannelException, calling fireChannelUnexpectedlyClosed instead");
			fireChannelUnexpectedlyClosed();
		} else {
			testingForm.addMessage("UnknownThrowable", t.toString());

			testingForm.doStop();
		}
	}

	// @Override
	// public String lookupResultMessage(int commandStatus) {
	// return null;
	// }
	//
	// @Override
	// public String lookupTlvTagName(short tag) {
	// return null;
	// }

	public class DeliveryReceiptSender implements Runnable {

		private DeliveryResponseGenerating deliveryResponseGenerating;
		private Date submitDate;
		private String messageId;
		private String messageIdTlv;

		public DeliveryReceiptSender(DeliveryResponseGenerating deliveryResponseGenerating, Date submitDate,
				String messageId, String messageIdTlv) {
			this.deliveryResponseGenerating = deliveryResponseGenerating;
			this.submitDate = submitDate;
			this.messageId = messageId;
			this.messageIdTlv = messageIdTlv;
		}

		@SuppressWarnings({ "rawtypes", "unused" })
		@Override
		public void run() {
			SmppSimulatorParameters param = smppParametersService.getCofGeneralParameters();

			BaseSm pdu;
			// switch(param.getSendingMessageType()){
			// case SubmitSm:
			// SubmitSm submitPdu = new SubmitSm();
			// pdu = submitPdu;
			// break;
			// case DataSm:
			// DataSm dataPdu = new DataSm();
			// pdu = dataPdu;
			// break;
			// case DeliverSm:
			// DeliverSm deliverPdu = new DeliverSm();
			// pdu = deliverPdu;
			// break;
			// case SubmitMulti:
			// SubmitMulti submitMulti = new SubmitMulti();
			// pdu = submitMulti;
			// break;
			// default:
			// return;
			// }
			DeliverSm deliverPdu = new DeliverSm();
			pdu = deliverPdu;

			pdu.setSourceAddress(new Address((byte) param.getSourceTON().getCode(),
					(byte) param.getSourceNPI().getCode(), param.getSourceAddress()));

			pdu.setDestAddress(new Address(pdu.getSourceAddress().getTon(), pdu.getSourceAddress().getNpi(),
					pdu.getSourceAddress().getAddress()));

			pdu.setEsmClass((byte) (0x04 + 1)); // delivery receipt + datagramm
												// mode

			pdu.setDataCoding((byte) 0);
			pdu.setRegisteredDelivery((byte) 0);

			boolean tempFailure = false;
			boolean delivered = true;
			ErrorCode errorCode = ErrorCode.SUCCESS;
			if (deliveryResponseGenerating == DeliveryResponseGenerating.Error8) {
				delivered = false;
				errorCode = ErrorCode.ABSENT_SUBSCRIBER;
			}

			String rcpt = MessageUtil.createDeliveryReceiptMessage(messageId, submitDate, new Date(), errorCode.getCode(),
					"origMsgText", delivered, null, tempFailure);
			byte[] buf = rcpt.getBytes(utf8Charset);

			if (messageIdTlv != null) {
				byte[] data0 = messageIdTlv.getBytes();
				byte[] data = new byte[data0.length + 1];
				System.arraycopy(data0, 0, data, 0, data0.length);
				Tlv tlv = new Tlv(SmppConstants.TAG_RECEIPTED_MSG_ID, data, "rec_msg_id");
				pdu.addOptionalParameter(tlv);
			}

			try {
				pdu.setShortMessage(buf);

				testingForm.addMessage("Adding receipt=" + pdu.getName(), pdu.toString() + " Text:" + rcpt);

				WindowFuture<Integer, PduRequest, PduResponse> future0 = testingForm.getSmppSession().sendRequestPdu(pdu,
						10000, false);
			} catch (Exception e) {
				logger.error("ClientSmppSessionHandler", e);
			}
		}
	}

}
