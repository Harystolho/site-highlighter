package com.harystolho.sitehighlighter.dao;

import java.util.List;

import javax.servlet.http.Cookie;

import com.harystolho.sitehighlighter.model.Document;
import com.harystolho.sitehighlighter.model.Highlight;
import com.harystolho.sitehighlighter.service.ServiceResponse;

public interface DocumentDAO {

	void addHighlightToDocument(Highlight highlight);

	Document getHighlightsByPath(String path);

	List<Document> getDocumentsByUser(List<Cookie> cookies);

}
