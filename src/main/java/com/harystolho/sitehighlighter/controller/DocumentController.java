package com.harystolho.sitehighlighter.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.harystolho.sitehighlighter.model.Document;
import com.harystolho.sitehighlighter.service.DocumentService;
import com.harystolho.sitehighlighter.service.ServiceResponse;
import com.harystolho.sitehighlighter.utils.API_Response;
import com.harystolho.sitehighlighter.utils.DocumentStatus;

@RestController
public class DocumentController {

	private DocumentService documentService;

	@Autowired
	public DocumentController(DocumentService documentService) {
		this.documentService = documentService;
	}

	@GetMapping("/api/v1/documents")
	public API_Response getDocuments(HttpServletRequest req) {
		List<Cookie> cookies = req.getCookies() == null ? new ArrayList<>() : Arrays.asList(req.getCookies());

		ServiceResponse<List<Document>> response = documentService.listDocuments(cookies);

		switch (response.getStatus()) {
		case FAIL:
			return API_Response.of("FAIL", null);
		default:
			break;
		}

		return API_Response.of("OK", response.getResponse());
	}

	@GetMapping("/api/v1/document/{id}")
	public API_Response getDocument(HttpServletRequest req, @PathVariable String id) {
		List<Cookie> cookies = req.getCookies() == null ? new ArrayList<>() : Arrays.asList(req.getCookies());

		ServiceResponse<Document> response = documentService.getDocumentById(cookies, id);

		switch (response.getStatus()) {
		case FAIL:
			return API_Response.of("FAIL", null);
		default:
			break;
		}

		return API_Response.of("OK", response.getResponse());
	}

	@PostMapping("/api/v1/document/save")
	public API_Response saveDocument(HttpServletRequest req) {
		List<Cookie> cookies = req.getCookies() == null ? new ArrayList<>() : Arrays.asList(req.getCookies());

		ServiceResponse<Object> response = documentService.saveDocument(cookies, req.getParameter("id"),
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
	public API_Response changeDocumentStatus(HttpServletRequest req) {
		List<Cookie> cookies = req.getCookies() == null ? new ArrayList<>() : Arrays.asList(req.getCookies());

		ServiceResponse<Object> response = documentService.changeDocumentStatus(cookies, req.getParameter("id"),
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
	public API_Response getDocumentsByStatus(HttpServletRequest req, @PathVariable String status) {
		List<Cookie> cookies = req.getCookies() == null ? new ArrayList<>() : Arrays.asList(req.getCookies());

		ServiceResponse<ArrayNode> response = documentService.getDocumentsByStatus(cookies, status);

		switch (response.getStatus()) {
		case FAIL:
			return API_Response.of("FAIL", null);
		default:
			break;
		}

		return API_Response.of("OK", response.getResponse());
	}
	
	@DeleteMapping("/api/v1/document/{id}")
	public API_Response deleteDocument(HttpServletRequest req, @PathVariable String id) {
		List<Cookie> cookies = req.getCookies() == null ? new ArrayList<>() : Arrays.asList(req.getCookies());
		
		ServiceResponse<Void> response = documentService.deleteDocument(cookies, id);

		switch (response.getStatus()) {
		case FAIL:
			return API_Response.of("FAIL", null);
		default:
			break;
		}

		return API_Response.of("OK", response.getResponse());
	}
}
