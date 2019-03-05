package com.harystolho.sitehighlighter.model;

public class Document {

	private String path;
	private String highlights;

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
		this.highlights += "\r\n\r\n" + highlight.getText();
	}

}
