package com.harystolho.sitehighlighter.converter;

import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.WritingConverter;
import org.springframework.stereotype.Component;

import com.harystolho.sitehighlighter.model.Document;
import com.mongodb.DBObject;

//@Component
//@WritingConverter
public class DocumentConverter implements Converter<Document, DBObject> {

	@Override
	public DBObject convert(Document source) {
		// TODO remove _class
		return null;
	}

}
