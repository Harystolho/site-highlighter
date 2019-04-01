package com.harystolho.sitehighlighter.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

	public ServiceResponse<List<Document>> listDocuments(String accountId) {
		return ServiceResponse.of(documentDao.getDocumentsByUser(accountId), ServiceStatus.OK);
	}

	public ServiceResponse<Document> getDocumentById(String accountId, String id) {
		Optional<Document> document = documentDao.getDocumentById(accountId, id);

		if (document.isPresent()) {
			return ServiceResponse.of(document.get(), ServiceStatus.OK);
		} else {
			return ServiceResponse.of(null, ServiceStatus.FAIL);
		}
	}

	public ServiceResponse<Object> saveDocument(String accountId, String id, String text) {
		if (!HighlightService.isHighlightTextValid(text)) {
			logger.severe("Content text is not valid [" + id + "]");
			return ServiceResponse.of(null, ServiceStatus.FAIL);
		}

		// TODO check if document belongs to user first
		documentDao.setDocumentText(accountId, id, text);

		return ServiceResponse.of("{}", ServiceStatus.OK);
	}

	/**
	 * 
	 * @param asList
	 * @param id
	 * @param status the status is something similar to a priority for documents
	 * @return
	 */
	public ServiceResponse<Object> changeDocumentStatus(String accountId, String id, String status) {
		DocumentStatus docStatus = DocumentStatus.statusFromString(status);

		documentDao.setDocumentStatus(accountId, id, docStatus);

		return ServiceResponse.of("{}", ServiceStatus.OK);
	}

	public ServiceResponse<ArrayNode> getDocumentsByStatus(String accountId, String status) {
		ArrayNode array = new ArrayNode(new JsonNodeFactory(false));

		List<Document> matches = documentDao.getDocumentsByStatus(accountId, DocumentStatus.statusFromString(status));

		matches.forEach((doc) -> {
			ObjectNode node = new ObjectNode(new JsonNodeFactory(false)); // TODO extract ObjectNode creation to another
																			// method

			node.put("id", doc.getId());
			node.put("title", doc.getTitle());

			array.add(node);
		});

		return ServiceResponse.of(array, ServiceStatus.OK);
	}

	public ServiceResponse<Void> deleteDocument(String accountId, String id) {
		documentDao.deleteDocument(accountId, id);

		return ServiceResponse.of(null, ServiceStatus.OK);
	}

	public ServiceResponse<Object> changeDocumentTags(String accountId, String docId, String tags) {
		List<String> tagArray = new ArrayList<>(); // ArraysList is modifiable, Arrays.asList() is not
		tagArray.addAll(Arrays.asList(tags.split(",")));

		tagArray.removeIf(tag -> tag == null || tag.isEmpty());

		documentDao.updateDocumentTags(accountId, docId, tagArray);

		return ServiceResponse.of(null, ServiceStatus.OK);
	}

	public ServiceResponse<Map<String, List<String>>> getDocumentsTags(String accountId) {
		List<Document> documents = documentDao.getTagsByAccountId(accountId);

		// <Tag, List<Document Id>>
		Map<String, List<String>> tags = new HashMap<>();

		documents.forEach((doc) -> {
			if (doc.getTags() != null) {
				doc.getTags().forEach((tag) -> {
					List<String> docIds = tags.get(tag);

					if (docIds == null) {
						docIds = new ArrayList<>();
						docIds.add(doc.getId());

						tags.put(tag, docIds);
					} else {
						docIds.add(doc.getId());
					}
				});
			}
		});

		return ServiceResponse.of(tags, ServiceStatus.OK);
	}

	public ServiceResponse<Object> changeDocumentTitle(String accountId, String docId, String title) {
		documentDao.updateDocumentTitle(accountId, docId, title);

		return ServiceResponse.of(null, ServiceStatus.OK);
	}

}
