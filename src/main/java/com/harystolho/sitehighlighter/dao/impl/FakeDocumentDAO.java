package com.harystolho.sitehighlighter.dao.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

import javax.servlet.http.Cookie;

import org.springframework.stereotype.Service;

import com.harystolho.sitehighlighter.dao.DocumentDAO;
import com.harystolho.sitehighlighter.model.Document;
import com.harystolho.sitehighlighter.model.Highlight;
import com.harystolho.sitehighlighter.utils.DocumentStatus;

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
			Document doc = new Document(highlight.getPageTitle());
			doc.setId(new Random().nextInt(5000));
			doc.setPath(highlight.getPath()); // TODO remove / at the end of path

			doc.addHighlight(highlight);

			documents.add(doc);
		}
	}

	@Override
	public void addHighlightToDocument(int docId, Highlight highlight) {
		Optional<Document> document = getDocumentById(null, docId);

		if (document.isPresent()) {
			document.get().addHighlight(highlight);
		} else {
			// return an error
		}
	}

	@Override
	public Document getHighlightsByPath(String path) {
		Optional<Document> document = documents.stream().filter((doc) -> {
			return doc.getPath().equalsIgnoreCase(path);
		}).findFirst();

		if (document.isPresent()) {
			return document.get();
		}

		return null;
	}

	@Override
	public List<Document> getDocumentsByUser(List<Cookie> cookies) {
		return documents;
	}

	@Override
	public Optional<Document> getDocumentById(List<Cookie> cookies, int id) {
		return documents.stream().filter((doc) -> {
			return doc.getId() == id;
		}).findFirst();
	}

	@Override
	public void updateDocumentText(int id, String text) {
		Optional<Document> document = getDocumentById(null, id);

		if (document.isPresent()) {
			document.get().setHighlights(text);
		}
	}

	@Override
	public void setDocumentStatus(int id, DocumentStatus status) {
		Optional<Document> document = getDocumentById(null, id);

		if (document.isPresent()) {
			document.get().setStatus(status);
		}
	}

	@Override
	public List<Document> getDocumentsByStatus(DocumentStatus status) {
		return documents.stream().filter((doc) -> doc.getStatus() == status).collect(Collectors.toList());
	}

}
