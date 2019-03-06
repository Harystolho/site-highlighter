package com.harystolho.sitehighlighter.dao.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import javax.servlet.http.Cookie;

import org.springframework.stereotype.Service;

import com.harystolho.sitehighlighter.dao.DocumentDAO;
import com.harystolho.sitehighlighter.model.Document;
import com.harystolho.sitehighlighter.model.Highlight;

@Service
public class FakeDocumentDAO implements DocumentDAO {

	private List<Document> documents;

	public FakeDocumentDAO() {
		documents = new ArrayList<>();

		Document d1 = new Document("D1 Document for testing purposes only");
		d1.setId(1233);
		d1.setPath("www.jamesclear.com");
		d1.setHighlights("This is a simple <b> test</b>");
		documents.add(d1);
	}

	public void addHighlightToDocument(Highlight highlight) {
		Optional<Document> document = documents.stream().filter((doc) -> {
			return doc.getPath().equalsIgnoreCase(highlight.getPath());
		}).findFirst();

		if (document.isPresent()) {
			document.get().addHighlight(highlight);
		} else {
			Document doc = new Document(highlight.getPageTitle());
			doc.setId(new Random().nextInt(500));
			doc.setPath(highlight.getPath()); // TODO remove / at the end of path

			doc.addHighlight(highlight);

			documents.add(doc);
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

}
