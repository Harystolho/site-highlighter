package com.harystolho.sitehighlighter.service;

import java.util.List;
import java.util.logging.Logger;

import javax.servlet.http.Cookie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.harystolho.sitehighlighter.dao.DocumentDAO;
import com.harystolho.sitehighlighter.model.Document;

@Service
public class DocumentService {

	private static final Logger logger = Logger.getLogger(DocumentService.class.getName());

	private DocumentDAO documentDao;

	@Autowired
	public DocumentService(DocumentDAO documentDAO) {
		this.documentDao = documentDAO;
	}

	public ServiceResponse<List<Document>> listDocuments(List<Cookie> asList) {
		return null;
	}

}
