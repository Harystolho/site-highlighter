package com.harystolho.sitehighlighter.dao;

import java.util.List;
import java.util.Optional;

import javax.servlet.http.Cookie;

import com.harystolho.sitehighlighter.model.Document;
import com.harystolho.sitehighlighter.model.Highlight;
import com.harystolho.sitehighlighter.utils.DocumentStatus;

public interface DocumentDAO {

	/**
	 * Adds the highlight to the document that has the same id
	 * 
	 * @param docId
	 * @param highlight
	 */
	void addHighlightToDocument(String accountId, String docId, Highlight highlight);

	Document getDocumentByPath(String accountId, String path);

	List<Document> getDocumentsByUser(String accountId); // TODO remove cookie list from DAO

	Optional<Document> getDocumentById(String accountId, String docId);

	void setDocumentText(String accountId, String docId, String text);

	void setDocumentStatus(String accountId, String docId, DocumentStatus status);

	List<Document> getDocumentsByStatus(String accountId, DocumentStatus status);

	Document createDocument(String accountId, String docTitle);

}
