package com.harystolho.sitehighlighter.service;

import java.util.logging.Logger;

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

	public ServiceResponse<Void> saveHighlight(String accountId, String text, String path, String title) {
		if (!isHighlightTextValid(text)) {
			logger.severe("text is null");
			return ServiceResponse.of(null, ServiceStatus.FAIL);
		}

		path = removeSlashAtTheEndOfPath(path);

		Document document = documentDao.getDocumentByPath(accountId, path);

		if (document == null) {
			document = documentDao.createDocument(accountId, title, path);
		}

		documentDao.addHighlightToDocument(accountId, document.getId(), new Highlight(text, path, title));

		return ServiceResponse.of(null, ServiceStatus.OK);
	}

	public ServiceResponse<Void> saveHighlightToDocument(String accountId, String docId, String text) {
		if (!isHighlightTextValid(text)) {
			logger.severe("text is null [" + docId + "]");
			return ServiceResponse.of(null, ServiceStatus.FAIL);
		}

		documentDao.addHighlightToDocument(accountId, docId, new Highlight(text, "", ""));

		return ServiceResponse.of(null, ServiceStatus.OK);
	}

	public static boolean isHighlightTextValid(String text) {
		return text != null && !text.trim().equals("");
	}

	/**
	 * If the last char of the path is a '/' remove it;
	 * 
	 * Example: java.com/ --> java.com
	 * 
	 * @param path
	 * @return
	 */
	private String removeSlashAtTheEndOfPath(String path) {
		path = path.trim();
		return path.charAt(path.length() - 1) == '/' ? path.substring(0, path.length() - 1) : path;
	}

}
