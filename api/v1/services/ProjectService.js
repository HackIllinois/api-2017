var Checkit = require('checkit');
var _Promise = require('bluebird');
var _ = require('lodash');

var Mentor = require('../models/Mentor');
var Project = require('../models/Project');
var ProjectMentor = require('../models/ProjectMentor');
,
var errors = require('../errors');
var utils = require('../utils');
var roles = require('../utils/roles');


/**
 * Checks to see if a requestor valid permissions to create a new project
 * @param  {User} user creating the new project
 * @return {Promise} resolving to true if the user is an organizer
 * @throws InvalidParameterError when a user does not have correct permissions
 */
module.exports.canCreateProject = function (creator) {
	if(creator.hasRole(roles.SUPERUSER) || creator.hasRole(roles.ORGANIZERS)){
		return _Promise.resolve(true);
	}

	var message = "A project cannot be created with the provided credentials";
	return _Promise.reject(new errors.UnauthorizedError(message));
}


/**
 * Creates a project with the specificed attributes
 * @param  {Object} Contains name, description, repo, and is_published
 * @return {Promise} resolving to the newly-created project
 * @throws InvalidParameterError when a project exists with the specified name
 */
module.exports.createProject = function (attributes) {
	if(typeof attributes.repo === 'undefined'){
		attributes.description = '';
	}
	if(typeof attributes.isPublished === 'undefined'){
		attributes.isPublished = 0; //false
	}

	attributes.name = attributes.name.toLowerCase();

	var project = Project.forge(attributes);
	return project
		.validate()
		.catch(Checkit.Error, utils.errors.handleValidationError)
		.then(function (validated) {
			return Project.findByName(attributes.name);
		})
		.then(function (result){
			if (!_.isNull(result)) {
				var message = "A project with the given name already exists";
				var source = "name";
				throw new errors.InvalidParameterError(message, source);
			}

			return project
				.save()
				.then(function (project) {
					return project;
				});
		})
}


/**
 * Returns a project with the specified project id
 * @param  {int} ID of the project
 * @return {Promise} resolving to the project
 * @throws InvalidParameterError when a project doesn't exist with the specified ID
 */
module.exports.findProjectById = function (id) {
	return Project
		.findById(id)
		.then(function (result) {
			if(_.isNull(result)){
				var message = "A project with the given ID cannot be found";
				var source = "id";
				throw new errors.NotFoundError(message, source);
			}

			return _Promise.resolve(result);
		});
}

/**
 * Update a key value pair in a project
 * @param  {Project} Project that will be updated
 * @param  {String} Key is the name of the attribute
 * @param  {String} Value is the new value of the attribute
 * @return {Promise} resolving to the updated project
 */
module.exports.updateProject = function (project, key, value) {
	return project.set(key, value).save();
}


_isProjectMentorValid = function (project_id, mentor_id) {
	return Project
		.findById(project_id)
		.then(function (result) {
			if(!_.isNull(result)) {
				return _Promise.resolve(true);
			}else{
				return _Promise.resolve(false);
			}
		})
		.then(function (isValidSoFar) {
			if(isValidSoFar){
				return Mentor
					.findById(mentor_id)
					.then(function (res) {
						if(!_.isNull(res)) {
							return _Promise.resolve(true);
						}
					})
			}
			return _Promise.resolve(false);
		});
}

_deleteProjectMentor = function (project_id) {
	return ProjectMentor
		.where({ project_id: project_id }).fetch()
		.then(function(oldProjectMentor) {
			if(_.isNull(oldProjectMentor)) {
				var message = "A project with the given ID cannot be found";
				var source = "id";
				throw new errors.NotFoundError(message, source);
			}
			return oldProjectMentor.destroy();
		});
}


/**
 * Add a new project-mentor relationship
 * @param  {Int} ID of the project assigned to the mentor
 * @param  {Int} ID of the mentor assigned to the project
 * @return {Promise} resolving to the new relationship
 * @throws InvalidParameterError when a project or mentor doesn't exist with the specified ID
 */
module.exports.addProjectMentor = function (project_id, mentor_id) {
	var projectMentor = ProjectMentor.forge({ project_id: project_id, mentor_id: mentor_id });

	return _isProjectMentorValid(project_id, mentor_id)
		.then(function (isValid) {
			if(!isValid){
				var message = "A project or mentor with the given IDs cannot be found";
				var source = "id";
				throw new errors.NotFoundError(message, source);
			}

			return null;
		})
		.then(function () {
			return ProjectMentor.findByProjectId(project_id);
		})
		.then(function (result) {
			if (!_.isNull(result)) {
				if(result.attributes.mentorId != mentor_id){
					_deleteProjectMentor(project_id);
				}else{
					//There already exists the project mentor
					return _Promise.resolve(result);
				}
			}

			return projectMentor
				.save()
				.then(function (projectMentor) {
					return projectMentor;
				});
		});
}

/**
 * Deletes a project-mentor relationship
 * @param  {Int} ID of the project in question
 * @param  {Int} ID of the mentor in question
 * @return {Promise} resolving to the deleted relationship
 * @throws InvalidParameterError when a project or mentor doesn't exist with the specified ID
 */
module.exports.deleteProjectMentor = function (project_id, mentor_id) {
	return _isProjectMentorValid(project_id, mentor_id)
		.then(function (isValid) {
			if(!isValid){
				var message = "A project or mentor with the given IDs cannot be found";
				var source = "id";
				throw new errors.NotFoundError(message, source);
			}

			return null;
		})
		.then(function () {
			return _deleteProjectMentor(project_id, mentor_id);
		});
}

