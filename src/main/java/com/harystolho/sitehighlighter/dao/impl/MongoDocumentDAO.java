package com.harystolho.sitehighlighter.dao.impl;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.harystolho.sitehighlighter.dao.DocumentDAO;
import com.harystolho.sitehighlighter.model.Document;
import com.harystolho.sitehighlighter.model.Highlight;
import com.harystolho.sitehighlighter.utils.DocumentStatus;

@Service
public class MongoDocumentDAO implements DocumentDAO {

	private static final Logger logger = Logger.getLogger(MongoDocumentDAO.class.getName());

	private final MongoOperations mongoOperations;

	@Autowired
	public MongoDocumentDAO(MongoOperations mongoOperations) {
		this.mongoOperations = mongoOperations;
	}

	@Override
	public void addHighlightToDocument(String accountId, String docId, Highlight highlight) {
		Query query = Query.query(Criteria.where("_id").is(docId).and("owner").is(accountId));

		Document doc = mongoOperations.findOne(query, Document.class);

		if (doc != null) {
			doc.addHighlight(highlight);
			mongoOperations.findAndReplace(query, doc);
		} else {
			logger.severe(String.format("Can't find document[%s] to add the highlight", doc.getId()));
		}
	}

	@Override
	public List<Document> getDocumentsByUser(String accountId) {
		// TODO filter by user id
		return mongoOperations.findAll(Document.class);
	}

	@Override
	public Document getDocumentByPath(String accountId, String path) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Optional<Document> getDocumentById(String accountId, String docId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void setDocumentText(String accountId, String docId, String text) {
		// TODO Auto-generated method stub

	}

	@Override
	public void setDocumentStatus(String accountId, String docId, DocumentStatus status) {
		// TODO Auto-generated method stub

	}

	@Override
	public List<Document> getDocumentsByStatus(String accountId, DocumentStatus status) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Document createDocument(String accountId, String docTitle, String path) {
		Document doc = new Document(docTitle, accountId, path);
		return mongoOperations.insert(doc);
	}

}
