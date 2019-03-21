package com.harystolho.sitehighlighter.auth;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import javax.servlet.http.Cookie;

import org.springframework.stereotype.Service;

/**
 * If a person using the highlight script/addon wants to authenticate with the
 * server, this is how it works: <br>
 * - The script makes a request to '/auth/temporary-id', the server creates a
 * temporary id and returns it <br>
 * - the script opens a new window/tab at the URL
 * '/auth/?temporary-id={id_here}', then the user signs in the normal way <br>
 * - If the login is successful the window is closed and the server attaches the
 * cookie to the {temp_id} specified in the query URL <br>
 * - The next time the user tries to send a request to the server, the script
 * first checks if there is a temporary-id, if there is, it requests the cookie
 * associated with the temporary-id and uses that to make other requests<br>
 * - The cookie value is stored in the localStorage in the browser
 * 
 * @author Harystolho
 *
 */
@Service
public class AuthenticationService {

	private Map<String, String> temporaryIds;

	private String INVALID_TOKEN = "invalid_token";

	public AuthenticationService() {
		this.temporaryIds = new HashMap<>();
	}

	public String generateId() {
		String newId = UUID.randomUUID().toString().replaceAll("-", "");

		if (temporaryIds.containsKey(newId)) {
			return generateId();
		} else {
			temporaryIds.put(newId, INVALID_TOKEN);
			return newId;
		}
	}

	public void bindCookie(String tempId, Cookie cookie) {
		temporaryIds.put(tempId, cookie.getValue());
	}

	/**
	 * 
	 * @param temporaryId
	 * @return <code>null</code> if there wasn't a request with this {temporaryId}.
	 *         <code>Optional.of(token)</code> If the user signed in successfully.
	 *         <code>Optional.empty()</code> If there was a request with this
	 *         {temporaryId} but the user hasn't signed in yet
	 */
	public Optional<String> getAuthToken(String temporaryId) {
		String token = temporaryIds.get(temporaryId);

		if (token == null) {
			return null;
		} else if (token != INVALID_TOKEN) {
			return Optional.of(token); // remove from map
		} else {
			return Optional.empty();
		}
	}

	// TODO if the user is already logged in ?

}
