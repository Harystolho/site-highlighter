package com.harystolho.sitehighlighter.utils;

/**
 * The status grants the document some priorities, for example the gold status
 * makes the document available in the selection option when choosing where to
 * save a new highlight.
 * 
 * @author Harystolho
 *
 */
public enum DocumentStatus {
	WOOD, // Default
	GOLD; // Document available in custom save select input

	DocumentStatus() {

	}

	public static DocumentStatus statusFromString(String status) {
		switch (status.toUpperCase()) {
		case "GOLD":
			return GOLD;
		default:
			return WOOD;
		}
	}
}
