package com.harystolho.sitehighlighter.dao.impl;

import java.util.List;
import java.util.Optional;

import javax.servlet.http.Cookie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;

import com.harystolho.sitehighlighter.dao.DocumentDAO;
import com.harystolho.sitehighlighter.model.Document;
import com.harystolho.sitehighlighter.model.Highlight;
import com.harystolho.sitehighlighter.utils.DocumentStatus;

public class MongoDocumentDAO implements DocumentDAO {

	private MongoOperations mongoOperations;
	
	@Autowired
	public MongoDocumentDAO(MongoOperations mongoOperations) {
		this.mongoOperations = mongoOperations;
	}
	
	@Override
	public void addHighlightToDocument(Highlight highlight) {
		// TODO Auto-generated method stub
	}

	@Override
	public void addHighlightToDocument(int docId, Highlight highlight) {
		// TODO Auto-generated method stub

	}

	@Override
	public Document getHighlightsByPath(String path) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Document> getDocumentsByUser(List<Cookie> cookies) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Optional<Document> getDocumentById(List<Cookie> cookies, int id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void updateDocumentText(int id, String text) {
		// TODO Auto-generated method stub

	}

	@Override
	public void setDocumentStatus(int id, DocumentStatus status) {
		// TODO Auto-generated method stub

	}

	@Override
	public List<Document> getDocumentsByStatus(DocumentStatus status) {
		// TODO Auto-generated method stub
		return null;
	}

}
