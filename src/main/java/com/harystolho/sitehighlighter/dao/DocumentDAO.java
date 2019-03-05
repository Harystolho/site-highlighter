package com.harystolho.sitehighlighter.dao;

import com.harystolho.sitehighlighter.model.Document;
import com.harystolho.sitehighlighter.model.Highlight;

public interface DocumentDAO {

	void addHighlightToDocument(Highlight highlight);

	Document getHighlightsByPath(String path);

}
