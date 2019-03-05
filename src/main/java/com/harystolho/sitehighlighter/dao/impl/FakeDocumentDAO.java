package com.harystolho.sitehighlighter.dao.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.harystolho.sitehighlighter.dao.DocumentDAO;
import com.harystolho.sitehighlighter.model.Document;
import com.harystolho.sitehighlighter.model.Highlight;

@Service
public class FakeDocumentDAO implements DocumentDAO {

	private List<Document> documents;

	public FakeDocumentDAO() {
		documents = new ArrayList<>();
	}

	public void addHighlightToDocument(Highlight highlight) {
		Optional<Document> document = documents.stream().filter((doc) -> {
			return doc.getPath().equalsIgnoreCase(highlight.getPath());
		}).findFirst();

		if (document.isPresent()) {
			document.get().addHighlight(highlight);
		} else {
			Document doc = new Document();
			doc.setPath(highlight.getPath());

			doc.addHighlight(highlight);

			documents.add(doc);
		}
	}

}
