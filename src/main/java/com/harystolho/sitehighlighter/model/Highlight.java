package com.harystolho.sitehighlighter.model;

public class Highlight {

	private String text;
	private String path;
	private String pageTitle;

	public Highlight(String text, String path, String title) {
		this.text = text;
		this.path = path;
		this.pageTitle = title;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getPageTitle() {
		return pageTitle;
	}

	public void setPageTitle(String pageTitle) {
		this.pageTitle = pageTitle;
	}

}
