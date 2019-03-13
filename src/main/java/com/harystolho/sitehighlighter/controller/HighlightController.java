package com.harystolho.sitehighlighter.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.harystolho.sitehighlighter.model.Document;
import com.harystolho.sitehighlighter.service.HighlightService;
import com.harystolho.sitehighlighter.service.ServiceResponse;
import com.harystolho.sitehighlighter.utils.API_Response;

@RestController
public class HighlightController {

	private HighlightService highlightService;

	@Autowired
	public HighlightController(HighlightService highlightService) {
		this.highlightService = highlightService;
	}

	@CrossOrigin
	@PostMapping("/api/v1/save")
	public API_Response saveHighlight(HttpServletRequest req, HttpServletResponse res) {
		List<Cookie> cookies = req.getCookies() == null ? new ArrayList<>() : Arrays.asList(req.getCookies());

		ServiceResponse<Void> response = highlightService.saveHighlight(cookies, req.getParameter("text"),
				req.getParameter("path"), req.getParameter("title"));

		switch (response.getStatus()) {
		case FAIL:
			return API_Response.of("FAIL", null);
		default:
			break;
		}

		res.addCookie(new Cookie("highlight_id", "5fgjvd8u9015dbsl"));

		return API_Response.of("OK", null);
	}

	/**
	 * Appends the highlight to an existing document
	 * 
	 * @param req
	 * @param id  {@link Document#getId()}
	 * @return
	 */
	@CrossOrigin
	@PostMapping("/api/v1/save/{id}")
	public API_Response saveHighlightWithId(HttpServletRequest req, @PathVariable String id,
			@RequestParam(name = "text") String text) {
		List<Cookie> cookies = req.getCookies() == null ? new ArrayList<>() : Arrays.asList(req.getCookies());

		ServiceResponse<Void> response = highlightService.saveHighlightToDocument(cookies, id, text);

		switch (response.getStatus()) {
		case FAIL:
			return API_Response.of("FAIL", null);
		default:
			break;
		}

		return API_Response.of("OK", null);
	}

	@PostMapping("/api/v1/highlight")
	public API_Response listHighlightsByPath(HttpServletRequest req) {
		ServiceResponse<Document> response = highlightService.listHighlights(Arrays.asList(req.getCookies()),
				req.getParameter("path"));

		switch (response.getStatus()) {
		case FAIL:
			return API_Response.of("FAIL", null);
		default:
			break;
		}

		return API_Response.of("OK", response.getResponse());
	}

}
