package com.harystolho.sitehighlighter.controller;

import java.util.Arrays;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
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

	@PostMapping("/api/v1/save")
	public API_Response saveHighlight(HttpServletRequest req, HttpServletResponse res) {
		ServiceResponse<Void> response = highlightService.saveHighlight(Arrays.asList(req.getCookies()),
				req.getParameter("text"), req.getParameter("path"));

		switch (response.getStatus()) {
		case FAIL:
			return API_Response.of("FAIL", null);
		default:
			break;
		}

		res.addCookie(new Cookie("highlight_id", "5fgjvd8u9015dbsl"));

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
