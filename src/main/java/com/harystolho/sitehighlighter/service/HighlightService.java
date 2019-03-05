package com.harystolho.sitehighlighter.service;

import java.util.List;
import java.util.logging.Logger;

import javax.servlet.http.Cookie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.harystolho.sitehighlighter.dao.DocumentDAO;
import com.harystolho.sitehighlighter.model.Document;
import com.harystolho.sitehighlighter.model.Highlight;
import com.harystolho.sitehighlighter.service.ServiceResponse.ServiceStatus;

@Service
public class HighlightService {

	private static final Logger logger = Logger.getLogger(HighlightService.class.getName());

	private DocumentDAO documentDao;

	@Autowired
	public HighlightService(DocumentDAO highlightDAO) {
		documentDao = highlightDAO;
	}

	public ServiceResponse<Void> saveHighlight(List<Cookie> cookies, String text, String path) {
		if (!isHighlightTextValid(text)) {
			logger.severe("text is null");
			return ServiceResponse.of(null, ServiceStatus.FAIL);
		}

		// TODO add cookie verification

		documentDao.addHighlightToDocument(new Highlight(text, path));

		return ServiceResponse.of(null, ServiceStatus.OK);
	}

	public ServiceResponse<Document> listHighlights(List<Cookie> asList, String path) {
		Document document = documentDao.getHighlightsByPath(path);

		if (document != null) {
			return ServiceResponse.of(document, ServiceStatus.OK);
		} else {
			return ServiceResponse.of(null, ServiceStatus.FAIL);
		}
	}

	private boolean isHighlightTextValid(String text) {
		return text != null && !text.trim().equals("");
	}

}
