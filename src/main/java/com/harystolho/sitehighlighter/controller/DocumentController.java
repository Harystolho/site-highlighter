package com.harystolho.sitehighlighter.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.harystolho.sitehighlighter.cookie.CookieService;
import com.harystolho.sitehighlighter.model.Document;
import com.harystolho.sitehighlighter.service.DocumentService;
import com.harystolho.sitehighlighter.service.ServiceResponse;
import com.harystolho.sitehighlighter.utils.API_Response;

@RestController
public class DocumentController {

	private DocumentService documentService;

	@Autowired
	public DocumentController(DocumentService documentService) {
		this.documentService = documentService;
	}

	@GetMapping("/api/v1/documents")
	public API_Response getDocuments(@CookieValue(CookieService.HIGHLIGHT_ID) String cookieValue) {
		ServiceResponse<List<Document>> response = documentService.listDocuments(cookieValue);

		switch (response.getStatus()) {
		case FAIL:
			return API_Response.of("FAIL", null);
		default:
			break;
		}

		return API_Response.of("OK", response.getResponse());
	}

	@GetMapping("/api/v1/document/{id}")
	public API_Response getDocument(@CookieValue(CookieService.HIGHLIGHT_ID) String cookieValue,
			@PathVariable String id) {
		ServiceResponse<Document> response = documentService.getDocumentById(cookieValue, id);

		switch (response.getStatus()) {
		case FAIL:
			return API_Response.of("FAIL", null);
		default:
			break;
		}

		return API_Response.of("OK", response.getResponse());
	}

	@PostMapping("/api/v1/document/save")
	public API_Response saveDocument(@CookieValue(CookieService.HIGHLIGHT_ID) String cookieValue,
			HttpServletRequest req) {
		ServiceResponse<Object> response = documentService.saveDocument(cookieValue, req.getParameter("id"),
				req.getParameter("text"));

		switch (response.getStatus()) {
		case FAIL:
			return API_Response.of("FAIL", null);
		default:
			break;
		}

		return API_Response.of("OK", response.getResponse());
	}

	@PostMapping("/api/v1/document/status")
	public API_Response changeDocumentStatus(@CookieValue(CookieService.HIGHLIGHT_ID) String cookieValue,
			HttpServletRequest req) {
		ServiceResponse<Object> response = documentService.changeDocumentStatus(cookieValue, req.getParameter("id"),
				req.getParameter("status"));

		switch (response.getStatus()) {
		case FAIL:
			return API_Response.of("FAIL", null);
		default:
			break;
		}

		return API_Response.of("OK", response.getResponse());
	}

	@CrossOrigin
	@GetMapping("/api/v1/document/status/{status}")
	public API_Response getDocumentsByStatus(@CookieValue(CookieService.HIGHLIGHT_ID) String cookieValue,
			@PathVariable String status) {
		ServiceResponse<ArrayNode> response = documentService.getDocumentsByStatus(cookieValue, status);

		switch (response.getStatus()) {
		case FAIL:
			return API_Response.of("FAIL", null);
		default:
			break;
		}

		return API_Response.of("OK", response.getResponse());
	}

	@DeleteMapping("/api/v1/document/{id}")
	public API_Response deleteDocument(@CookieValue(CookieService.HIGHLIGHT_ID) String cookieValue,
			@PathVariable String id) {
		ServiceResponse<Void> response = documentService.deleteDocument(cookieValue, id);

		switch (response.getStatus()) {
		case FAIL:
			return API_Response.of("FAIL", null);
		default:
			break;
		}

		return API_Response.of("OK", response.getResponse());
	}
}
