var requests = require('./requests');

var endpoints = {};

endpoints['/v1/user'] = {
	POST: requests.HackerUserCreationRequest
};
endpoints['/v1/user/accredited'] = {
	POST: requests.AccreditedUserCreationRequest
};
endpoints['/v1/user/reset'] = {
	POST: requests.ResetTokenRequest
};
endpoints['/v1/auth/reset'] = {
	POST: requests.ResetPasswordRequest
};
endpoints['/v1/auth'] = {
	POST: requests.AuthTokenRequest
};
endpoints['/registration/admin'] = {
	POST: requests.RegisteredAdminCreationRequest,
	PUT: requests.RegisteredAdminCreationRequest
};
endpoints['/registration/hacker'] = {
	POST: requests.RegisteredHackerCreationRequest,
	PUT: requests.RegisteredHackerCreationRequest
};
endpoints['/registration/mentor'] = {
	POST: requests.RegisteredMentorCreationRequest,
	PUT: requests.RegisteredMentorCreationRequest
};
endpoints['/registration/sponsor'] = {
	POST: requests.RegisteredSponsorCreationRequest,
	PUT: requests.RegisteredSponsorCreationRequest
};
endpoints['/registration/staff'] = {
	POST: requests.RegisteredStaffCreationRequest,
	PUT: requests.RegisteredStaffCreationRequest
};
endpoints['/registration/volunteer'] = {
	POST: requests.RegisteredVolunteerCreationRequest,
	PUT: requests.RegisteredVolunteerCreationRequest
};
endpoints['/team'] = {
	POST: requests.TeamRequest,
	PUT: requests.TeamRequest
};
endpoints['/v1/upload/resume'] = {
	POST: requests.UploadRequest
};
endpoints['/v1/upload/resume/:id'] = {
	PUT: requests.UploadRequest
};

module.exports = endpoints;
