package com.harystolho.sitehighlighter.converter;

import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.WritingConverter;
import org.springframework.stereotype.Component;

import com.harystolho.sitehighlighter.model.Document;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;

//@Component
//@WritingConverter
public class DocumentConverter implements Converter<Document, DBObject> {

	@Override
	public DBObject convert(Document doc) {
		DBObject object = new BasicDBObject();
		
		/*
		 * object.put("_id", doc.getId()); object.put("owner", doc.getId());
		 * object.put("title", doc.getId()); object.put("path", doc.getId());
		 * object.put("highlights", doc.getId()); object.put("status", doc.getId());
		 * 
		 * object.removeField("_class");
		 */
		
		return null;
	}

}
