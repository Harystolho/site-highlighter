package com.harystolho.sitehighlighter.service;

public class ServiceResponse<T> {

	public static enum ServiceStatus {
		OK, FAIL, PROCESSING
	}

	private T response;
	private ServiceStatus status;

	public ServiceResponse(T response, ServiceStatus status) {
		this.response = response;
		this.status = status;
	}

	public static <T> ServiceResponse<T> of(T response, ServiceStatus status) {
		return new ServiceResponse<>(response, status);
	}

	public T getResponse() {
		return response;
	}

	public void setResponse(T response) {
		this.response = response;
	}

	public ServiceStatus getStatus() {
		return status;
	}

	public void setStatus(ServiceStatus status) {
		this.status = status;
	}

}
