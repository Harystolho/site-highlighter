package com.harystolho.sitehighlighter.dao;

import java.util.List;

import com.harystolho.sitehighlighter.model.Highlight;

public interface DocumentDAO {

	void saveHighlight(Highlight highlight);

	List<Highlight> getHighlightsByPath(String path);

}
