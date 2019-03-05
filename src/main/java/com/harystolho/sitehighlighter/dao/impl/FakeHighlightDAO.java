package com.harystolho.sitehighlighter.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.harystolho.sitehighlighter.dao.HighlightDAO;
import com.harystolho.sitehighlighter.model.Highlight;

@Service
public class FakeHighlightDAO implements HighlightDAO {

	private List<Highlight> highlights;

	public FakeHighlightDAO() {
		highlights = new ArrayList<>();
	}

	@Override
	public void saveHighlight(Highlight highlight) {
		highlights.add(highlight);
	}

}
