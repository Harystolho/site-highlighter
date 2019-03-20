package com.harystolho.sitehighlighter.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.node.ArrayNode;
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
	public API_Response getDocuments(@RequestAttribute("highlight.accountId") String accountId) {
		ServiceResponse<List<Document>> response = documentService.listDocuments(accountId);

		switch (response.getStatus()) {
		case FAIL:
			return API_Response.of("FAIL", null);
		default:
			break;
		}

		return API_Response.of("OK", response.getResponse());
	}

	@GetMapping("/api/v1/document/{id}")
	public API_Response getDocument(@RequestAttribute("highlight.accountId") String accountId,
			@PathVariable String id) {
		ServiceResponse<Document> response = documentService.getDocumentById(accountId, id);

		switch (response.getStatus()) {
		case FAIL:
			return API_Response.of("FAIL", null);
		default:
			break;
		}

		return API_Response.of("OK", response.getResponse());
	}

	@PostMapping("/api/v1/document/save")
	public API_Response saveDocument(@RequestAttribute("highlight.accountId") String accountId,
			HttpServletRequest req) {
		ServiceResponse<Object> response = documentService.saveDocument(accountId, req.getParameter("id"),
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
	public API_Response changeDocumentStatus(@RequestAttribute("highlight.accountId") String accountId,
			HttpServletRequest req) {
		ServiceResponse<Object> response = documentService.changeDocumentStatus(accountId, req.getParameter("id"),
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
	/*
	 * public API_Response
	 * getDocumentsByStatus(@accountId(CookieService.HIGHLIGHT_ID) String accountId,
	 * 
	 * @PathVariable String status) {
	 */
	public API_Response getDocumentsByStatus(@PathVariable String status) {
		ServiceResponse<ArrayNode> response = documentService.getDocumentsByStatus("123", status);

		switch (response.getStatus()) {
		case FAIL:
			return API_Response.of("FAIL", null);
		default:
			break;
		}

		return API_Response.of("OK", response.getResponse());
	}

	@DeleteMapping("/api/v1/document/{id}")
	public API_Response deleteDocument(@RequestAttribute("highlight.accountId") String accountId,
			@PathVariable String id) {
		ServiceResponse<Void> response = documentService.deleteDocument(accountId, id);

		switch (response.getStatus()) {
		case FAIL:
			return API_Response.of("FAIL", null);
		default:
			break;
		}

		return API_Response.of("OK", response.getResponse());
	}
}
