package com.harystolho.sitehighlighter.service;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

import javax.servlet.http.Cookie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.harystolho.sitehighlighter.dao.DocumentDAO;
import com.harystolho.sitehighlighter.model.Document;
import com.harystolho.sitehighlighter.service.ServiceResponse.ServiceStatus;

@Service
public class DocumentService {

	private static final Logger logger = Logger.getLogger(DocumentService.class.getName());

	private DocumentDAO documentDao;

	@Autowired
	public DocumentService(DocumentDAO documentDAO) {
		this.documentDao = documentDAO;
	}

	public ServiceResponse<List<Document>> listDocuments(List<Cookie> cookies) {
		return ServiceResponse.of(documentDao.getDocumentsByUser(cookies), ServiceStatus.OK);
	}

	public ServiceResponse<Document> getDocument(List<Cookie> cookies, int id) {
		Optional<Document> document = documentDao.getDocumentById(cookies, id);

		if (document.isPresent()) {
			return ServiceResponse.of(document.get(), ServiceStatus.OK);
		} else {
			return ServiceResponse.of(null, ServiceStatus.FAIL);
		}
	}

	public ServiceResponse<Object> saveDocument(List<Cookie> cookies, String id, String text) {
		if (!HighlightService.isHighlightTextValid(text)) {
			logger.severe("Content text is not valid [" + id + "]");
			return ServiceResponse.of(null, ServiceStatus.FAIL);
		}

		try {
			documentDao.updateDocumentText(Integer.parseInt(id), text);
		} catch (Exception e) {
			logger.severe(String.format("Can't convert id to int [%s]", id));
			return ServiceResponse.of(null, ServiceStatus.FAIL);
		}

		return ServiceResponse.of("{}", ServiceStatus.OK);
	}

}
