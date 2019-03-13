package com.harystolho.sitehighlighter.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.harystolho.sitehighlighter.utils.DocumentStatus;

@org.springframework.data.mongodb.core.mapping.Document(collection = "documents")
public class Document {

	@Id
	private String id;

	private String owner;

	private String title;
	private String path; // Must be unique by user
	private String highlights;

	private DocumentStatus status = DocumentStatus.WOOD;

	public Document(String title, String owner) {
		this.title = title;
		this.owner = owner;
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

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public DocumentStatus getStatus() {
		return status;
	}

	public void setStatus(DocumentStatus status) {
		this.status = status;
	}

	public ObjectId getOwner() {
		return owner;
	}

	public void setOwner(ObjectId owner) {
		this.owner = owner;
	}

}
