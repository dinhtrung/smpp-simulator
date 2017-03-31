package com.myson.smppsimulator.service;

import org.springframework.web.multipart.MultipartFile;

import com.myson.smppsimulator.model.ResReturnDTO;

public interface SmppTestingService extends SmppAccepter{
	ResReturnDTO startASession();
	ResReturnDTO stopASession();
	ResReturnDTO refreshState();
	ResReturnDTO sendBadPacket();
	ResReturnDTO submitMessage();
	ResReturnDTO bulkSendingRandom();
	ResReturnDTO stopBulkSending();
	ResReturnDTO bulkSendingFromPcapFile(MultipartFile file, int port);
}
