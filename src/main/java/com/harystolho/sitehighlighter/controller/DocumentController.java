package com.harystolho.sitehighlighter.controller;

import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.harystolho.sitehighlighter.model.Document;
import com.harystolho.sitehighlighter.service.DocumentService;
import com.harystolho.sitehighlighter.service.ServiceResponse;
import com.harystolho.sitehighlighter.utils.API_Response;

@Controller
public class DocumentController {

	private DocumentService documentService;

	@Autowired
	public DocumentController(DocumentService documentService) {
		this.documentService = documentService;
	}

	@GetMapping("/api/v1/documents")
	@ResponseBody
	public API_Response getDocuments(HttpServletRequest req) {
		ServiceResponse<List<Document>> response = documentService.listDocuments(Arrays.asList(req.getCookies()));

		switch (response.getStatus()) {
		case FAIL:
			return API_Response.of("FAIL", null);
		default:
			break;
		}

		return API_Response.of("OK", response.getResponse());
	}

	@GetMapping("/api/v1/document/{id}")
	@ResponseBody
	public API_Response getDocument(HttpServletRequest req, @PathVariable int id) {
		ServiceResponse<Document> response = documentService.getDocument(Arrays.asList(req.getCookies()), id);

		switch (response.getStatus()) {
		case FAIL:
			return API_Response.of("FAIL", null);
		default:
			break;
		}

		return API_Response.of("OK", response.getResponse());
	}

	@PostMapping("/api/v1/document/save")
	@ResponseBody
	public API_Response saveDocument(HttpServletRequest req) {
		ServiceResponse<Object> response = documentService.saveDocument(Arrays.asList(req.getCookies()),
				req.getParameter("id"), req.getParameter("text"));

		switch (response.getStatus()) {
		case FAIL:
			return API_Response.of("FAIL", null);
		default:
			break;
		}

		return API_Response.of("OK", response.getResponse());
	}

}
