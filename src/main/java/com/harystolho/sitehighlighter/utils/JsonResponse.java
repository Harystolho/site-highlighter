package com.harystolho.sitehighlighter.utils;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class JsonResponse {

	public static ObjectNode error(String message) {
		return object("message", message);
	}

	public static ObjectNode object(String name, String value) {
		ObjectNode node = createNode();

		node.put(name, value);

		return node;
	}

	private static ObjectNode createNode() {
		return new ObjectNode(new JsonNodeFactory(false));
	}

}
