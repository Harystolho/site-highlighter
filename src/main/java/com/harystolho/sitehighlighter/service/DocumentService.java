package com.harystolho.sitehighlighter.service;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

import javax.management.ObjectName;
import javax.servlet.http.Cookie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.harystolho.sitehighlighter.dao.DocumentDAO;
import com.harystolho.sitehighlighter.model.Document;
import com.harystolho.sitehighlighter.service.ServiceResponse.ServiceStatus;
import com.harystolho.sitehighlighter.utils.DocumentStatus;

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

	/**
	 * 
	 * @param asList
	 * @param id
	 * @param status the status is something similar to a priority for documents
	 * @return
	 */
	public ServiceResponse<Object> changeDocumentStatus(List<Cookie> asList, String id, String status) {
		DocumentStatus docStatus = DocumentStatus.statusFromString(status);

		try {
			documentDao.setDocumentStatus(Integer.parseInt(id), docStatus);
		} catch (Exception e) {
			logger.severe(String.format("Can't convert id to int [%s]", id));
			return ServiceResponse.of(null, ServiceStatus.FAIL);
		}

		return ServiceResponse.of("{}", ServiceStatus.OK);
	}

	public ServiceResponse<ArrayNode> getDocumentsByStatus(List<Cookie> cookies, String status) {
		ArrayNode array = new ArrayNode(new JsonNodeFactory(false));

		List<Document> matches = documentDao.getDocumentsByStatus(DocumentStatus.statusFromString(status));

		matches.forEach((doc) -> {
			ObjectNode node = new ObjectNode(new JsonNodeFactory(false));

			node.put("id", doc.getId());
			node.put("title", doc.getTitle());

			array.add(node);
		});

		return ServiceResponse.of(array, ServiceStatus.OK);
	}

}
