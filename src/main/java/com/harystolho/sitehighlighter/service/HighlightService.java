package com.harystolho.sitehighlighter.service;

import java.util.List;
import java.util.logging.Logger;

import javax.servlet.http.Cookie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.harystolho.sitehighlighter.dao.HighlightDAO;
import com.harystolho.sitehighlighter.model.Highlight;
import com.harystolho.sitehighlighter.service.ServiceResponse.ServiceStatus;

@Service
public class HighlightService {

	private static final Logger logger = Logger.getLogger(HighlightService.class.getName());

	private HighlightDAO highlightDao;

	@Autowired
	public HighlightService(HighlightDAO highlightDAO) {
		highlightDao = highlightDAO;
	}

	public ServiceResponse<Void> saveHighlight(List<Cookie> cookies, String text, String path) {
		if (!isHighlightTextValid(text)) {
			logger.severe("text is null");
			return ServiceResponse.of(null, ServiceStatus.FAIL);
		}

		// TODO add cookie verification

		highlightDao.saveHighlight(new Highlight(text, path));

		return ServiceResponse.of(null, ServiceStatus.OK);
	}

	public ServiceResponse<List<Highlight>> listHighlights(List<Cookie> asList, String path) {
		return ServiceResponse.of(highlightDao.getHighlightsByPath(path), ServiceStatus.OK);
	}

	private boolean isHighlightTextValid(String text) {
		return text != null && !text.trim().equals("");
	}

}
