package com.harystolho.sitehighlighter.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.harystolho.sitehighlighter.model.Document;
import com.harystolho.sitehighlighter.service.HighlightService;
import com.harystolho.sitehighlighter.service.ServiceResponse;

@RestController
@CrossOrigin
public class HighlightController {

	private HighlightService highlightService;

	@Autowired
	public HighlightController(HighlightService highlightService) {
		this.highlightService = highlightService;
	}

	@PostMapping("/api/v1/save")
	public ResponseEntity<Object> saveHighlight(@RequestAttribute("highlight.accountId") String accountId,
			@RequestParam("text") String text, @RequestParam("path") String path, @RequestParam("title") String title) {

		ServiceResponse<Void> response = highlightService.saveHighlight(accountId, text, path, title);

		switch (response.getStatus()) {
		case FAIL:
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		default:
			return ResponseEntity.status(HttpStatus.OK).build();
		}
	}

	/**
	 * Appends the highlight to an existing document
	 * 
	 * @param req
	 * @param id  {@link Document#getId()}
	 * @return
	 */
	@PostMapping("/api/v1/save/{id}")
	public ResponseEntity<Object> saveHighlightWithId(@RequestAttribute("highlight.accountId") String accountId,
			@PathVariable String id, @RequestParam("text") String text) {

		ServiceResponse<Void> response = highlightService.saveHighlightToDocument(accountId, id, text);

		switch (response.getStatus()) {
		case FAIL:
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		default:
			return ResponseEntity.status(HttpStatus.OK).build();
		}

	}

}
