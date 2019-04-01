package com.harystolho.sitehighlighter.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.harystolho.sitehighlighter.model.Document;
import com.harystolho.sitehighlighter.service.DocumentService;
import com.harystolho.sitehighlighter.service.ServiceResponse;

@RestController
public class DocumentController {

	private DocumentService documentService;

	@Autowired
	public DocumentController(DocumentService documentService) {
		this.documentService = documentService;
	}

	@GetMapping("/api/v1/documents")
	public ResponseEntity<Object> getDocuments(@RequestAttribute("highlight.accountId") String accountId) {
		ServiceResponse<List<Document>> response = documentService.listDocuments(accountId);

		switch (response.getStatus()) {
		case FAIL:
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		default:
			return ResponseEntity.status(HttpStatus.OK).body(response.getResponse());
		}
	}

	@GetMapping("/api/v1/documents/{id}")
	public ResponseEntity<Object> getDocument(@RequestAttribute("highlight.accountId") String accountId,
			@PathVariable String id) {
		ServiceResponse<Document> response = documentService.getDocumentById(accountId, id);

		switch (response.getStatus()) {
		case FAIL:
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		default:
			return ResponseEntity.status(HttpStatus.OK).body(response.getResponse());
		}
	}

	@PostMapping("/api/v1/documents/{id}/save")
	public ResponseEntity<Object> saveDocument(@RequestAttribute("highlight.accountId") String accountId,
			@PathVariable String id, @RequestParam("text") String text) {
		ServiceResponse<Object> response = documentService.saveDocument(accountId, id, text);

		switch (response.getStatus()) {
		case FAIL:
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		default:
			return ResponseEntity.status(HttpStatus.OK).body(response.getResponse());
		}
	}

	@PostMapping("/api/v1/documents/{id}/status")
	public ResponseEntity<Object> changeDocumentStatus(@RequestAttribute("highlight.accountId") String accountId,
			@PathVariable String id, @RequestParam("status") String status) {
		ServiceResponse<Object> response = documentService.changeDocumentStatus(accountId, id, status);

		switch (response.getStatus()) {
		case FAIL:
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		default:
			return ResponseEntity.status(HttpStatus.OK).body(response.getResponse());
		}
	}

	@CrossOrigin()
	@GetMapping("/api/v1/documents/status/{status}")
	public ResponseEntity<Object> getDocumentsByStatus(@RequestAttribute("highlight.accountId") String accountId,
			@PathVariable String status) {
		ServiceResponse<ArrayNode> response = documentService.getDocumentsByStatus(accountId, status);

		switch (response.getStatus()) {
		case FAIL:
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		default:
			return ResponseEntity.status(HttpStatus.OK).body(response.getResponse());
		}
	}

	@DeleteMapping("/api/v1/documents/{id}")
	public ResponseEntity<Object> deleteDocument(@RequestAttribute("highlight.accountId") String accountId,
			@PathVariable String id) {
		ServiceResponse<Void> response = documentService.deleteDocument(accountId, id);

		switch (response.getStatus()) {
		case FAIL:
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		default:
			return ResponseEntity.status(HttpStatus.OK).body(response.getResponse());
		}
	}

	@PostMapping("/api/v1/documents/{docId}/tags")
	public ResponseEntity<Object> changeDocumentTags(@RequestAttribute("highlight.accountId") String accountId,
			@PathVariable String docId, @RequestParam("tags") String tags) {

		ServiceResponse<Object> response = documentService.changeDocumentTags(accountId, docId, tags);

		switch (response.getStatus()) {
		case FAIL:
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		default:
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
		}
	}

	/**
	 * @param accountId
	 * @return all the tags from all the documents that belong to the accoundId
	 */
	@GetMapping("/api/v1/documents/tags")
	public ResponseEntity<Object> getDocumentTagsByAccountId(
			@RequestAttribute("highlight.accountId") String accountId) {

		ServiceResponse<Map<String, List<String>>> response = documentService.getDocumentsTags(accountId);

		switch (response.getStatus()) {
		case FAIL:
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		default:
			return ResponseEntity.status(HttpStatus.OK).body(response.getResponse());
		}
	}
	
	@PatchMapping("/api/v1/documents/{docId}/title")
	public ResponseEntity<Object> changeDocumentTitle(@RequestAttribute("highlight.accountId") String accountId,
			@PathVariable String docId, @RequestParam("title") String title) {

		ServiceResponse<Object> response = documentService.changeDocumentTitle(accountId, docId, title);

		switch (response.getStatus()) {
		case FAIL:
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		default:
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
		}
	}
}
