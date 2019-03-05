package com.harystolho.sitehighlighter.dao;

import java.util.List;
import java.util.Optional;

import javax.servlet.http.Cookie;

import com.harystolho.sitehighlighter.model.Document;
import com.harystolho.sitehighlighter.model.Highlight;

public interface DocumentDAO {

	void addHighlightToDocument(Highlight highlight);

	Document getHighlightsByPath(String path);

	List<Document> getDocumentsByUser(List<Cookie> cookies); // TODO remove cookie list from DAO

	Optional<Document> getDocumentById(List<Cookie> cookies, int id);

	void updateDocumentText(int id, String text);

}
