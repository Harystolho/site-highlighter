package com.harystolho.sitehighlighter.utils;

public class API_Response {

	private String error;
	private Object data = "";

	public static API_Response of(String error, Object data) {
		API_Response response = new API_Response();
		response.setError(error);
		response.setData(data);
		return response;
	}

	public void setError(String error) {
		this.error = error;
	}

	public void setData(Object data) {
		this.data = data;
	}

	public String getError() {
		return error;
	}

	public Object getData() {
		return data;
	}

}
