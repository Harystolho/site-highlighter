package com.harystolho.sitehighlighter.service;

import java.util.logging.Logger;

import javax.servlet.http.Cookie;

import org.springframework.stereotype.Service;

import com.harystolho.sitehighlighter.service.ServiceResponse.ServiceStatus;

@Service
public class HighlightService {

	private static final Logger logger = Logger.getLogger(HighlightService.class.getName());

	public ServiceResponse<Void> saveHighlight(Cookie[] cookies, String text) {
		if (text == null || text.trim().equals("")) {
			logger.severe("text is null");
			return ServiceResponse.of(null, ServiceStatus.FAIL);
		}
		
		return ServiceResponse.of(null, ServiceStatus.OK);
	}

}
