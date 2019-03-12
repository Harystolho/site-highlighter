package com.harystolho.sitehighlighter.model;

import com.harystolho.sitehighlighter.utils.DocumentStatus;

public class Document {

	private int id;

	private String title;
	private String path;
	private String highlights;

	private DocumentStatus status = DocumentStatus.WOOD;

	public Document(String title) {
		this.title = title;
		highlights = "";
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getHighlights() {
		return highlights;
	}

	public void setHighlights(String highlights) {
		this.highlights = highlights;
	}

	public void addHighlight(Highlight highlight) {
		highlights += highlight.getText();
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public DocumentStatus getStatus() {
		return status;
	}

	public void setStatus(DocumentStatus status) {
		this.status = status;
	}

}
