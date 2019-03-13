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

	public ServiceResponse<Void> saveHighlight(List<Cookie> cookies, String text, String path, String title) {
		if (!isHighlightTextValid(text)) {
			logger.severe("text is null");
			return ServiceResponse.of(null, ServiceStatus.FAIL);
		}

		documentDao.addHighlightToDocument(cookies, new Highlight(text, path, title));

		return ServiceResponse.of(null, ServiceStatus.OK);
	}

	public ServiceResponse<Void> saveHighlight(List<Cookie> cookies, String docId, String text) {
		if (!isHighlightTextValid(text)) {
			logger.severe("text is null [" + docId + "]");
			return ServiceResponse.of(null, ServiceStatus.FAIL);
		}

		documentDao.addHighlightToDocument(cookies, docId, new Highlight(text, "", ""));

		return ServiceResponse.of(null, ServiceStatus.OK);
	}

	public ServiceResponse<Document> listHighlights(List<Cookie> cookies, String path) {
		Document document = documentDao.getDocumentByPath(cookies, path);

		if (document != null) {
			return ServiceResponse.of(document, ServiceStatus.OK);
		} else {
			return ServiceResponse.of(null, ServiceStatus.FAIL);
		}
	}

	public static boolean isHighlightTextValid(String text) {
		return text != null && !text.trim().equals("");
	}

}
